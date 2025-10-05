export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    me: `${API_BASE_URL}/api/auth/me`,
  },
  classrooms: `${API_BASE_URL}/api/classrooms`,
  faculty: `${API_BASE_URL}/api/faculty`,
  subjects: `${API_BASE_URL}/api/subjects`,
  sections: `${API_BASE_URL}/api/sections`,
  schedule: `${API_BASE_URL}/api/schedule`,
  dashboard: `${API_BASE_URL}/api/dashboard`,
};
