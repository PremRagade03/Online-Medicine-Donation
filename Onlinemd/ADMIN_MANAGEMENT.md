# Admin Management System

## Overview
The Admin Management System provides comprehensive functionality for managing administrator accounts in the MediShare platform. It includes admin signup, login, password reset, and profile management with full MySQL database integration.

## Features

### 🔐 **Admin Authentication**
- **Admin Signup**: Create new admin accounts
- **Admin Login**: Secure authentication system
- **Forgot Password**: Multi-step password reset with OTP
- **Password Validation**: Strong password requirements

### 👤 **Admin Account Management**
- **Profile Management**: View and update admin profiles
- **Password Change**: Change password for logged-in admins
- **Account Security**: Secure password hashing and validation

### 🛡️ **Security Features**
- **Password Hashing**: Secure password storage
- **OTP Verification**: Email-based OTP for password reset
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Secure error messages

## Pages

### 1. **Admin Signup Page** (`/admin-signup`)
- **Purpose**: Create new admin accounts
- **Access**: Public (no authentication required)
- **Features**:
  - Full name input
  - Email address validation
  - Strong password requirements
  - Password confirmation
  - Form validation with real-time feedback
  - Success/error notifications

### 2. **Forgot Password Page** (`/forgot-password`)
- **Purpose**: Reset admin passwords
- **Access**: Public (no authentication required)
- **Multi-step Process**:
  1. **Email Step**: Enter email address
  2. **OTP Step**: Enter 6-digit verification code
  3. **New Password Step**: Set new password
- **Features**:
  - Email validation
  - OTP verification
  - New password creation
  - Step-by-step navigation
  - Back navigation between steps

### 3. **Login Page** (Enhanced)
- **Purpose**: Admin authentication
- **New Features**:
  - "Create Admin Account" link
  - "Forgot Password?" link
  - Enhanced navigation to admin features

## MySQL Database Schema

### Admins Table
```sql
CREATE TABLE admins (
  AdminId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Email LONGTEXT NOT NULL,
  PasswordHash LONGTEXT NOT NULL,
  Role VARCHAR(20) NOT NULL DEFAULT 'admin',
  CreatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  UNIQUE KEY unique_email (Email(255))
);
```

### Password Resets Table (for OTP)
```sql
CREATE TABLE password_resets (
  Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Email VARCHAR(255) NOT NULL,
  OTP VARCHAR(6) NOT NULL,
  ExpiresAt DATETIME NOT NULL,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Field Descriptions:
- **AdminId**: Auto-incrementing primary key
- **Name**: Admin's full name (max 100 characters)
- **Email**: Admin's email address (unique)
- **PasswordHash**: Hashed password using bcrypt/argon2
- **Role**: Admin role (default: 'admin')
- **CreatedAt**: Account creation timestamp

## API Integration

### Service Layer (`src/services/adminService.js`)
The system includes a complete service layer for MySQL integration:

```javascript
// Example usage
import { adminService } from '@/services/adminService';

// Admin signup
const newAdmin = await adminService.adminSignup({
  Name: "John Doe",
  Email: "john@example.com",
  Password: "SecurePass123"
});

// Forgot password
await adminService.forgotPassword("john@example.com");

// Verify OTP
await adminService.verifyOTP("john@example.com", "123456");

