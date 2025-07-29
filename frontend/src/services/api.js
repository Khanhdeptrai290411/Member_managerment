import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const memberService = {
  // Lấy danh sách tất cả hội viên
  getAll: async () => {
    const response = await api.get('/members');
    return response.data;
  },

  // Lấy thông tin một hội viên theo ID
  getById: async (id) => {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },

  // Tạo hội viên mới
  create: async (memberData) => {
    const response = await api.post('/members', memberData);
    return response.data;
  },

  // Cập nhật thông tin hội viên
  update: async (id, memberData) => {
    const response = await api.put(`/members/${id}`, memberData);
    return response.data;
  },

  // Xóa hội viên
  delete: async (id) => {
    const response = await api.delete(`/members/${id}`);
    return response.data;
  },
};

export default api; 