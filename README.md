# 🌠 DevPulse – Assignment-L2-02

# 🚀 Project Overview

![Project diagram](https://i.ibb.co.com/tp84XvB8/Assignment-L2-02.png)

#### DevPulse মূলত একটি backend-focused REST API project যেটি তৈরি করা হয়েছে modern industry-standard architecture follow করে।

---

## ✨ এই project-এ যা যা implement করা হয়েছে

- JWT Authentication ব্যবহার করা হয়েছে
- Role-based Authorization implement করা হয়েছে
- Modular Architecture follow করা হয়েছে
- Raw SQL ব্যবহার করা হয়েছে
- PostgreSQL database integrate করা হয়েছে
- Secure password hashing করা হয়েছে bcrypt দিয়ে
- Strict TypeScript maintain করা হয়েছে

---

# 🧩 Architecture Explanation

এই project-এ সম্পূর্ণ Modular Architecture follow করা হয়েছে যাতে project scalable, maintainable এবং reusable হয়।

---

# 📦 modules/

প্রতিটি feature আলাদা module আকারে organize করা হয়েছে।

বর্তমানে দুইটি module রয়েছে:

- auth
- issues

---

## প্রতিটি module এর ভিতরে

| File | Purpose |
|---|---|
| router | API route handle করে |
| controller | request/response manage করে |
| service | business logic handle করে |
| interface | TypeScript types/interface define করে |

---

# 🔐 Authentication Module

Authentication module এর মাধ্যমে:

- User Registration
- User Login
- JWT Token Generation
- Password Hashing
- Authorization

implement করা হয়েছে।

---

# 🔑 JWT Authentication Flow

```txt
Client Login Request
        ↓
Server Validate User
        ↓
Password Compare using bcrypt
        ↓
JWT Generate
        ↓
Client Receives Token
        ↓
Client Sends Authorization Header
        ↓
Middleware Verifies JWT
        ↓
Protected Route Access Granted
```

---

# 🛡️ Security Features

এই project-এ কিছু গুরুত্বপূর্ণ security practice follow করা হয়েছে:

- Password কখনো plain text আকারে store করা হয় না
- bcrypt hashing ব্যবহার করা হয়েছে
- JWT verify ছাড়া protected route access করা যায় না
- Role-based permission checking করা হয়েছে
- Invalid token হলে request reject করা হয়

---

# 👥 User Roles

## contributor

### Allowed Actions

- Account create করতে পারবে
- Login করতে পারবে
- Issue create করতে পারবে
- সব issue দেখতে পারবে
- নিজের issue update করতে পারবে

---

## maintainer

Contributor এর সব permission সহ:

- যেকোন issue update করতে পারবে
- যেকোন issue delete করতে পারবে
- Issue status change করতে পারবে

---

# 🗄️ Database Design

এই project-এ PostgreSQL database ব্যবহার করা হয়েছে।

---

# 👤 users Table

| Field | Description |
|---|---|
| id | Auto Increment ID |
| name | User Full Name |
| email | Unique Email |
| password | Hashed Password |
| role | contributor / maintainer |
| created_at | Created Time |
| updated_at | Updated Time |

---

# 📝 issues Table

| Field | Description |
|---|---|
| id | Auto Increment ID |
| title | Issue Title |
| description | Detailed Description |
| type | bug / feature_request |
| status | open / in_progress / resolved |
| reporter_id | Issue Creator ID |
| created_at | Created Time |
| updated_at | Updated Time |

---

# ⚡ Raw SQL Implementation

এই project-এ:

- কোনো ORM ব্যবহার করা হয়নি
- কোনো Query Builder ব্যবহার করা হয়নি
- Direct `pool.query()` ব্যবহার করা হয়েছে

---

## Example Query

```sql
SELECT * FROM issues;
```

```sql
INSERT INTO users(name, email, password)
VALUES($1, $2, $3);
```

---

# 🔄 API Modules

# 🔐 Auth Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | User Registration |
| POST | `/api/auth/login` | User Login |

---

# 🐞 Issues Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/issues` | Create Issue |
| GET | `/api/issues` | Get All Issues |
| GET | `/api/issues/:id` | Get Single Issue |
| PATCH | `/api/issues/:id` | Update Issue |
| DELETE | `/api/issues/:id` | Delete Issue |

---

# 🧠 Middleware System

Middleware folder-এ reusable middleware রাখা হয়েছে।

| Middleware | Purpose |
|---|---|
| auth.ts | JWT Verification |
| error.ts | Global Error Handling |
| index.d.ts | Express Request Extension |

---

# 🛠️ Utility Functions

Project-এ reusable utility functions ব্যবহার করা হয়েছে।

| Utility | Purpose |
|---|---|
| bcrypt.ts | Password Hashing |
| jwt.ts | JWT Generate & Verify |
| response.ts | Standard Response Format |
| validation.ts | Request Validation |

---

---

# 📌 Features Implemented

- ✅ User Registration
- ✅ User Login
- ✅ JWT Authentication
- ✅ Role-based Authorization
- ✅ Issue Create
- ✅ Issue Update
- ✅ Issue Delete
- ✅ Get All Issues
- ✅ Get Single Issue
- ✅ Protected Routes
- ✅ Global Error Handling
- ✅ Password Hashing
- ✅ Raw SQL Queries
- ✅ TypeScript Interfaces
- ✅ Modular Architecture

---

# 📈 Project Goals

এই project তৈরির মূল উদ্দেশ্য ছিল:

- Backend Architecture ভালোভাবে practice করা
- Secure REST API তৈরি করা
- TypeScript skill improve করা
- PostgreSQL ও Raw SQL ব্যবহার করা
- JWT Authentication system implement করা
- Industry-standard project structure follow করা

---

# 🧪 Development Focus

এই project-এ বিশেষভাবে focus করা হয়েছে:

- Clean Code
- Reusability
- Scalability
- Security
- Maintainability
- Proper Folder Structure
- Strict TypeScript Usage

---

