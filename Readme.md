# 💻 CodeSync – Real-Time Coding Interview Platform

CodeSessionHub is a full-stack collaborative coding interview platform built for real-time technical assessments, coding challenges, and whiteboarding interviews. It features a collaborative code editor, Judge0 code execution engine, live video calls, real-time whiteboard, and structured interview tools.

---

## ✨ Features

- 🧑‍💻 **Real-Time Code Collaboration** using Socket.IO
- ⚙️ **Code Execution** via [Judge0 API](https://judge0.com/)
- 📹 **Live Video Calling** (WebRTC-based, peer-to-peer)
- ✍️ **Shared Whiteboard** for problem solving & diagrams
- 🧭 **Room & Participant Management**
- 🧠 **Feedback & Notes Section**
- 🛡️ Interview-safe (no third-party distractions)

---


## 🛠️ Tech Stack

| Frontend | Backend     | Real-time | Code Execution |
|----------|-------------|-----------|----------------|
| React.js | Node.js     | Socket.IO | Judge0 API     |
| Tailwind | Express.js  | WebRTC    |                |
| Vite     | MongoDB     |           |                |

---

## 📂 Folder Structure

```bash
.
├── backend
│   ├── routes/
│   ├── models/
│   ├── sockets/
│   ├── utils/
│   └── server.js
├── client
│   ├── src/components/
│   ├── src/pages/
│   ├── src/App.jsx
│   └── tailwind.config.js
├── .env
└── README.md
