import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://api-proofhub-ai.yukaha.com'; // آدرس بک‌اند

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export async function createAuditApi(prompt, model = 'gemini-2.5-flash') {
  try {
    const response = await apiClient.post('/audit/create', { prompt, model });
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
  const response = await apiClient.get('/audit');
  return response.data;
}

export async function getAuditApi(id) {
  const response = await apiClient.get(`/audit/${id}`);
  return response.data;
}
export const getAuditByIdApi = async (auditId) => {
  const response = await fetch(`/audit/${auditId}`);
  if (!response.ok) throw new Error('Audit not found');
  return response.json();
};

export async function verifyAuditApi({ auditId, proofHash }) {
  const response = await apiClient.post('/audit/verify', { auditId, proofHash });
  return response.data;
}

export async function generateAudit(prompt, walletAddress) {
  try {
    const response = await apiClient.post('/ai/generate', {
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
    const response = await apiClient.post('/ai/confirm', {
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