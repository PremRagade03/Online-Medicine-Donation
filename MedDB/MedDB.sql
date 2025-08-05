USE [Med_Donation];
GO

-- Drop tables in dependency order
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS medicines;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS hospitals;
DROP TABLE IF EXISTS ngos;
GO

-- USERS table
CREATE TABLE users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100),
    Phone NVARCHAR(20),
    Address NVARCHAR(255),
    Email NVARCHAR(255),
    Password NVARCHAR(255)
);
GO

INSERT INTO users (Name, Phone, Address, Email, Password) VALUES
('Prem Ragade', '8080759281', 'Pune', 'prem@example.com', 'pass123'),
('Ravi Kumar', '9876543210', 'Delhi', 'ravi@example.com', 'ravi321'),
('Anjali Sharma', '9871234560', 'Mumbai', 'anjali@example.com', 'anjali@123'),
('Suresh Mehta', '9001234567', 'Ahmedabad', 'suresh@example.com', 'suresh123'),
('Divya Nair', '9123456780', 'Kochi', 'divya@example.com', 'divya321');
GO

-- ADMINS table
CREATE TABLE admins (
    AdminId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100),
    Role NVARCHAR(50),
    Email NVARCHAR(255),
    Password NVARCHAR(255)
);
GO

INSERT INTO admins (Name, Role, Email, Password) VALUES
('Admin1', 'SuperAdmin', 'admin1@meddonation.com', 'admin123'),
('Admin2', 'Moderator', 'admin2@meddonation.com', 'mod123'),
('Admin3', 'Viewer', 'admin3@meddonation.com', 'view123'),
('Admin4', 'Manager', 'admin4@meddonation.com', 'mgr123'),
('Admin5', 'Coordinator', 'admin5@meddonation.com', 'coord123');
GO

-- HOSPITALS table
CREATE TABLE hospitals (
    HospitalId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100),
    Address NVARCHAR(255),
    Phone NVARCHAR(20),
    Email NVARCHAR(255),
    Password NVARCHAR(255)
);
GO

INSERT INTO hospitals (Name, Address, Phone, Email, Password) VALUES
('City Care Hospital', 'Mumbai', '9874561230', 'citycare@hospital.com', 'city123'),
('Apex Hospital', 'Chennai', '9123450987', 'apex@hospital.com', 'apex456'),
('Sunrise Clinic', 'Delhi', '8765432109', 'sunrise@clinic.com', 'sun123'),
('Hope Hospital', 'Bangalore', '9345678901', 'hope@hospital.com', 'hope321'),
('Global Hospital', 'Hyderabad', '9008765432', 'global@hospital.com', 'global789');
GO

-- NGOS table
CREATE TABLE ngos (
    NgoId INT PRIMARY KEY IDENTITY(1,1),
    OrganizationName NVARCHAR(100),
    ContactPerson NVARCHAR(100),
    Phone NVARCHAR(20),
    Address NVARCHAR(255),
    Email NVARCHAR(255),
    Password NVARCHAR(255)
);
GO

INSERT INTO ngos (OrganizationName, ContactPerson, Phone, Address, Email, Password) VALUES
('Health for All', 'Ritika Sen', '9988776655', 'Kolkata', 'hfa@ngo.org', 'hfa123'),
('Care India', 'Manoj Das', '9876543212', 'Ranchi', 'care@ngo.org', 'care321'),
('Life Savers', 'Priya Mehta', '8765432198', 'Indore', 'lifesavers@ngo.org', 'save123'),
('MediTrust', 'Amit Kumar', '7654321987', 'Nagpur', 'meditrust@ngo.org', 'trust123'),
('CureReach', 'Nisha Singh', '9873214560', 'Patna', 'curereach@ngo.org', 'cure456');
GO

-- MEDICINES table
CREATE TABLE medicines (
    MedicineID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100),
    Description NVARCHAR(255),
    ExpiryDate DATE,
    Quantity INT,
    DonorID INT FOREIGN KEY REFERENCES users(UserId),
    Status NVARCHAR(50),
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

INSERT INTO medicines (Name, Description, ExpiryDate, Quantity, DonorID, Status, CreatedAt) VALUES
('Paracetamol', 'Used for fever and pain relief', '2026-01-01', 10, 1, 'Available', GETDATE()),
('Amoxicillin', 'Antibiotic for infections', '2025-12-12', 20, 2, 'Available', GETDATE()),
('Azithromycin', 'Used for chest infections', '2025-11-10', 15, 3, 'Pending', GETDATE()),
('Ibuprofen', 'Pain killer and anti-inflammatory', '2026-06-01', 25, 4, 'Available', GETDATE()),
('Metformin', 'Used to treat diabetes', '2027-01-01', 30, 5, 'Approved', GETDATE());
GO

-- DONATIONS table
CREATE TABLE donations (
    DonationID INT PRIMARY KEY IDENTITY(1,1),
    MedicineID INT FOREIGN KEY REFERENCES medicines(MedicineID),
    DonatedToNgoId INT FOREIGN KEY REFERENCES ngos(NgoId),
    DonatedAt DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(50)
);
GO

INSERT INTO donations (MedicineID, DonatedToNgoId, DonatedAt, Status) VALUES
(1, 1, GETDATE(), 'Completed'),
(2, 2, GETDATE(), 'Pending'),
(3, 3, GETDATE(), 'Approved'),
(4, 4, GETDATE(), 'Rejected'),
(5, 5, GETDATE(), 'Completed');
GO

-- REQUESTS table (Updated to allow either Hospital or NGO)
CREATE TABLE requests (
    RequestID INT PRIMARY KEY IDENTITY(1,1),
    RequestedByHospitalId INT NULL,
    RequestedByNgoId INT NULL,
    MedicineName NVARCHAR(100),
    Quantity INT,
    RequestDate DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(50),

    CONSTRAINT FK_Requests_Hospital FOREIGN KEY (RequestedByHospitalId) REFERENCES hospitals(HospitalId),
    CONSTRAINT FK_Requests_Ngo FOREIGN KEY (RequestedByNgoId) REFERENCES ngos(NgoId),

    -- Only one of the two (Hospital or NGO) can make a request
    CONSTRAINT CK_RequesterType CHECK (
        (RequestedByHospitalId IS NOT NULL AND RequestedByNgoId IS NULL) OR 
        (RequestedByHospitalId IS NULL AND RequestedByNgoId IS NOT NULL)
    )
);
GO

INSERT INTO requests (RequestedByHospitalId, RequestedByNgoId, MedicineName, Quantity, Status)
VALUES
(1, NULL, 'Paracetamol', 10, 'Pending'),
(2, NULL, 'Ibuprofen', 5, 'Approved'),
(NULL, 1, 'Amoxicillin', 8, 'Rejected'),
(NULL, 2, 'Metformin', 12, 'Completed'),
(3, NULL, 'Azithromycin', 7, 'Pending');
GO
