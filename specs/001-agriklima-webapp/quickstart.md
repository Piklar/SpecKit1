# Quick Start Guide: AgriKlima Local Development Environment

**Last Updated**: 2026-04-29  
**MERN Stack**: React 19 + Vite | Express 5 | MongoDB  
**Node.js**: ^18.0.0 | npm: ^9.0.0

---

## System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Node.js**: v18+ (download from https://nodejs.org)
- **MongoDB**: Local instance or MongoDB Atlas cloud cluster
- **Text Editor**: VS Code recommended with extensions: ESLint, Prettier, REST Client (for API testing)
- **Git**: v2.30+ for version control

---

## Project Structure Overview

```
agriklima/
├── backend/                    # Express + Node.js API
│   ├── src/
│   │   ├── config/            # Database, environment config
│   │   ├── models/            # Mongoose schemas (User, Farm, Crop, etc.)
│   │   ├── routes/            # API endpoint definitions
│   │   ├── controllers/       # Route handlers & business logic
│   │   ├── middleware/        # JWT auth, CORS, error handling
│   │   ├── services/          # External API calls (Weather, Cloudinary)
│   │   ├── utils/             # Helpers, validators
│   │   └── server.js          # Express app entry point
│   ├── tests/
│   │   ├── unit/              # Unit tests (Jest)
│   │   ├── integration/       # Integration tests
│   │   └── contract/          # API contract tests
│   ├── .env.example           # Environment variable template
│   ├── .env                   # ACTUAL .env (git-ignored)
│   ├── package.json
│   └── README.md
│
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── components/        # Reusable React components (MUI-based)
│   │   ├── pages/             # Page-level components (Dashboard, Weather, etc.)
│   │   ├── services/          # Axios API client & hooks
│   │   ├── contexts/          # React Context (Auth, Farm, Location)
│   │   ├── utils/             # Helpers, constants
│   │   ├── styles/            # Global CSS, MUI theme
│   │   ├── App.jsx            # Root component
│   │   └── main.jsx           # React entry point
│   ├── tests/
│   │   ├── unit/              # Unit tests (Jest + React Testing Library)
│   │   ├── integration/       # Integration tests
│   │   └── e2e/               # End-to-end tests (Playwright, optional)
│   ├── .env.example
│   ├── .env
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
├── docker-compose.yml         # (Optional) MongoDB + backend services
├── .gitignore
└── README.md
```

---

## Step 1: Clone & Initial Setup

```bash
# Clone the AgriKlima repository
git clone https://github.com/AgriKlima/agriklima.git
cd agriklima

# Create feature branch (if working on a feature)
git checkout -b 001-agriklima-system
```

---

## Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env with your configuration:
# MONGO_URI=mongodb://localhost:27017/agriklima
# MONGO_ATLAS_URI=mongodb+srv://user:pass@cluster.mongodb.net/agriklima (if using Atlas)
# JWT_SECRET=your-random-secret-key-here-min-32-chars
# BCRYPT_ROUNDS=10
# CLOUDINARY_CLOUD_NAME=your-cloudinary-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret
# WEATHER_API_KEY=your-openweathermap-key
# CORS_ORIGIN=http://localhost:5173  # Frontend Vite dev server port
# NODE_ENV=development
# PORT=3000

# (Optional) Start MongoDB locally or use MongoDB Atlas
# Local MongoDB: MongoDB must be running (mongod service)
# Verify connection in MongoDB Compass: mongodb://localhost:27017

# Run database seeders (populate reference data)
npm run seed

# Start development server
npm run dev
# Server runs on http://localhost:3000
# API: http://localhost:3000/api

# In a new terminal, run tests (watch mode)
npm run test:watch
```

### Backend Environment Variables (.env)

```
# Database
MONGO_URI=mongodb://localhost:27017/agriklima
# OR for MongoDB Atlas:
# MONGO_ATLAS_URI=mongodb+srv://username:password@cluster0.mongodb.net/agriklima

# Authentication
JWT_SECRET=your-secure-random-secret-key-minimum-32-characters
JWT_EXPIRY=24h
BCRYPT_ROUNDS=10

# External Services
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
WEATHER_API_KEY=your-openweathermap-api-key  # https://openweathermap.org/api

# CORS & Frontend
CORS_ORIGIN=http://localhost:5173

# Environment
NODE_ENV=development
PORT=3000
```

---

## Step 3: Frontend Setup

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration:
# VITE_API_URL=http://localhost:3000/api
# VITE_APP_NAME=AgriKlima
# VITE_ENVIRONMENT=development

# Start Vite development server
npm run dev
# Frontend runs on http://localhost:5173

# In a new terminal, run tests (watch mode)
npm run test:watch
```

### Frontend Environment Variables (.env)

```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=AgriKlima
VITE_ENVIRONMENT=development
VITE_LOG_LEVEL=debug
```

---

## Step 4: Access the Application

1. **Frontend**: Open http://localhost:5173 in your browser
2. **Backend API**: http://localhost:3000/api
3. **MongoDB (local)**: mongo shell or MongoDB Compass on localhost:27017
4. **API Testing**: Use REST Client extension or Postman

### Sample API Call (REST Client)

```http
### Test Authentication
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "SecurePass123!",
  "name": "Juan Dela Cruz",
  "defaultMunicipality": "Apalit"
}

### Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "SecurePass123!"
}

### Get Weather (authenticated)
GET http://localhost:3000/api/weather/Apalit
Authorization: Bearer <JWT_TOKEN_FROM_LOGIN>
```

---

## Step 5: Verify Installation

### Backend Health Check

