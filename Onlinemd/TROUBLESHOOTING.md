# Troubleshooting Guide

## Donor Signup Issues

### "Request Failed" Error

If you're getting a "Request failed" error when trying to sign up as a donor, here are the most common causes and solutions:

#### 1. Backend Server Not Running

**Problem**: The backend ASP.NET Core server is not running.

**Solution**: 
- Start your backend server on `https://localhost:44344`
- Make sure the API is accessible at `https://localhost:44344/api`

**To check if the server is running**:
```bash
# Test the connection
curl https://localhost:44344/api/health
```

#### 2. CORS Issues

**Problem**: Cross-Origin Resource Sharing (CORS) is blocking requests.

**Solution**: 
- Ensure your backend has CORS configured to allow requests from `http://localhost:5173` (Vite dev server)
- Add the following to your ASP.NET Core startup:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// In Configure method:
app.UseCors("AllowFrontend");
```

#### 3. SSL Certificate Issues

**Problem**: HTTPS certificate issues in development.

**Solution**:
- Trust the development certificate: `dotnet dev-certs https --trust`
- Or use HTTP in development by changing the API URL to `http://localhost:44344/api`

#### 4. API Endpoint Issues

**Problem**: The registration endpoint might be incorrect.

**Solution**: 
- Verify the endpoint is `/api/auth/register`
- Check that the backend has this endpoint implemented

#### 5. Environment Variables

**Problem**: API base URL is not configured correctly.

**Solution**: 
- Check that `.env` file contains: `VITE_API_BASE_URL=https://localhost:44344/api`
- Restart the development server after changing environment variables

### Debugging Steps

1. **Check Browser Console**: Open Developer Tools (F12) and look for network errors
2. **Check Connection Status**: The signup page now shows a connection status indicator
3. **Test API Manually**: Try accessing `https://localhost:44344/api/health` in your browser
4. **Check Backend Logs**: Look at your ASP.NET Core application logs for errors

### Common Error Messages

- **"Network error"**: Backend server is not running
- **"Connection failed"**: Cannot reach the API endpoint
- **"User already exists"**: Email is already registered
- **"Validation error"**: Check your input data format

### Quick Fixes

1. **Restart Backend**: Stop and restart your ASP.NET Core application
2. **Restart Frontend**: Stop and restart the Vite development server
3. **Clear Browser Cache**: Hard refresh (Ctrl+F5) or clear browser cache
4. **Check Ports**: Ensure no other applications are using port 44344

### Development Setup

Make sure you have both servers running:

```bash
# Terminal 1 - Backend (ASP.NET Core)
cd backend
dotnet run

# Terminal 2 - Frontend (React/Vite)
cd frontend
npm run dev
```

### API Endpoints

The frontend expects these endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/health` - Health check (for connection testing)

If your backend uses different endpoints, update the `userService.js` file accordingly. 