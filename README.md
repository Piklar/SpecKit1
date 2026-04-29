# AgriKlima

AgriKlima is a localized web application designed to empower farmers in Pampanga with tailored agricultural insights. The platform provides localized weather forecasts, seasonal crop recommendations, pest identification strategies, a personalized farm dashboard, and an agricultural calendar.

## Technologies Used
- **Frontend**: React (Vite), Material-UI (MUI), React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), bcryptjs
- **Testing**: Jest, Supertest (Backend), Vitest, React Testing Library (Frontend)

## Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB URI
- Cloudinary Account (optional, for image uploads)

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   \`\`\`bash
   cd backend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a `.env` file in the `backend` directory and add the following:
   \`\`\`env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/agriklima
   JWT_SECRET=your_super_secret_jwt_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   \`\`\`
4. Seed the database (optional, seeds the crops collection):
   \`\`\`bash
   node src/seeds/crops.seed.js
   \`\`\`
5. Start the server:
   \`\`\`bash
   node src/server.js
   \`\`\`

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   \`\`\`bash
   cd frontend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Documentation
The backend exposes the following RESTful endpoints:
- \`/api/auth/register\` (POST) - Register a new farmer account
- \`/api/auth/login\` (POST) - Authenticate and receive a JWT
- \`/api/weather\` (GET) - Fetch cached localized weather data for Pampanga
- \`/api/crops\` (GET) - Fetch seasonal crop recommendations (supports \`?season=wet\` filter)
- \`/api/pests\` (GET) - Fetch pest identification and mitigation strategies
- \`/api/farm\` (GET, POST) - Manage user-specific farm profiles (Requires Auth)
- \`/api/calendar\` (GET) - Fetch the seasonal agricultural calendar
- \`/api/news\` (GET) - Fetch local agricultural news and advisories
