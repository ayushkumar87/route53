from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from database import get_db
from models import HostedZone, DNSRecord, User
from schemas import HostedZoneCreate, DNSRecordCreate, UserCreate, UserLogin
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

app = FastAPI()

# Allow our Next.js frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update to your Vercel URL after deploying
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Route53 clone backend is running!"}

@app.get("/stats")
def get_stats(
    db=Depends(get_db),
    user_id=Depends(get_current_user)
):
    zones_count = db.query(HostedZone).filter(HostedZone.user_id == user_id).count()
    records_count = db.query(DNSRecord).join(HostedZone).filter(HostedZone.user_id == user_id).count()
    
    return {
        "total_zones": zones_count,
        "total_records": records_count
    }


# =========================
# AUTHENTICATION
# =========================

@app.post("/register")
def register(user_data: UserCreate, db=Depends(get_db)):
    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }


@app.post("/login")
def login(user_data: UserLogin, db=Depends(get_db)):
    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user or not verify_password(
        user_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(user.id)

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer"
    }


# =========================
# HELPER
# =========================

def check_zone_owner(zone_id: int, user_id: int, db):
    zone = db.query(HostedZone).filter(
        HostedZone.id == zone_id,
        HostedZone.user_id == user_id
    ).first()

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted Zone not found"
        )

    return zone


# =========================
# HOSTED ZONES
# =========================


@app.post("/hosted-zones")
def create_hosted_zone(
    zone: HostedZoneCreate,
    db=Depends(get_db),
    user_id=Depends(get_current_user)
):
    new_zone = HostedZone(
        name=zone.name,
        description=zone.description,
        user_id=user_id
    )

    db.add(new_zone)
    db.commit()
    db.refresh(new_zone)

    return new_zone


@app.get("/hosted-zones/{zone_id}")
def get_hosted_zone(
    zone_id: int,
    db=Depends(get_db),
    user_id=Depends(get_current_user)
):
    return check_zone_owner(zone_id, user_id, db)


@app.put("/hosted-zones/{zone_id}")
def update_hosted_zone(
    zone_id: int,
    zone_data: HostedZoneCreate,
    db=Depends(get_db),
    user_id=Depends(get_current_user)
):
    zone = check_zone_owner(zone_id, user_id, db)

    zone.name = zone_data.name
    zone.description = zone_data.description

    db.commit()
    db.refresh(zone)

    return zone


@app.delete("/hosted-zones/{zone_id}")
def delete_hosted_zone(
    zone_id: int,
    db=Depends(get_db),
    user_id=Depends(get_current_user)
):
    zone = check_zone_owner(zone_id, user_id, db)

    db.delete(zone)
    db.commit()

    return {"message": "Hosted Zone deleted successfully"}


# =========================
# DNS RECORDS
# =========================
@app.get("/hosted-zones")
def get_hosted_zones(
    search: str = "",
    page: int = 1,
    limit: int = 10,
    db=Depends(get_db),
    user_id=Depends(get_current_user)
):
    query = db.query(HostedZone).filter(
        HostedZone.user_id == user_id
    )

    if search:
        query = query.filter(
            HostedZone.name.contains(search)
        )

    total = query.count()

    zones = query.offset(
        (page - 1) * limit
    ).limit(limit).all()

    return {
        "data": zones,
        "page": page,
        "limit": limit,
        "total": total
    }

@app.get("/hosted-zones/{zone_id}/records")
def get_records(
    zone_id: int,
    search: str = "",
    record_type: str = "",
    page: int = 1,
    limit: int = 10,
    db=Depends(get_db),
    user_id=Depends(get_current_user)
):
    check_zone_owner(zone_id, user_id, db)

    query = db.query(DNSRecord).filter(
        DNSRecord.hosted_zone_id == zone_id
    )

    if search:
        query = query.filter(
            DNSRecord.name.contains(search)
        )

    if record_type:
        query = query.filter(
            DNSRecord.type == record_type
        )

    total = query.count()

    records = query.offset(
        (page - 1) * limit
    ).limit(limit).all()

    return {
        "data": records,
        "page": page,
        "limit": limit,
        "total": total
    }

@app.post("/records")
def create_record(
    record: DNSRecordCreate,
    db=Depends(get_db),
    user_id=Depends(get_current_user)
):
    check_zone_owner(record.hosted_zone_id, user_id, db)

    new_record = DNSRecord(
        hosted_zone_id=record.hosted_zone_id,
        name=record.name,
        type=record.type,
        value=record.value,
        ttl=record.ttl
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return new_record


@app.put("/records/{record_id}")
def update_record(
    record_id: int,
    record_data: DNSRecordCreate,
    db=Depends(get_db),
    user_id=Depends(get_current_user)
):
    record = db.query(DNSRecord).filter(
        DNSRecord.id == record_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Record not found"
        )

    check_zone_owner(record.hosted_zone_id, user_id, db)

    record.name = record_data.name
    record.type = record_data.type
    record.value = record_data.value
    record.ttl = record_data.ttl

    db.commit()
    db.refresh(record)

    return record


@app.delete("/records/{record_id}")
def delete_record(
    record_id: int,
    db=Depends(get_db),
    user_id=Depends(get_current_user)
):
    record = db.query(DNSRecord).filter(
        DNSRecord.id == record_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Record not found"
        )

    check_zone_owner(record.hosted_zone_id, user_id, db)

    db.delete(record)
    db.commit()

    return {"message": "Record deleted successfully"}
