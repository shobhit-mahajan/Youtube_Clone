
# InternshalaTube - A YouTube Clone Using MERN Stack

## 🚀 Project Overview
InternshalaTube is a full-stack YouTube clone built using the **MERN Stack (MongoDB, Express.js, React, Node.js)**. This platform allows users to **watch, upload, and interact with videos**, providing an experience similar to YouTube.

## 📌 Features

### 🔹 Frontend (React.js)
- **Home Page**
  - Displays a **YouTube-like header**.
  - **Static sidebar with a toggle menu**.
  - **Filter buttons** for category-based searches.
  - **Video grid displaying:**
    - Title
    - Thumbnail
    - Channel Name
    - Views

- **User Authentication**
  - **User Registration & Login** using:
    - Username
    - Email
    - Password
  - **JWT-based authentication**.
  - Displays **user name after sign-in**.

- **Search & Filter Functionality**
  - **Search bar** to find videos by title.
  - **Category-based filter buttons**.

- **Video Player Page**
  - Embedded video player.
  - Displays:
    - **Video title & description**.
    - **Channel name**.
    - **Like/Dislike buttons**.
    - **Comment section** (Add, Edit, Delete comments).

- **Channel Page**
  - Users can **create a channel** (only after sign-in).
  - Displays a **list of videos** from a specific channel.
  - Users can **edit or delete their videos**.

- **Responsive Design**
  - Fully optimized for **desktop, tablet, and mobile devices**.

### 🔹 Backend (Node.js, Express.js, MongoDB)
- **User Authentication**
  - **Signup, login, and token-based authentication** using JWT.

- **Channel Management**
  - API to **create channels** and fetch channel details.

- **Video Management**
  - API to **upload, fetch, update, and delete videos**.

- **Comment Management**
  - API to **add, fetch, and manage comments**.

### 🔹 Database (MongoDB)
- Stores **users, videos, channels, and comments** in collections.
- Stores **file metadata** (video URL, thumbnail URL).

## 🛠️ Technologies Used
| Frontend | Backend | Authentication | Database | Version Control |
|----------|---------|---------------|---------|----------------|
| React.js | Node.js | JWT | MongoDB | Git & GitHub |
| React Router | Express.js | bcrypt.js | MongoDB Atlas | |

## 📂 Project Structure
```
InternshalaTube/
│── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.js
│   │   ├── index.js
│── .gitignore
│── package.json
│── README.md
```

## 🛠️ Setup & Installation

### 🔹 Prerequisites
- Node.js
- MongoDB (Local or MongoDB Atlas)
- Git

### 🔹 Steps to Run the Project

#### Clone the Repository
```sh
git clone https://github.com/your-username/InternshalaTube.git
cd InternshalaTube
```

#### Install Dependencies

**For Backend:**
```sh
cd backend
npm install
```

**For Frontend:**
```sh
cd frontend
npm install
```

#### Setup Environment Variables
Create a `.env` file inside the `backend/` directory and add:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

#### Start the Application

**Start Backend:**
```sh
cd backend
npm start
```

**Start Frontend:**
```sh
cd frontend
npm start
```

#### Access the App
Open `http://localhost:3000` in your browser.

## 📌 Sample Data

### 🔹 Video Data
```json
[
  {
    "videoId": "video01",
    "title": "Learn React in 30 Minutes",
    "thumbnailUrl": "https://example.com/thumbnails/react30min.png",
    "description": "A quick tutorial to get started with React.",
    "channelId": "channel01",
    "uploader": "user01",
    "views": 15200,
    "likes": 1023,
    "dislikes": 45,
    "uploadDate": "2024-09-20",
    "comments": [
      {
        "commentId": "comment01",
        "userId": "user02",
        "text": "Great video! Very helpful.",
        "timestamp": "2024-09-21T08:30:00Z"
      }
    ]
  }
]
```

### 🔹 User Data
```json
{
  "userId": "user01",
  "username": "JohnDoe",
  "email": "john@example.com",
  "password": "hashedPassword123",
  "avatar": "https://example.com/avatar/johndoe.png",
  "channels": ["channel01"]
}
```

### 🔹 Channel Data
```json
{
  "channelId": "channel01",
  "channelName": "Code with John",
  "owner": "user01",
  "description": "Coding tutorials and tech reviews by John Doe.",
  "channelBanner": "https://example.com/banners/john_banner.png",
  "subscribers": 5200,
  "videos": ["video01", "video02"]
}
```

## ✨ Contributing
Contributions are welcome!  
Feel free to fork the repository and submit a pull request.
