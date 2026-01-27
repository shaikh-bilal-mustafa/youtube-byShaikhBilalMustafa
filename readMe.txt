fullstack-app/
│
├── client/                      # Frontend (React + TypeScript)
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── assets/              # Images, icons, fonts
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Loader.tsx
│   │   │
│   │   ├── pages/               # Route-level pages
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Dashboard.tsx
│   │   │
│   │   ├── routes/              # React Router config
│   │   │   └── AppRoutes.tsx
│   │   │
│   │   ├── services/            # API calls (Axios / Fetch)
│   │   │   ├── api.ts
│   │   │   └── auth.service.ts
│   │   │
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── useAuth.ts
│   │   │
│   │   ├── context/             # Context API / State management
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── types/               # TypeScript types & interfaces
│   │   │   └── user.types.ts
│   │   │
│   │   ├── utils/               # Helper functions
│   │   │   └── formatDate.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   │
│   ├── .env
│   ├── tsconfig.json
│   ├── package.json
│   └── vite.config.ts
│
├── server/                      # Backend (Node + Express + TypeScript)
│   ├── src/
│   │   ├── config/              # DB, env, app config
│   │   │   └── db.ts
│   │   │
│   │   ├── models/              # Mongoose models
│   │   │   └── user.model.ts
│   │   │
│   │   ├── controllers/         # Business logic
│   │   │   └── auth.controller.ts
│   │   │
│   │   ├── routes/              # API routes
│   │   │   └── auth.routes.ts
│   │   │
│   │   ├── middlewares/         # Auth, error handling
│   │   │   ├── auth.middleware.ts
│   │   │   └── error.middleware.ts
│   │   │
│   │   ├── services/            # Reusable business services
│   │   │   └── user.service.ts
│   │   │
│   │   ├── utils/               # Helpers (JWT, hashing)
│   │   │   ├── jwt.ts
│   │   │   └── hash.ts
│   │   │
│   │   ├── app.ts               # Express app setup
│   │   └── index.ts             # Server entry point
│   │
│   ├── .env
│   ├── tsconfig.json
│   ├── package.json
│   └── nodemon.json
│
├── shared/                      # Shared types (Frontend + Backend)
│   └── user.types.ts
│
├── .gitignore
├── README.md
└── package.json                 # Root scripts (optional monorepo)
 abcdefghijklmnopqrstuvwxf!@23455678900-=-=[{]}:;""'''||\\<>>?||