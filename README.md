# 📝 BlogHub — Full-Stack Blog Platform

BlogHub is a full-stack blog platform that allows users to register, log in, create and manage blogs, comment on posts, and manage their profiles. It also includes an admin role for managing users and moderating blog content.

The application is built with **React, Node.js, Express.js, and MongoDB**, with JWT-based authentication and a responsive glassmorphism user interface.

---

## 🚀 Live Demo

**Frontend:** https://blog-hub-full-stack-blog-platform.vercel.app/


---

## 📂 Repositories

| Part | Repository |
|---|---|
| 🎨 Frontend | [BlogHub Frontend](https://github.com/andrio-fernandes/BlogHub-Full-Stack-Blog-Platform) |
| ⚙️ Backend | [BlogHub Backend](https://github.com/andrio-fernandes/BlogHub-Full-Stack-Blog-Platform-Backend) |

---

## ✨ Features

### 👤 Authentication & User Management

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes for authenticated users
- User profile with name, email, role, and join date
- Role-based access control

### ✍️ Blog Management

- View all blogs
- View individual blog details
- Create new blogs
- Edit your own blogs
- Delete your own blogs
- View blogs created by the logged-in user
- Author-based edit and delete permissions

### 💬 Comment System

- Add comments to blog posts
- Delete your own comments
- Blog authors can remove comments from their posts
- Admins can delete any comment

### 🔍 Blog Search

- Search blogs by title
- Regex-safe search
- Handles special characters without causing search errors

### 🛡️ Admin Features

- Admin-only protected routes
- View all registered users
- Delete any blog
- Delete any comment
- Additional content moderation controls

### 🎨 User Interface

- Modern glassmorphism design
- Responsive layout
- Toast notifications
- Loading states
- Error states
- Success states
- Empty states
- Form validation
- Delete confirmations
- Custom 404 page

---

## 🛠️ Tech Stack

### Frontend

- **React**
- **Vite**
- **React Router DOM**
- **Axios**
- **CSS**

### Backend

- **Node.js**
- **Express.js**

### Database

- **MongoDB**
- **Mongoose**

### Authentication & Security

- **JSON Web Token (JWT)**
- **bcrypt**
- **Role-based access control**

---

## 📂 Project Structure

### Frontend

```text
frontend/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── BlogCard.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── BlogDetailsPage.jsx
│   │   ├── CreateBlogPage.jsx
│   │   ├── EditBlogPage.jsx
│   │   ├── MyBlogsPage.jsx
│   │   ├── AdminPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── NotFoundPage.jsx
│   │
│   ├── utils/
│   │   └── formatDate.js
│   │
│   ├── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
└── vite.config.js
```

### Backend

```text
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── blogController.js
│   ├── commentController.js
│   └── adminController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Blog.js
│   └── Comment.js
│
├── routes/
│   ├── authRoutes.js
│   ├── blogRoutes.js
│   ├── commentRoutes.js
│   └── adminRoutes.js
│
├── utils/
│   └── generateToken.js
│
├── .env.example
└── server.js
```

---

## ⚙️ Prerequisites

Before running BlogHub locally, make sure you have:

- **Node.js 18+**
- **npm**
- **MongoDB** or a MongoDB Atlas database

Check your installed versions:

```bash
node --version
npm --version
```

---

# 🚀 Installation & Setup

Since the frontend and backend are maintained in separate repositories, clone both repositories.

## 1. Clone the Frontend

```bash
git clone https://github.com/andrio-fernandes/BlogHub.git
cd BlogHub
```

Install dependencies:

```bash
npm install
```

---

## 2. Clone the Backend

Open another terminal:

```bash
git clone https://github.com/andrio-fernandes/BlogHub-Backend.git
cd BlogHub-Backend
```

Install dependencies:

```bash
npm install
```

---

# 🔧 Backend Configuration

Inside the backend repository, create a `.env` file.

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/blog_platform
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
```

### Environment Variables

| Variable | Example | Description |
|---|---|---|
| `PORT` | `5000` | Backend server port |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/blog_platform` | MongoDB connection string |
| `JWT_SECRET` | `your_long_random_secret` | Secret used to sign JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | JWT token expiration time |

For MongoDB Atlas, use a connection string similar to:

```text
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/blog_platform
```

> **Important:** Never upload your `.env` file or JWT secret to GitHub.

---

# ▶️ Running the Application

## Start the Backend

From the backend directory:

```bash
npm run dev
```

Or:

```bash
npm start
```

The backend server will run on:

```text
http://localhost:5000
```

---

## Start the Frontend

From the frontend directory:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

The Vite configuration forwards `/api` requests to the backend during development.

---

# 🛡️ Admin Access

BlogHub supports two user roles:

```text
user
admin
```

New users are registered with the normal `user` role.

To make an account an administrator, update the user's role in the MongoDB `users` collection:

```js
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

After logging in with an admin account, additional administration options become available.

Admins can:

- View all registered users
- Delete any blog
- Delete any comment
- Moderate blog content

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |
| `GET` | `/api/auth/profile` | Authenticated | Get logged-in user profile |

## Blogs

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/blogs` | Public | Get all blogs |
| `GET` | `/api/blogs?search=title` | Public | Search blogs by title |
| `GET` | `/api/blogs/my` | Authenticated | Get user's blogs |
| `GET` | `/api/blogs/:id` | Public | Get a single blog |
| `POST` | `/api/blogs` | Authenticated | Create a blog |
| `PUT` | `/api/blogs/:id` | Author | Update a blog |
| `DELETE` | `/api/blogs/:id` | Author | Delete a blog |

## Comments

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/blogs/:id/comments` | Public | Get comments for a blog |
| `POST` | `/api/blogs/:id/comments` | Authenticated | Add a comment |
| `DELETE` | `/api/comments/:id` | Comment Author | Delete a comment |

## Admin

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/users` | Admin | List all users |
| `DELETE` | `/api/admin/blogs/:id` | Admin | Delete any blog |
| `DELETE` | `/api/admin/comments/:id` | Admin | Delete any comment |

---

# 🔒 Security

BlogHub uses several security mechanisms to protect user accounts and application resources:

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based authorization
- Author-based blog permissions
- Admin-only routes
- Environment variables for sensitive configuration
- Regex-safe title search
- Centralized error handling

---

# 📱 Responsive Design

The BlogHub interface is designed to work across different screen sizes:

- 💻 Desktop
- 📱 Mobile
- 📲 Tablet

The application uses responsive CSS along with a modern glassmorphism visual style.

---

# 📚 What I Learned

Through the development of BlogHub, I gained practical experience in:

- Full-stack web development
- React and Vite
- REST API development with Express.js
- MongoDB and Mongoose
- JWT authentication
- Password hashing with bcrypt
- React Context API
- Axios API integration
- Protected routes
- Role-based access control
- Responsive web design
- Frontend and backend integration
- Environment variable management
- Form validation and error handling

---

# 🔮 Future Improvements

Possible improvements for future versions include:

- Blog feed pagination
- Likes and sharing
- Rich-text editor
- Image and media uploads
- Dark/light mode
- Improved accessibility
- Additional animations

---

# 👨‍💻 Author

**Andrio Fernandes**

📧 Email: **andriofernandes06@gmail.com**

💻 GitHub: [andrio-fernandes](https://github.com/andrio-fernandes)

---

## 📄 License

This project was developed as part of a learning/internship project.
