# Disaster Management System

A comprehensive disaster management web application built with Next.js 15, React, Framer Motion, and simulated Django/FastAPI backend endpoints.

## 🚀 Technologies Used

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **UI Components**: Shadcn/UI
- **Icons**: Lucide React

### Backend (Simulated)
- **API Routes**: Next.js API Routes (simulating Django/FastAPI)
- **Database**: MySQL (ready for integration)
- **Authentication**: JWT-based (simulated, ready for Django/FastAPI integration)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # Internal API routes (simulating Django/FastAPI)
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   ├── weather/
│   │   │   ├── current/route.ts
│   │   │   └── forecast/route.ts
│   │   ├── alerts/route.ts
│   │   └── resources/
│   │       ├── shelters/route.ts
│   │       └── evacuation-routes/route.ts
│   ├── alerts/                 # Alert system page
│   ├── resources/              # Emergency resources page
│   ├── login/                  # Authentication page
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Homepage
├── components/
│   ├── Navigation.tsx         # Main navigation bar
│   ├── Footer.tsx             # Footer with emergency contacts
│   └── ui/                    # Shadcn/UI components
└── lib/                       # Utility functions

```

## 🌟 Features

### 1. **Homepage** (`/`)
- Hero section with animated call-to-action
- Real-time statistics dashboard
- Active emergency alerts overview
- Weather monitoring widgets
- Framer Motion animations throughout

### 2. **Emergency Resources** (`/resources`)
- **Shelters Tab**: Browse available emergency shelters with real-time capacity
- **Evacuation Routes Tab**: View routes with traffic status and distance
- **Emergency Contacts Tab**: Quick access to emergency phone numbers
- Interactive tabs with smooth animations

### 3. **Alert System** (`/alerts`)
- Real-time disaster alerts with severity levels
- Live weather monitoring
- 5-day weather forecast
- Push notifications sidebar
- Auto-updating timestamp

### 4. **Authentication** (`/login`)
- Login and registration forms
- Form validation
- Smooth tab transitions
- Ready for Django/FastAPI backend integration

### 5. **Responsive Navigation**
- Fixed header with smooth animations
- Mobile-friendly hamburger menu
- Emergency button for quick access
- Dark mode support

### 6. **Footer**
- Emergency contact information
- Quick navigation links
- Social proof and coverage info

## 🔌 API Endpoints

All API routes are currently simulated and return mock data. They follow RESTful conventions and are ready to be replaced with your Django/FastAPI backend.

### Authentication

#### POST `/api/auth/login`
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "mock-jwt-token-...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name",
      "role": "user"
    }
  }
}
```

#### POST `/api/auth/register`
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "mock-jwt-token-...",
    "user": {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Weather Data

#### GET `/api/weather/current?location=City`
```json
Response:
{
  "success": true,
  "data": {
    "location": "City",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "current": {
      "temperature": 28,
      "humidity": 72,
      "windSpeed": 45,
      "pressure": 1013,
      "conditions": "Stormy",
      "visibility": 8,
      "uvIndex": 5
    },
    "alerts": [...]
  }
}
```

#### GET `/api/weather/forecast?location=City&days=5`
```json
Response:
{
  "success": true,
  "data": {
    "location": "City",
    "forecast": [
      {
        "date": "2024-01-01",
        "day": "Today",
        "temperature": { "min": 20, "max": 30, "avg": 25 },
        "conditions": "Sunny",
        "humidity": 65,
        "windSpeed": 15,
        "precipitation": 10
      }
    ],
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

### Alerts

#### GET `/api/alerts?severity=high&location=area`
```json
Response:
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": 1,
        "type": "Hurricane Warning",
        "severity": "critical",
        "location": "Coastal Region A",
        "description": "Category 4 hurricane approaching...",
        "affected": "50,000+ people",
        "timestamp": "2024-01-01T00:00:00.000Z",
        "timeAgo": "15 mins ago",
        "active": true
      }
    ],
    "total": 5,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/alerts`
```json
Request:
{
  "type": "Flood Warning",
  "severity": "high",
  "location": "River Valley",
  "description": "Heavy rainfall expected..."
}

