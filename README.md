# 🚚 Van Project: Parcel Delivery Management System
A comprehensive Node.js-based solution for efficient parcel delivery management featuring user authentication, real-time tracking, and intelligent delivery scheduling.
---
## 📦 Project Overview
The **Van Project** is designed for logistics companies and courier services seeking to streamline their parcel management operations. Built on a modern tech stack with **Express**, **MongoDB**, and **EJS**, this system delivers a responsive server-side rendered interface with secure, persistent user sessions.
---
## 🔧 Technologies Used
- **Node.js** – JavaScript runtime environment  
- **Express** – Fast, unopinionated web framework  
- **MongoDB & Mongoose** – NoSQL database with elegant ODM  
- **EJS** – Embedded JavaScript templating  
- **Express-session** – Secure session management  
- **UUID** – RFC-compliant unique identifier generation  
- **BCrypt** – Industry-standard password hashing  
- **Dotenv** – Environment configuration management  
---
## 🚀 Getting Started
### ✅ Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.x or later recommended)  
- [MongoDB](https://www.mongodb.com/) (v4.x or later)  
- [Git](https://git-scm.com/)  
---
### 🛠 Installation
1. **Clone the repository:**

```bash
git clone https://github.com/Ivan-Keli/Creative-Space.git
cd Creative-Space
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create a .env file in the root directory:**

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
```

4. **Start the application:**

```bash
npm start
```

The server will be running at [http://localhost:3000](http://localhost:3000)
---
## 📁 Project Structure

```
van-project/
├── app.js                 # Application entry point
├── .env                   # Environment variables
├── models/                # Database models
├── routes/                # API routes
├── views/                 # EJS templates
├── public/                # Static assets
├── config/                # Configuration files
└── package.json           # Project metadata
```
---
## 🛡️ Security Features
- Passwords are securely hashed using BCrypt
- Environment variables are managed via dotenv
- User sessions are maintained with express-session
- Unique IDs generated with UUID
---
## 📋 Version Information
- **Version:** 1.0.0
- **Main File:** app.js
- **Package Name:** van-project
- 
