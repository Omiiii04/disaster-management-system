# Backend Integration Guide

This guide will help you integrate the Next.js frontend with your Django/FastAPI backend.

## 🔄 Current Architecture

```
Frontend (Next.js)          Backend (To Be Connected)
├── /api/* (Mock APIs)  →   Django/FastAPI APIs
├── MySQL (Ready)       →   MySQL Database
└── JWT (Simulated)     →   Real JWT Authentication
```

## 📋 Prerequisites

- Django 4.x or FastAPI installed
- MySQL server running
- Python 3.8+

---

## 🐍 Django Setup

### 1. Install Required Packages

```bash
pip install django djangorestframework django-cors-headers mysqlclient PyJWT
```

### 2. Django Settings Configuration

```python
# settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'your_app',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this
    'django.middleware.security.SecurityMiddleware',
    # ... other middleware
]

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'disaster_management',
        'USER': 'your_mysql_user',
        'PASSWORD': 'your_mysql_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
```

### 3. Create Models

```python
# models.py

from django.db import models
from django.contrib.auth.models import User

class Alert(models.Model):
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    type = models.CharField(max_length=100)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    location = models.CharField(max_length=255)
    description = models.TextField()
    affected_people = models.CharField(max_length=50)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']

class Shelter(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('limited', 'Limited'),
        ('closed', 'Closed'),
    ]
    
    name = models.CharField(max_length=255)
    address = models.TextField()
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True)
    capacity = models.IntegerField()
    available = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    contact = models.CharField(max_length=50)
    amenities = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

class EvacuationRoute(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('congested', 'Congested'),
        ('closed', 'Closed'),
    ]
    
    TRAFFIC_CHOICES = [
        ('light', 'Light'),
        ('moderate', 'Moderate'),
        ('heavy', 'Heavy'),
        ('blocked', 'Blocked'),
    ]
    
    name = models.CharField(max_length=255)
    from_location = models.CharField(max_length=255)
    to_location = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    traffic = models.CharField(max_length=20, choices=TRAFFIC_CHOICES, default='light')
    distance = models.CharField(max_length=50)
    estimated_time = models.CharField(max_length=50)
    coordinates = models.JSONField(default=list)
    landmarks = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
```

### 4. Create Serializers

```python
# serializers.py

from rest_framework import serializers
from .models import Alert, Shelter, EvacuationRoute
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class AlertSerializer(serializers.ModelSerializer):
    time_ago = serializers.SerializerMethodField()
    
    class Meta:
        model = Alert
        fields = '__all__'
    
    def get_time_ago(self, obj):
        from django.utils import timezone
        diff = timezone.now() - obj.created_at
        minutes = int(diff.total_seconds() / 60)
        if minutes < 60:
            return f"{minutes} mins ago"
        hours = int(minutes / 60)
        return f"{hours} hour{'s' if hours > 1 else ''} ago"

class ShelterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shelter
        fields = '__all__'

class EvacuationRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvacuationRoute
        fields = '__all__'
```

### 5. Create Views

```python
# views.py

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Alert, Shelter, EvacuationRoute
from .serializers import AlertSerializer, ShelterSerializer, EvacuationRouteSerializer, UserSerializer

# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        user = User.objects.get(email=email)
        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'success': True,
                'message': 'Login successful',
                'data': {
                    'token': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': UserSerializer(user).data
                }
            })
    except User.DoesNotExist:
        pass
    
    return Response({
        'success': False,
        'error': 'Invalid credentials'
    }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    name = request.data.get('name')
    email = request.data.get('email')
    password = request.data.get('password')
    
    if User.objects.filter(email=email).exists():
        return Response({
            'success': False,
            'error': 'Email already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=name.split()[0] if name else '',
    )
    
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'success': True,
        'message': 'Registration successful',
        'data': {
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        }
    })

# Alert Views
@api_view(['GET', 'POST'])
def alerts(request):
    if request.method == 'GET':
        severity = request.GET.get('severity')
        location = request.GET.get('location')
        
        queryset = Alert.objects.filter(active=True)
        
        if severity:
            queryset = queryset.filter(severity=severity)
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        serializer = AlertSerializer(queryset, many=True)
        
        return Response({
            'success': True,
            'data': {
                'alerts': serializer.data,
                'total': queryset.count(),
                'lastUpdated': queryset.first().created_at if queryset.exists() else None
            }
        })
    
    elif request.method == 'POST':
        serializer = AlertSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Alert created successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Shelter Views
@api_view(['GET'])
def shelters(request):
    location = request.GET.get('location')
    
    queryset = Shelter.objects.all()
    
    if location:
        queryset = queryset.filter(address__icontains=location) | queryset.filter(name__icontains=location)
    
    serializer = ShelterSerializer(queryset, many=True)
    
    return Response({
        'success': True,
        'data': {
            'shelters': serializer.data,
            'total': queryset.count(),
        }
    })

# Evacuation Routes Views
@api_view(['GET'])
def evacuation_routes(request):
    route_status = request.GET.get('status')
    
    queryset = EvacuationRoute.objects.all()
    
    if route_status:
        queryset = queryset.filter(status=route_status)
    
    serializer = EvacuationRouteSerializer(queryset, many=True)
    
    return Response({
        'success': True,
        'data': {
            'routes': serializer.data,
            'total': queryset.count(),
        }
    })

# Weather Views (integrate with external API)
@api_view(['GET'])
def weather_current(request):
    location = request.GET.get('location', 'Default Location')
    
    # TODO: Integrate with real weather API (OpenWeatherMap, WeatherAPI, etc.)
    # For now, returning mock data
    
    return Response({
        'success': True,
        'data': {
            'location': location,
            'current': {
                'temperature': 28,
                'humidity': 72,
                'windSpeed': 45,
                'pressure': 1013,
                'conditions': 'Stormy',
            }
        }
    })

@api_view(['GET'])
def weather_forecast(request):
    location = request.GET.get('location', 'Default Location')
    days = int(request.GET.get('days', 5))
    
    # TODO: Integrate with real weather API
    
    return Response({
        'success': True,
        'data': {
            'location': location,
            'forecast': []
        }
    })
```

