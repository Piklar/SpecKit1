import axios from 'axios';

const getBaseUrl = () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

/**
 * Generic retry wrapper for API calls.
 * Retries once after a short delay on network/server error (not 4xx).
 */
const withRetry = async (fn, retries = 1, delayMs = 500) => {
  try {
    return await fn();
  } catch (err) {
    const status = err.response?.status;
    // Don't retry on client errors (4xx)
    if (retries > 0 && (!status || status >= 500)) {
      await new Promise((res) => setTimeout(res, delayMs));
      return withRetry(fn, retries - 1, delayMs);
    }
    throw err;
  }
};

export const createTask = async (taskData) => {
  return withRetry(async () => {
    const response = await axios.post(`${getBaseUrl()}/api/tasks`, taskData, getAuthHeaders());
    return response.data;
  });
};

export const getTasks = async () => {
  return withRetry(async () => {
    const response = await axios.get(`${getBaseUrl()}/api/tasks`, getAuthHeaders());
    return response.data;
  });
};

export const getTasksByDate = async (dateStr) => {
  return withRetry(async () => {
    const response = await axios.get(
      `${getBaseUrl()}/api/tasks/date/${dateStr}`,
      getAuthHeaders()
    );
    return response.data;
  });
};

export const updateTask = async (taskId, taskData) => {
  return withRetry(async () => {
    const response = await axios.put(
      `${getBaseUrl()}/api/tasks/${taskId}`,
      taskData,
      getAuthHeaders()
    );
    return response.data;
  });
};

export const toggleTask = async (taskId) => {
  return withRetry(async () => {
    const response = await axios.patch(
      `${getBaseUrl()}/api/tasks/${taskId}/toggle`,
      {},
      getAuthHeaders()
    );
    return response.data;
  });
};

export const deleteTask = async (taskId) => {
  return withRetry(async () => {
    const response = await axios.delete(
      `${getBaseUrl()}/api/tasks/${taskId}`,
      getAuthHeaders()
    );
    return response.data;
  });
};