// Reset password
await adminService.resetPassword("john@example.com", "123456", "NewPass123");
```

### Available API Methods:
- `adminSignup(data)` - Create new admin account
- `adminLogin(credentials)` - Admin authentication
- `forgotPassword(email)` - Send password reset OTP
- `verifyOTP(email, otp)` - Verify OTP code
- `resetPassword(email, otp, newPassword)` - Reset password
- `getAllAdmins()` - Fetch all admins (admin only)
- `getAdminById(id)` - Get specific admin
- `updateAdmin(id, data)` - Update admin details
- `deleteAdmin(id)` - Delete admin account
- `changePassword(current, new)` - Change password
- `getAdminProfile()` - Get current admin profile
- `updateAdminProfile(data)` - Update profile

## Password Reset Flow

### 1. **Request Reset**
- Admin enters email address
- System validates email exists
- Generates 6-digit OTP
- Stores OTP with 15-minute expiration
- Sends OTP via email

### 2. **Verify OTP**
- Admin enters 6-digit code
- System validates OTP and expiration
- If valid, proceeds to password reset
- If invalid, shows error message

### 3. **Set New Password**
- Admin enters new password
- System validates password strength
- Updates password hash in database
- Deletes used OTP
- Redirects to login

## Form Validation

### Admin Signup Validation:
- **Name**: Required, minimum 2 characters
- **Email**: Required, valid email format, unique
- **Password**: Required, minimum 8 characters, uppercase + lowercase + number
- **Confirm Password**: Must match password

### Password Reset Validation:
- **Email**: Required, valid email format
- **OTP**: Required, exactly 6 digits, numeric only
- **New Password**: Same requirements as signup
- **Confirm Password**: Must match new password

## Security Considerations

### Password Security:
- **Hashing**: Passwords hashed using bcrypt/argon2
- **Strength Requirements**: Minimum 8 characters with complexity
- **No Plain Text**: Passwords never stored in plain text
- **Secure Transmission**: HTTPS for all password operations

### OTP Security:
- **Time-limited**: 15-minute expiration
- **Single-use**: OTP deleted after use
- **Numeric-only**: 6-digit numeric codes
- **Email verification**: Sent to registered email only

### Input Validation:
- **Server-side**: All inputs validated on backend
- **Client-side**: Real-time validation feedback
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization

## User Experience

### Design Features:
- **Responsive Design**: Works on all device sizes
- **Step-by-step Flow**: Clear navigation in password reset
- **Real-time Validation**: Immediate feedback on form errors
- **Loading States**: Visual feedback during operations
- **Success/Error Messages**: Clear user feedback

### Navigation:
- **Back Links**: Easy navigation between pages
- **Breadcrumbs**: Clear indication of current step
- **Consistent Styling**: Matches platform design system
- **Accessibility**: Keyboard navigation and screen reader support

## Integration Points

### With Existing System:
- **Login Integration**: Enhanced login page with admin links
- **Routing**: Protected routes for admin-only features
- **Authentication**: JWT-based authentication system
- **Navigation**: Admin-specific navigation in dashboard

### Future Enhancements:
- **Admin Dashboard**: Admin management interface
- **User Management**: Create/manage donors, hospitals, NGOs
- **Role-based Access**: Different admin permission levels
- **Audit Trail**: Track admin actions and changes

## Usage Instructions

### For New Admins:
1. **Signup**: Navigate to `/admin-signup`
2. **Fill Form**: Enter name, email, and password
3. **Submit**: Complete account creation
4. **Login**: Use new credentials to access system

### For Existing Admins:
1. **Login**: Use existing credentials
2. **Forgot Password**: Click "Forgot Password?" link
3. **Enter Email**: Provide registered email address
4. **Check Email**: Receive 6-digit OTP
5. **Enter OTP**: Verify code on website
6. **Set New Password**: Create new secure password

### For System Administrators:
1. **Access Admin Features**: Use admin dashboard
2. **Manage Users**: Create/edit/delete other users
3. **Monitor System**: View system statistics and logs
4. **Security Management**: Manage admin accounts and permissions

## Technical Stack

- **Frontend**: React.js with Framer Motion
- **UI Components**: Custom shadcn/ui components
- **Styling**: Tailwind CSS with glass morphism
- **State Management**: React hooks (useState, useEffect)
- **Routing**: React Router v6
- **Backend Integration**: RESTful API with fetch
- **Database**: MySQL with prepared statements
- **Authentication**: JWT-based auth system
- **Password Hashing**: bcrypt/argon2
- **Email Service**: SMTP integration for OTP

## Error Handling

### Common Error Scenarios:
- **Invalid Email**: Email not found in database
- **Invalid OTP**: Wrong or expired OTP code
- **Weak Password**: Password doesn't meet requirements
- **Email Already Exists**: Duplicate email during signup
- **Network Errors**: API connection issues

### Error Messages:
- **User-friendly**: Clear, actionable error messages
- **Specific**: Detailed information about the issue
- **Non-technical**: Avoid exposing system details
- **Helpful**: Provide guidance on how to resolve

## Performance Optimization

- **Lazy Loading**: Load components on demand
- **Debounced Input**: Optimize form validation
- **Caching**: Cache admin data where appropriate
- **Optimistic Updates**: Immediate UI feedback
- **Error Boundaries**: Graceful error handling

## Testing Considerations

### Unit Tests:
- Form validation functions
- API service methods
- Component rendering
- Error handling

### Integration Tests:
- End-to-end signup flow
- Password reset process
- Login authentication
- API endpoint testing

### Security Tests:
- Password strength validation
- OTP verification
- SQL injection prevention
- XSS protection 