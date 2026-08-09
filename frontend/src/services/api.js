import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7056'; // آدرس بک‌اند

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export async function createAuditApi(prompt, model = 'gemini-2.5-flash') {
  try {
    const response = await apiClient.post('/api/audit/create', { prompt, model });
    return response.data;
  } catch (error) {
    console.error('API createAudit error:', error);
    throw new Error(
      error.response?.data?.error ||
      error.message ||
      'Failed to communicate with audit backend server.'
    );
  }
}

export async function getAllAuditsApi() {
  const response = await apiClient.get('/api/audit');
  return response.data;
}

export async function getAuditApi(id) {
  const response = await apiClient.get(`/api/audit/${id}`);
  return response.data;
}

export async function verifyAuditApi({ auditId, proofHash }) {
  const response = await apiClient.post('/api/audit/verify', { auditId, proofHash });
  return response.data;
}

export async function generateAudit(prompt, walletAddress) {
  try {
    const response = await apiClient.post('/api/ai/generate', {
      walletAddress,
      prompt,
    });
    return response.data;
  } catch (error) {
    console.error('Generate audit error:', error);
    throw error;
  }
}

export async function confirmBlockchain(recordId, transactionHash, contractAddress) {
  try {
    const response = await apiClient.post('/api/ai/confirm', {
      recordId,
      transactionHash,
      contractAddress,
    });
    return response.data;
  } catch (error) {
    console.error('Confirm blockchain error:', error);
    throw error;
  }
}