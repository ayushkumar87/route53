# 🌐 AWS Route53 Clone

<p align="center">
  <strong>A full-stack AWS Route53-inspired DNS management console</strong>
</p>

<p align="center">
  Manage Hosted Zones and DNS Records through a modern cloud-console interface.
</p>

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-TypeScript-black?logo=next.js)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite)
![SQLAlchemy](https://img.shields.io/badge/ORM-SQLAlchemy-D71F00)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss)
![JWT](https://img.shields.io/badge/Auth-JWT-purple?logo=jsonwebtokens)
![License](https://img.shields.io/badge/License-MIT-green)

</p>

---

## 🚀 Live Demo

### 👉 [Launch AWS Route53 Clone](https://route53-three.vercel.app/)

**Live Application:** https://route53-three.vercel.app/

> The frontend is deployed on Vercel.  
> The backend API must be running and accessible for full functionality.

---

## 📌 About The Project

**AWS Route53 Clone** is a full-stack web application inspired by the AWS Route53 DNS management console.

The project provides a cloud-console-style interface for managing:

- 👤 User authentication
- 🌐 Hosted Zones
- 📡 DNS Records
- 🔎 Search
- 🎯 Filtering
- 📄 Pagination
- ✏️ CRUD operations
- 🔐 JWT-based authorization

The project was built to demonstrate practical **full-stack development, REST API design, authentication, database modeling, and modern frontend development**.

---

# ✨ Features

## 🔐 Authentication

- User registration
- User login
- JWT authentication
- Password hashing
- Protected API routes
- Persistent authentication session
- Logout

---

## 🌐 Hosted Zone Management

Complete CRUD functionality:

- ➕ Create Hosted Zone
- 👀 View Hosted Zones
- ✏️ Edit Hosted Zone
- 🗑️ Delete Hosted Zone
- 🔎 Search Hosted Zones
- 📄 Pagination
- 👤 User-specific Hosted Zones

---

## 📡 DNS Record Management

Supported DNS record types:

| Record Type | Support |
|:---:|:---:|
| A | ✅ |
| AAAA | ✅ |
| CNAME | ✅ |
| TXT | ✅ |
| MX | ✅ |
| NS | ✅ |
| PTR | ✅ |
| SRV | ✅ |
| CAA | ✅ |

Operations:

- ➕ Create DNS Record
- 👀 View DNS Records
- ✏️ Edit DNS Record
- 🗑️ Delete DNS Record
- 🔎 Search Records
- 🎯 Filter by Record Type
- 📄 Pagination

---

## 📊 Dashboard

The application includes a Route53-inspired dashboard with:

- Hosted Zone statistics
- DNS Record statistics
- Quick actions
- Resource overview
- Cloud-console-style navigation

---

## 🎨 UI Features

The frontend is designed to resemble a modern AWS cloud console.

- AWS-inspired sidebar
- Top navigation
- Breadcrumbs
- Data tables
- Search controls
- Filter controls
- Pagination
- Forms
- Modals
- Confirmation dialogs
- Toast notifications
- Loading states
- Empty states
- Error handling
- Responsive layout

---

# 🛠️ Tech Stack

## Frontend

![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss)

- Next.js
- React
- TypeScript
- Tailwind CSS
- Next.js App Router

---

## Backend

![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python)

- FastAPI
- Python
- SQLAlchemy
- JWT
- Passlib
- REST APIs

---

## Database

![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite)

- SQLite
- SQLAlchemy ORM

---

# 🏗️ Architecture

```text
┌─────────────────────────────┐
│          Frontend           │
│       Next.js + React       │
│       TypeScript + CSS      │
└──────────────┬──────────────┘
               │
               │ HTTP / JSON
               │ JWT
               ▼
┌─────────────────────────────┐
│          Backend            │
│           FastAPI           │
│        REST API Layer       │
└──────────────┬──────────────┘
               │
               │ SQLAlchemy ORM
               ▼
┌─────────────────────────────┐
│          Database           │
│            SQLite           │
│         route53.db          │
└─────────────────────────────┘
