react-frontend/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   │   ├── custom-font-regular.woff2
│   │   │   ├── custom-font-bold.woff2
│   │   │   └── index.js
│   │   ├── images/
│   │   │   ├── logos/
│   │   │   ├── avatars/
│   │   │   ├── backgrounds/
│   │   │   └── icons/
│   │   └── videos/
│   │       ├── intro.mp4
│   │       └── tutorial-1.mp4
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Modal.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── NavbarTeacher.jsx
│   │   │   │   ├── NavbarStudent.jsx
│   │   │   │   ├── NavbarAdmin.jsx
│   │   │   │   └── index.js
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── ui/
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   └── Table.jsx
│   │   │
│   │   └── features/
│   │       ├── Dashboard/
│   │       ├── Courses/
│   │       ├── Profile/
│   │       └── AdminPanel/
│   │
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── RoleContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useRole.js
│   │   └── useFetch.js
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── TeacherDashboard.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── NotFound.jsx
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── PrivateRoute.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── courseService.js
│   │   └── userService.js
│   │
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── constants.js
│   │   └── validators.js
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── theme.js
│   │   └── breakpoints.js
│   │
│   ├── App.jsx
│   ├── index.js
│   └── index.css
│
├── package.json
├── README.md
└── .gitignore