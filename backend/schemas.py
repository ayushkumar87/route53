from pydantic import BaseModel
class HostedZoneCreate(BaseModel):
    name: str
    description: str | None = None

class DNSRecordCreate(BaseModel):
    hosted_zone_id: int
    name: str
    type: str
    value: str
    ttl: int = 300


class UserCreate(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str

class BulkDeleteRequest(BaseModel):
    ids: list[int]

class BindImportRequest(BaseModel):
    bind_content: str

