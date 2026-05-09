// src/lib/api.ts
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// ─── Core HTTP client ────────────────────────────────────────────────────────
export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('jwt_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Only redirect to login on 401/403 for NON-auth endpoints
  if ((response.status === 401 || response.status === 403) && !endpoint.includes('/auth/')) {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}`);
  }

  return response.json();
};

// ─── Auth helpers ────────────────────────────────────────────────────────────
export const saveAuthData = (response: any) => {
  localStorage.setItem('jwt_token', response.token);
  localStorage.setItem('user_info', JSON.stringify({
    userId: response.userId,
    username: response.username,
    fullName: response.fullName,
    role: response.role,
    district: response.district,
  }));
};

export const getStoredUser = () => {
  const raw = localStorage.getItem('user_info');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

export const logout = () => {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user_info');
};

// ─── Auth API ────────────────────────────────────────────────────────────────
export const authApi = {
  login: (username: string, password: string) =>
    apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  register: (data: {
    username: string; password: string; fullName: string;
    contactNumber: string; district?: string; badgeNumber?: string; role: string;
  }) =>
    apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => apiClient('/auth/me'),
};

// ─── Fine API (public) ───────────────────────────────────────────────────────
export const fineApi = {
  verifyFine: (referenceNumber: string, categoryIdentifier: string) =>
    apiClient('/fines/verify', {
      method: 'POST',
      body: JSON.stringify({ referenceNumber, categoryIdentifier }),
    }),

  payFine: (data: {
    referenceNumber: string;
    categoryIdentifier: string;
    paymentMethod: string;
    cardHolderName?: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvv?: string;
    payerName?: string;
    payerContact?: string;
  }) =>
    apiClient('/fines/pay', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCategories: () => apiClient('/categories'),

  searchDriver: (type: 'NIC' | 'VEHICLE', query: string) =>
    apiClient(`/drivers/search?type=${encodeURIComponent(type)}&query=${encodeURIComponent(query)}`),
};

// ─── Officer API ─────────────────────────────────────────────────────────────
export const officerApi = {
  issueFine: (data: {
    categoryIdentifier: string;
    driverLicenseNumber: string;
    driverNic?: string;
    driverName?: string;
    vehicleNumber?: string;
    location?: string;
    notes?: string;
  }) =>
    apiClient('/officer/fines', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMyFines: () => apiClient('/officer/fines'),
};

// ─── Admin API ───────────────────────────────────────────────────────────────
export const adminApi = {
  getDashboard: () => apiClient('/admin/dashboard'),

  getAllFines: (district?: string) =>
    apiClient(`/admin/fines${district ? `?district=${encodeURIComponent(district)}` : ''}`),

  getAllOfficers: () => apiClient('/admin/officers'),

  createOfficer: (data: {
    username: string; password: string; fullName: string;
    contactNumber: string; district: string; badgeNumber: string;
  }) =>
    apiClient('/admin/officers', {
      method: 'POST',
      body: JSON.stringify({ ...data, role: 'OFFICER' }),
    }),

  deleteOfficer: (id: string) =>
    apiClient(`/admin/officers/${id}`, { method: 'DELETE' }),

  toggleOfficer: (id: string) =>
    apiClient(`/admin/officers/${id}/toggle`, { method: 'PATCH' }),

  getAllUsers: () => apiClient('/admin/users'),
};