### 6. Configure URLs

```python
# urls.py

from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('api/auth/login', views.login, name='login'),
    path('api/auth/register', views.register, name='register'),
    
    # Alerts
    path('api/alerts', views.alerts, name='alerts'),
    
    # Resources
    path('api/resources/shelters', views.shelters, name='shelters'),
    path('api/resources/evacuation-routes', views.evacuation_routes, name='evacuation_routes'),
    
    # Weather
    path('api/weather/current', views.weather_current, name='weather_current'),
    path('api/weather/forecast', views.weather_forecast, name='weather_forecast'),
]
```

### 7. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
```

---

## ⚡ FastAPI Alternative

### 1. Install Packages

```bash
pip install fastapi uvicorn sqlalchemy pymysql python-jose[cryptography] passlib[bcrypt] python-multipart
```

### 2. Main Application

```python
# main.py

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas, database

app = FastAPI(title="Disaster Management API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database
models.Base.metadata.create_all(bind=database.engine)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentication
@app.post("/api/auth/login")
async def login(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):
    # Implement authentication logic
    pass

@app.post("/api/auth/register")
async def register(user: schemas.RegisterRequest, db: Session = Depends(get_db)):
    # Implement registration logic
    pass

# Alerts
@app.get("/api/alerts")
async def get_alerts(
    severity: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Alert)
    if severity:
        query = query.filter(models.Alert.severity == severity)
    if location:
        query = query.filter(models.Alert.location.contains(location))
    
    alerts = query.all()
    
    return {
        "success": True,
        "data": {
            "alerts": alerts,
            "total": len(alerts)
        }
    }

@app.post("/api/alerts")
async def create_alert(alert: schemas.AlertCreate, db: Session = Depends(get_db)):
    db_alert = models.Alert(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    
    return {
        "success": True,
        "message": "Alert created successfully",
        "data": db_alert
    }

# Run with: uvicorn main:app --reload --port 8000
```

---

## 🔗 Frontend Connection

### Update Next.js Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Update API Calls in Components

Replace fetch calls in your components:

```typescript
// Before (using internal Next.js API)
const response = await fetch('/api/alerts')

// After (using Django/FastAPI backend)
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alerts`)
```

### Example: Update Login Page

```typescript
// src/app/login/page.tsx

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    
    const data = await response.json()
    
    if (data.success) {
      // Store token
      localStorage.setItem('token', data.data.token)
      // Redirect to dashboard
      router.push('/')
    } else {
      alert(data.error)
    }
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    setIsLoading(false)
  }
}
```

---

## 🔐 Security Checklist

- [ ] Enable HTTPS in production
- [ ] Implement rate limiting
- [ ] Validate all inputs on backend
- [ ] Use environment variables for secrets
- [ ] Implement proper JWT expiration
- [ ] Add CSRF protection
- [ ] Sanitize database queries
- [ ] Use secure password hashing (bcrypt)
- [ ] Implement refresh token rotation
- [ ] Add request logging

---

## 📊 Weather API Integration

### Using OpenWeatherMap

```python
# Django example
import requests

def get_weather(location):
    API_KEY = 'your_openweathermap_api_key'
    url = f'https://api.openweathermap.org/data/2.5/weather?q={location}&appid={API_KEY}'
    response = requests.get(url)
    return response.json()
```

### Using WeatherAPI.com

```python
def get_weather(location):
    API_KEY = 'your_weatherapi_key'
    url = f'http://api.weatherapi.com/v1/current.json?key={API_KEY}&q={location}'
    response = requests.get(url)
    return response.json()
```

---

## 🧪 Testing

### Test Authentication

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Alerts

```bash
curl http://localhost:8000/api/alerts?severity=high
```

---

## 📝 Next Steps

1. ✅ Set up Django or FastAPI backend
2. ✅ Create MySQL database and tables
3. ✅ Implement authentication endpoints
4. ✅ Connect weather API
5. ✅ Update frontend to use backend URLs
6. ✅ Test all endpoints
7. ✅ Deploy to production

---

For questions or issues, refer to:
- Django REST Framework: https://www.django-rest-framework.org/
- FastAPI: https://fastapi.tiangolo.com/
- Next.js: https://nextjs.org/docs