```bash
cd backend
npm run test:contract  # Run contract tests
curl http://localhost:3000/health  # Should return 200 OK
```

### Frontend Health Check

```bash
cd frontend
npm run build  # Verify production build
npm run test:unit  # Run unit tests
```

---

## Development Workflow

### 1. Creating a New Feature (Modular Development)

```bash
# Create feature branch
git checkout -b feature/user-story-name

# Backend: Create new endpoint in controllers/
# 1. Write failing test in tests/contract/
# 2. Define route in routes/
# 3. Write controller logic
# 4. Test with REST Client / Postman

# Frontend: Create new page/component
# 1. Write failing test in tests/unit/
# 2. Create component in components/ or pages/
# 3. Add route in App.jsx
# 4. Test in browser

# Commit & push
git add .
git commit -m "feat: add new user story"
git push origin feature/user-story-name
```

### 2. Testing During Development

```bash
# Backend
npm run test:unit         # Unit tests only
npm run test:integration # Integration tests only
npm run test:contract    # API contract validation
npm run test             # All tests with coverage

# Frontend
npm run test:unit        # Component tests
npm run test:e2e         # End-to-end tests (Playwright)
npm run test             # All tests with coverage
```

### 3. Code Quality Checks

```bash
# Backend
npm run lint             # ESLint
npm run format           # Prettier

# Frontend
npm run lint             # ESLint
npm run format           # Prettier
npm run type-check       # TypeScript (if using TS)
```

### 4. Database Migrations (if schema changes)

```bash
cd backend

# Create migration script in migrations/
npm run migrate:create -- create_crop_table

# Run migrations
npm run migrate:up

# Rollback migrations
npm run migrate:down
```

---

## Troubleshooting

### Backend Issues

**Problem**: `MONGO_CONNECT_ERROR: connect ECONNREFUSED`  
**Solution**: Ensure MongoDB is running
```bash
# macOS
brew services start mongodb-community

# Windows
# Start MongoDB service from Services panel or:
net start MongoDB

# Linux
sudo systemctl start mongod
```

**Problem**: `JWT_SECRET is not defined`  
**Solution**: Check .env file exists and contains JWT_SECRET

**Problem**: CORS errors in frontend  
**Solution**: Verify CORS_ORIGIN in backend .env matches frontend URL (http://localhost:5173)

### Frontend Issues

**Problem**: `Cannot find module 'axios'`  
**Solution**: Run `npm install` in frontend directory

**Problem**: API requests return 401 Unauthorized  
**Solution**: Ensure JWT token is in localStorage; check login endpoint first

**Problem**: Responsive design not working on mobile  
**Solution**: Use browser DevTools (F12) to toggle device mode; verify MUI breakpoints in components

---

## Running Tests with Coverage

```bash
# Backend: Achieve 80%+ coverage
cd backend
npm run test -- --coverage

# Expected output:
# ├── Statements   : 82% ( 450/550 )
# ├── Branches     : 78% ( 300/384 )
# ├── Functions    : 85% ( 200/235 )
# └── Lines        : 80% ( 440/550 )

# Frontend: Achieve 80%+ coverage
cd frontend
npm run test -- --coverage

# Flag coverage drop before merge:
npm run test -- --coverage --failure-on-coverage-drop
```

---

## Deployment Checklist (for CI/CD)

- [ ] Backend tests pass (npm run test)
- [ ] Frontend tests pass (npm run test)
- [ ] Coverage ≥80% (npm run test -- --coverage)
- [ ] Linting passes (npm run lint)
- [ ] Code formatting correct (npm run format)
- [ ] No console errors in browser (F12)
- [ ] API contract tests pass (npm run test:contract)
- [ ] Environment variables set in production
- [ ] Database migrations run (npm run migrate:up)
- [ ] Cloudinary credentials configured
- [ ] Weather API key configured

---

## Useful Commands Reference

```bash
# Backend
npm run dev               # Start server with nodemon (hot-reload)
npm run build            # Build for production
npm run test             # Run all tests
npm run test:watch      # Run tests in watch mode
npm run lint            # Check code quality
npm run format          # Auto-format code
npm run seed            # Populate reference data

# Frontend
npm run dev             # Start Vite dev server
npm run build           # Build for production
npm run preview         # Preview production build locally
npm run test            # Run all tests
npm run test:watch     # Run tests in watch mode
npm run lint           # Check code quality
npm run format         # Auto-format code
npm run type-check     # TypeScript validation (if applicable)
```

---

## Next Steps

1. **Understand the Architecture**: Read [research.md](research.md) for MERN stack patterns
2. **Explore Data Model**: Review [data-model.md](data-model.md) for entity relationships
3. **API Contracts**: Check [contracts/](contracts/) for endpoint specifications
4. **Start Developing**: Pick a user story and follow the Testing workflow above
5. **Monitor Coverage**: Ensure 80%+ test coverage per Constitution II

---

## Additional Resources

- **MongoDB Documentation**: https://docs.mongodb.com/
- **Express Guide**: https://expressjs.com/
- **React 19 Docs**: https://react.dev
- **Vite Guide**: https://vitejs.dev
- **MUI Component Library**: https://mui.com/
- **JWT Best Practices**: https://tools.ietf.org/html/rfc7519
- **AgriKlima Project Plan**: [plan.md](plan.md)

---

## Support & Questions

For issues or questions during setup:
1. Check the [Troubleshooting](#troubleshooting) section above
2. Review [research.md](research.md) for architectural guidance
3. Examine existing tests in tests/ for examples
4. Consult contract files in contracts/ for API expectations
5. Post questions in project's issue tracker
