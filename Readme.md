# 💻 codeSync-Collaborative Coding Platform

- A real-time collaborative code editor that enables users to create or join coding sessions, write and edit code simultaneously with others, and execute code within the browser. The application ensures seamless live collaboration using WebSockets (Socket.io) and is built using the MERN stack. It supports real-time synchronization, dynamic room management, and live code execution, making it ideal for interviews, peer programming, or learning sessions. Deployed via Netlify (Frontend) and Render (Backend)

## 🚀  Live Demo

[https://codesync0.netlify.app](https://codesync0.netlify.app)  


## 🎯 Project Motivation

I built codeSync to:
- ✔ Simplify technical interviews – Conduct live coding tests without screen-sharing hassles
- ✔ Enable remote pair programming – Collaborate in real-time with syntax highlighting
- ✔ Support coding education – Teachers/students can interactively debug together
- ✔ Provide a lightweight alternative to heavyweight IDEs for quick collaborative tasks

## 🚀 Features

- 🧠 Real-time code synchronization using **Socket.IO**
- 📄 Multiple language support (e.g., JavaScript, Python, etc.)
- 🧑‍🤝‍🧑 Create and join collaborative coding rooms
- ⏱ Set coding duration and track room time
- 🧑‍💻 Interactive coding interface with syntax highlighting
- 🔄 Persistent room details through backend API
- 🧩 Error handling and toast notifications


## 🛠 Tech Stack and Role in Project

| Technology      | Purpose                                                                 |
|------------------|--------------------------------------------------------------------------|
| **React.js**      | Frontend framework used to build dynamic UI and routing via `react-router-dom` |
| **Node.js**       | JavaScript runtime to run backend code efficiently                      |
| **Express.js**    | Web framework used to create API endpoints                              |
| **MongoDB**       | NoSQL database used to store room data                                  |
| **Mongoose**      | ODM to model MongoDB data into JavaScript objects                       |
| **Socket.IO**     | Enables real-time, bi-directional communication between client and server |
| **Netlify**       | Hosts the React frontend application                                    |
| **Render**        | Hosts the backend API and manages deployment of Express server          |
| **Axios**         | Handles HTTP requests between frontend and backend                      |
| **dotenv**        | Manages environment variables securely                                  |
| **React Code Editor (like Monaco)** | Provides code editing UI with syntax highlighting |
| **Code Execution**  | Run code in 40+ languages using Judge0 API (sandboxed)            |


## 📁 Folder Structure

```
Collaborative-coding/
│
├── frontend/                  # React Frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable components (Editor, Modals, etc.)
│   │   ├── pages/           # Page-level components (Home, Interview)
│   │   ├── App.jsx          # Main routing and logic
│   │   └── index.js         # React root file
│   └── package.json         # Frontend dependencies and scripts
│
├── backend/                  # Node.js/Express Backend
│   ├── controllers/         # Business logic & socket handlers
│   ├── models/              # MongoDB schemas (Room, etc.)
│   ├── routes/              # Express route definitions
│   ├── server.js            # Entry point (Express + Socket.io setup)
│   └── package.json         # Backend dependencies and scripts
│
└── README.md                # Project documentation
```

## 🔧 Judge0 API Integration

- codeSync uses Judge0 API to provide secure, sandboxed code execution in 40+ languages.

## 📈 Future Enhancements

- Voice/Video Chat – Integrated communication
- Code Execution – Run code directly in sandboxed environments
- AI Pair Programmer – GPT-4 powered suggestions
- Themes/Plugins – Customizable editor experience

