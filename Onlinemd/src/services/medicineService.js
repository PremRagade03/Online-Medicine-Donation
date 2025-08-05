// Medicine Service - MySQL Integration
// This file demonstrates how to integrate with MySQL database for medicine CRUD operations

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44344/api';

export const medicineService = {
  // Get all medicines
  async getAllMedicines() {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines`);
      if (!response.ok) {
        throw new Error('Failed to fetch medicines');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching medicines:', error);
      throw error;
    }
  },

  // Get medicine by ID
  async getMedicineById(medicineId) {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/${medicineId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch medicine');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching medicine:', error);
      throw error;
    }
  },

  // Add new medicine
  async addMedicine(medicineData) {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicineData),
      });
      if (!response.ok) {
        throw new Error('Failed to add medicine');
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding medicine:', error);
      throw error;
    }
  },

  // Update medicine
  async updateMedicine(medicineId, medicineData) {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/${medicineId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicineData),
      });
      if (!response.ok) {
        throw new Error('Failed to update medicine');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating medicine:', error);
      throw error;
    }
  },

  // Delete medicine
  async deleteMedicine(medicineId) {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/${medicineId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete medicine');
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting medicine:', error);
      throw error;
    }
  },

  // Search medicines
  async searchMedicines(searchTerm) {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Failed to search medicines');
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching medicines:', error);
      throw error;
    }
  },

  // Get medicines by status
  async getMedicinesByStatus(status) {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/status/${status}`);
      if (!response.ok) {
        throw new Error('Failed to fetch medicines by status');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching medicines by status:', error);
      throw error;
    }
  },

  // Get medicines by donor
  async getMedicinesByDonor(donorId) {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/donor/${donorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch medicines by donor');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching medicines by donor:', error);
      throw error;
    }
  },

  // Get medicine statistics
  async getMedicineStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch medicine statistics');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching medicine statistics:', error);
      throw error;
    }
  },

  // Export medicines data
  async exportMedicines(format = 'json') {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/export?format=${format}`);
      if (!response.ok) {
        throw new Error('Failed to export medicines');
      }
      return await response.blob();
    } catch (error) {
      console.error('Error exporting medicines:', error);
      throw error;
    }
  }
};

// Example MySQL queries that would be used on the backend:

/*
-- Get all medicines
SELECT * FROM medicines ORDER BY CreatedAt DESC;

-- Get medicine by ID
SELECT * FROM medicines WHERE MedicineID = ?;

-- Add new medicine
INSERT INTO medicines (Name, Description, ExpiryDate, Quantity, DonorID, Status) 
VALUES (?, ?, ?, ?, ?, ?);

-- Update medicine
UPDATE medicines 
SET Name = ?, Description = ?, ExpiryDate = ?, Quantity = ?, DonorID = ?, Status = ? 
WHERE MedicineID = ?;

-- Delete medicine
DELETE FROM medicines WHERE MedicineID = ?;

-- Search medicines
SELECT * FROM medicines 
WHERE Name LIKE ? OR Description LIKE ? 
ORDER BY CreatedAt DESC;

-- Get medicines by status
SELECT * FROM medicines WHERE Status = ? ORDER BY CreatedAt DESC;

-- Get medicines by donor
SELECT * FROM medicines WHERE DonorID = ? ORDER BY CreatedAt DESC;

-- Get medicine statistics
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN Status = 'Pending' THEN 1 END) as pending,
  COUNT(CASE WHEN Status = 'Verified' THEN 1 END) as verified,
  COUNT(CASE WHEN Status = 'Donated' THEN 1 END) as donated,
  SUM(Quantity) as totalQuantity
FROM medicines;

-- Get medicines expiring soon (within 30 days)
SELECT * FROM medicines 
WHERE ExpiryDate <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) 
AND Status != 'Donated'
ORDER BY ExpiryDate ASC;
*/ 