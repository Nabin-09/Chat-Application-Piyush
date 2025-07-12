# Software Requirements Specification (SRS)

## TeamTalk Pro+

**TeamTalk Pro+** enables authenticated users to communicate through public and private group channels or direct one-to-one chats, exchange documents, forward and reply to messages, and receive live updates via WebSockets. The system comprises a React front end using CSS modules, a Node.js + Express back end with Socket.IO and raw SQL, and a MySQL database. JWT-based authentication with cookie persistence secures all interactions.

- **Version**: 1.0  
- **Date**: 20 June 2025  
- **Program**: Summer Internship Training Program – 2025 (SITP’25)  
- **Status**: 1-Week Project Edition  
- **Duration**: 1 Week (5 Working Days + 2 Non-Working Days)



### Prepared By  
**Danishan Farookh**  
Technical Project Lead  
JKC Softwares LLP  
Mail: [danishan.farookh@jkcsoftwares.com](mailto:danishan.farookh@jkcsoftwares.com)  
GitHub: [Danishan1](https://github.com/Danishan1)    



## 1. Introduction

### 1.1 Purpose
This SRS defines the functional, non-functional, and system requirements for **TeamTalk Pro+**, a web-based chat application that supports real-time communication with public/private channels, file sharing, group and individual messaging, message reactions, chat forwarding, and an admin dashboard.

### 1.2 Scope
The system will be developed by 8 pairs (1 backend + 1 frontend dev each), with a focus on real-time features, persistence, scalability, and extensibility. It supports role-based access, user sessions, and real-time interactions using WebSockets and raw SQL on MySQL.

### 1.3 Intended Audience
- Developers (Frontend & Backend)  
- Team Leads  
- QA Testers  
- End Users (Internally, for project use/demo)


## 2. Overall Description

### 2.1 Product Perspective
**TeamTalk Pro+** is a standalone web application designed to function across modern browsers. It will have modular services for users, chats, messages, files, notifications, and admin.

### 2.2 User Classes and Characteristics
- **Regular Users**: Join chats, send messages, upload files.  
- **Admin Users**: Manage users, channels, files, and analytics.

### 2.3 Constraints
- Must be completed within 1 week  
- Technology stack is fixed  
- Must be deployable via Vercel (frontend) and Railway/Render (backend)


## 3. System Features and Functional Requirements

### 3.1 Authentication and User Profile

**Description**:  
Handles user registration, login, session persistence, and profile updates.

**Functional Requirements**:
- FR1.1: Users can register using email and password.  
- FR1.2: Password is hashed using bcrypt before storing.  
- FR1.3: Login generates a JWT stored in an HttpOnly cookie.  
- FR1.4: Sessions persist via cookies across reloads.  
- FR1.5: Users can view/edit their profile (username, avatar).  


### 3.2 Real-Time Messaging

**Description**:  
Enable real-time bidirectional messaging using Socket.IO.

**Functional Requirements**:
- FR2.1: Messages are instantly delivered to all users in a chat room.  
- FR2.2: Each message has sender ID, timestamp, content, and status.  
- FR2.3: Seen/Delivered status is broadcast in real time.  
- FR2.4: Message editing/deleting is supported by the original sender.  
- FR2.5: Each message can be a text, media, or file message.  


### 3.3 Chat History and Pagination

**Description**:  
All messages are stored in MySQL and loaded via pagination.

**Functional Requirements**:
- FR3.1: Messages are stored with a timestamp, userId, and chatId.  
- FR3.2: Load messages in pages (e.g., 20 per page).  
- FR3.3: Search by keyword (bonus).  
- FR3.4: Scroll up triggers loading older messages.  


### 3.4 File & Document Sharing

**Description**:  
Users can upload files (images, docs, etc.) inside chat.

**Functional Requirements**:
- FR4.1: Supported types: JPG, PNG, PDF, DOCX, XLSX, TXT.  
- FR4.2: Files stored in `/uploads/` or a cloud service.  
- FR4.3: File size limit: 10MB.  
- FR4.4: Frontend provides a download and open-in-new-tab link.  


### 3.5 Message Reply, Reaction & Forwarding

**Description**:  
Users can interact with messages through replies, reactions, and forwards.

**Functional Requirements**:
- FR5.1: Replying to a message links it visually to the original.  
- FR5.2: Users can react to messages with emojis.  
- FR5.3: Users can forward a message to another chat or user.  
- FR5.4: Forwarded messages maintain original sender + label.  


### 3.6 Group Chat and 1:1 Chat

**Description**:  
Supports both group (channel-based) and individual (user-to-user) chats.

**Functional Requirements**:
- FR6.1: Users can create a group chat with a name and members.  
- FR6.2: Users can initiate a private chat with another user.  
- FR6.3: Groups have roles (admin, member).  
- FR6.4: Admins can add/remove members.  


### 3.7 Online Presence & Typing Indicators

**Description**:  
Track online users and show typing indicators in real time.

**Functional Requirements**:
- FR7.1: User status (online/offline) is stored in memory and broadcasted.  
- FR7.2: “User is typing…” is shown when emitting a typing event.  
- FR7.3: User list updates dynamically as status changes.  


### 3.8 Notifications

**Description**:  
In-app notifications and alert sounds for new messages and events.

**Functional Requirements**:
- FR8.1: Display toast alerts for new messages in other channels.  
- FR8.2: Sound alert toggle is stored per user.  
- FR8.3: Unread message counter badge per chat.  


### 3.9 Admin Panel

**Description**:  
Admin dashboard with user, channel, message, and file management.

**Functional Requirements**:
- FR9.1: List all users with roles and statuses.  
- FR9.2: Remove users or ban them from a channel.  
- FR9.3: View chat volume per channel.  
- FR9.4: Delete spam messages/files from the dashboard.  


## 4. External Interface Requirements

### 4.1 User Interfaces
- Responsive web UI using React  
- Chat area, channel list, user list, settings menu  
- Admin dashboard for elevated users  

### 4.2 API Interfaces
- REST APIs for auth, users, channels, files  
- Socket.IO endpoints for real-time messaging and presence  


## 5. Non-Functional Requirements

| NFR ID | Description |
|--------|-------------|
| NFR1   | Should support up to 100 concurrent users |
| NFR2   | Response time for real-time events < 200ms |
| NFR3   | All sensitive data (passwords, tokens) must be encrypted |
| NFR4   | Frontend should load fully in < 2 seconds |
| NFR5   | Files must be virus-checked or validated for type/size |
| NFR6   | Must work on Chrome, Firefox, Edge, Safari (last 2 versions) |