Response:
{
  "success": true,
  "message": "Alert created successfully",
  "data": {
    "id": 456,
    "type": "Flood Warning",
    "severity": "high",
    "location": "River Valley",
    "description": "Heavy rainfall expected...",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "active": true
  }
}
```

### Resources

#### GET `/api/resources/shelters?location=area`
```json
Response:
{
  "success": true,
  "data": {
    "shelters": [
      {
        "id": 1,
        "name": "Central Community Shelter",
        "address": "123 Main Street, Downtown",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "capacity": 500,
        "available": 320,
        "amenities": ["Food", "Medical", "WiFi", "Security"],
        "contact": "1-800-SHELTER-1",
        "status": "open",
        "distance": "2.3 km"
      }
    ],
    "total": 5,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET `/api/resources/evacuation-routes?status=open`
```json
Response:
{
  "success": true,
  "data": {
    "routes": [
      {
        "id": 1,
        "name": "Route A - Coastal Exit",
        "from": "Coastal Areas",
        "to": "Highland Safety Zone",
        "status": "open",
        "traffic": "light",
        "distance": "15 km",
        "estimatedTime": "18 mins",
        "coordinates": [...],
        "landmarks": ["City Hall", "Central Park"],
        "lastUpdated": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 4,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🔗 Integrating with Django/FastAPI Backend

### Step 1: Update API Base URL

Create an environment variable for your backend URL:

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 2: Create API Client

Create `src/lib/api.ts`:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function apiCall(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  return response.json()
}
```

### Step 3: Replace Internal API Calls

Update your components to use the external API:

```typescript
// Instead of:
const response = await fetch('/api/weather/current')

// Use:
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/weather/current`)
```

### Step 4: Django Backend Setup

Your Django backend should implement these endpoints:

```python
# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('api/auth/login', views.login),
    path('api/auth/register', views.register),
    path('api/weather/current', views.weather_current),
    path('api/weather/forecast', views.weather_forecast),
    path('api/alerts', views.alerts),
    path('api/resources/shelters', views.shelters),
    path('api/resources/evacuation-routes', views.evacuation_routes),
]
```

### Step 5: FastAPI Alternative

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/auth/login")
async def login(credentials: LoginCredentials):
    # Your login logic
    pass

@app.get("/api/weather/current")
async def weather_current(location: str = None):
    # Your weather logic
    pass
```

## 🗄️ MySQL Database Setup

### Recommended Schema

```sql
-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts table
CREATE TABLE alerts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(100) NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    affected_people VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shelters table
CREATE TABLE shelters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    capacity INT NOT NULL,
    available INT NOT NULL,
    status ENUM('open', 'limited', 'closed') DEFAULT 'open',
    contact VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Evacuation Routes table
CREATE TABLE evacuation_routes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    from_location VARCHAR(255) NOT NULL,
    to_location VARCHAR(255) NOT NULL,
    status ENUM('open', 'congested', 'closed') DEFAULT 'open',
    traffic ENUM('light', 'moderate', 'heavy', 'blocked') DEFAULT 'light',
    distance VARCHAR(50),
    estimated_time VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Customization

### Colors

Update `src/app/globals.css` to customize the color scheme:

```css
:root {
  --primary: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  /* Add your custom colors */
}
```

### Animations

Framer Motion animations can be customized in each component:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Content */}
</motion.div>
```

## 🚀 Getting Started

1. **Install dependencies**:
```bash
npm install
# or
bun install
```

2. **Run development server**:
```bash
npm run dev
# or
bun dev
```

3. **Open browser**:
```
http://localhost:3000
```

## 📱 Pages

- `/` - Homepage with alerts dashboard
- `/resources` - Emergency resources (shelters, routes, contacts)
- `/alerts` - Alert system with weather monitoring
- `/login` - Authentication (login/register)

## 🔒 Security Notes

- All API endpoints are currently mocked for demonstration
- Implement proper JWT authentication in your backend
- Use HTTPS in production
- Validate all user inputs on the backend
- Implement rate limiting for API endpoints
- Store passwords using bcrypt or similar hashing

## 📄 License

This project is created for educational purposes.

## 🤝 Contributing

This is a demonstration project. For production use, ensure you:
1. Connect to a real Django/FastAPI backend
2. Implement proper authentication
3. Connect to MySQL database
4. Add proper error handling
5. Implement real-time weather API integration
6. Add comprehensive testing

---

Built with ❤️ using Next.js, React, and Framer Motion