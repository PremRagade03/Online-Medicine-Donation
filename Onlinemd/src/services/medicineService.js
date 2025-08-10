// src/services/medicineService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44344/api';

export const medicineService = {
  async getAllMedicines() {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Transform backend data to frontend format
      return this.transformMedicineData(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      throw new Error('Failed to fetch medicines from server');
    }
  },

  async getMedicinesByDonor(donorId) {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/donor/${donorId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Transform backend data to frontend format
      return this.transformMedicineData(data);
    } catch (error) {
      console.error('Error fetching donor medicines:', error);
      throw new Error('Failed to fetch donor medicines from server');
    }
  },

  async getMedicineById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Transform single medicine data
      return this.transformMedicineData([data])[0];
    } catch (error) {
      console.error('Error fetching medicine details:', error);
      throw new Error('Failed to fetch medicine details from server');
    }
  },

  async addMedicine(medicine) {
    try {
      // Transform frontend data to backend format
      const backendData = this.transformToBackendFormat(medicine);
      
      const response = await fetch(`${API_BASE_URL}/medicines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformMedicineData([data])[0];
    } catch (error) {
      console.error('Error adding medicine:', error);
      throw new Error('Failed to add medicine to server');
    }
  },

  async updateMedicine(id, medicine) {
    try {
      // Transform frontend data to backend format
      const backendData = this.transformToBackendFormat(medicine);
      
      const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformMedicineData([data])[0];
    } catch (error) {
      console.error('Error updating medicine:', error);
      throw new Error('Failed to update medicine on server');
    }
  },

  async deleteMedicine(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting medicine:', error);
      throw new Error('Failed to delete medicine from server');
    }
  },

  // Transform backend data to frontend format
  transformMedicineData(backendData) {
    if (!Array.isArray(backendData)) {
      backendData = [backendData];
    }

    return backendData.map(item => ({
      MedicineID: item.id || item.MedicineID || item.medicineId,
      Name: item.name || item.Name || item.medicineName || 'Unknown Medicine',
      Description: item.description || item.Description || item.medicineDescription || 'No description available',
      ExpiryDate: item.expiryDate || item.ExpiryDate || item.expiry_date || 'N/A',
      Quantity: item.quantity || item.Quantity || item.medicineQuantity || 0,
      DonorID: item.donorId || item.DonorID || item.donor_id || 0,
      Status: item.status || item.Status || 'pending',
      CreatedAt: item.createdAt || item.CreatedAt || item.created_at || new Date().toISOString(),
      // Additional fields that might be useful
      Category: item.category || item.Category || 'General',
      Manufacturer: item.manufacturer || item.Manufacturer || 'Unknown',
      Dosage: item.dosage || item.Dosage || 'N/A',
      Form: item.form || item.Form || 'N/A',
      Price: item.price || item.Price || 0,
      BatchNumber: item.batchNumber || item.BatchNumber || item.batch_number || 'N/A',
      StorageCondition: item.storageCondition || item.StorageCondition || item.storage_condition || 'Store in a cool, dry place',
      PrescriptionRequired: item.prescriptionRequired || item.PrescriptionRequired || item.prescription_required || false
    }));
  },

  // Transform frontend data to backend format
  transformToBackendFormat(frontendData) {
    return {
      name: frontendData.Name || frontendData.name,
      description: frontendData.Description || frontendData.description,
      expiryDate: frontendData.ExpiryDate || frontendData.expiryDate,
      quantity: frontendData.Quantity || frontendData.quantity,
      donorId: frontendData.DonorID || frontendData.donorId,
      status: frontendData.Status || frontendData.status,
      category: frontendData.Category || frontendData.category,
      manufacturer: frontendData.Manufacturer || frontendData.manufacturer,
      dosage: frontendData.Dosage || frontendData.dosage,
      form: frontendData.Form || frontendData.form,
      price: frontendData.Price || frontendData.price,
      batchNumber: frontendData.BatchNumber || frontendData.batchNumber,
      storageCondition: frontendData.StorageCondition || frontendData.storageCondition,
      prescriptionRequired: frontendData.PrescriptionRequired || frontendData.prescriptionRequired
    };
  },

  // Utility function to validate medicine data
  validateMedicineData(medicine) {
    const errors = [];
    
    if (!medicine.name || medicine.name.trim() === '') {
      errors.push('Medicine name is required');
    }
    
    if (!medicine.expiryDate) {
      errors.push('Expiry date is required');
    } else {
      const expiryDate = new Date(medicine.expiryDate);
      const today = new Date();
      if (expiryDate < today) {
        errors.push('Expiry date cannot be in the past');
      }
    }
    
    if (!medicine.quantity || medicine.quantity <= 0) {
      errors.push('Quantity must be greater than 0');
    }
    
    if (!medicine.donorId || medicine.donorId <= 0) {
      errors.push('Valid donor ID is required');
    }
    
    return errors;
  }
};
