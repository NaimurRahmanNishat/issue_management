# 🚀 Citizen Driven Issue Reporting & Tracking System (CDIRTS)

### Overview

Civic Issue Management System (CIMS) is a web-based platform designed to help citizens report public issues online and allow government authorities to track, manage, and resolve those issues efficiently.

The platform enables users to submit problems related to essential public services, while Admins (Government authorities) review and resolve them through a structured workflow.
The system is built with modern web technologies, role-based access control, and a scalable modular architecture.


### 🧠 Core Concept

| Role            | Responsibility                                                      |
| --------------- | ------------------------------------------------------------------- |
| **Super Admin** | System configuration, admin management, category & platform control |
| **Admin**       | Review reported issues, verify them, and update resolution status   |
| **User**        | Report public issues, track issue status, and provide feedback      |


### 🏷️ Issue Categories
```
💧 Water
⚡ Electricity
🔥 Gas
🛣️ Road
📦 Others
```

### 🔄 Issue Management Flow

1. User submits an issue with details and location
2. Issue is stored under a specific category
3. Admin reviews and verifies the issue
4. Admin updates the issue status:

-**Pending**
-**Approved**
-**In-Progress**
-**Resolved**
-**Reject**

5. User can track the issue status in real time

6. User can provide feedback after resolution


### 🌍 Location-Based Issue System
```
Country
 └── Division
     └── District
         └── City
             └── Area
```

### Location Rules

1. Locations can only be created and managed by Admin / Super Admin
2. Users must select a valid location when reporting an issue
3. Admins can only view and manage issues within their assigned locations


### 🏗️ System Architecture

```
Load Balanced Infrastructure

              ┌─────────────────┐
              │   Nginx :80     │
              │  Load Balancer  │
              └────────┬────────┘
                       │
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
 Frontend          Frontend          Frontend
  :5173              :5174              :5175
```

```
API Layer

        ┌───────────────┐
        │   Nginx :80   │
        │   /api route │
        └───────┬───────┘
                │
   ┌────────────┼────────────┐
   ▼            ▼            ▼
 Backend      Backend      Backend
  :5001        :5002        :5003
```

### 🧩 Backend – Modular Architecture
```
backend/
└── src/
    ├── config/
    ├── middlewares/
    ├── utils/
    ├── helper/
    └── modules/
        ├── auth
        ├── user
        ├── issue
        ├── category
        ├── location
        ├── notification
        ├── report
        └── dashboard
```

Each Module Contains
```
controller.ts
service.ts
repository.ts
model.ts
route.ts
validation.ts
requirement.txt
```

### Benefits
```
High maintainability
Easy scalability
Clear separation of concerns
```

### 🎨 Frontend Stack

Technologies Used
```
React + TypeScript
Redux Toolkit
Tailwind CSS
Framer Motion
shadcn/ui
zod & react-hook-form
Vite
```

Frontend Structure

```
frontend/
└── src/
    ├── assets/
    ├── components/
    ├── constants/
    ├── lib/
    ├── pages/
    ├── redux/
    ├── routes/
    ├── types/
    └── utils/
```

### 📊 Dashboards

👤 User Dashboard

🧑‍💼 Admin Dashboard

🛡️ Super Admin Dashboard

Each dashboard is role-protected and dynamically rendered based on user permissions.


### 🔐 Authentication & Security

1. JWT Authentication
2. Access Token, Refresh Token & csrf Token
3. Role-Based Access Control (RBAC)
4. Rate Limiting
5. Input Validation & Sanitization


### ⚙️ Key Features

1. Public issue reporting system
2. Category-based issue classification
3. Location-based issue tracking
4. Real-time issue status updates
5. Admin moderation and resolution workflow
6. Notification system
7. Scalable backend architecture
8. Secure authentication and authorization


### 🚀 Installation

Frontend
```
cd frontend
npm install
npm run dev
```

Backend
```
cd backend
npm install
npm run dev
```

### 🌐 Deployment

Frontend: Vercel

Backend: Docker + Nginx

Database: MongoDB Atlas

Cache: Redis


### 🤝 Contributing

Follow modular architecture guidelines

Write clean, readable, and documented code

Ensure role-based security

Test all features before submitting a Pull Request


### 📜 License

MIT License © Civic Issue Management System


### 🌟 CIMS

A Digital Platform for Transparent Citizen Issue Reporting & Resolution
