import axios from 'axios';
import { Permission, CreatePermissionDto, UpdatePermissionDto } from '../types/Permission';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:65126/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const permissionService = {
  // Get all permissions
  getPermissions: async (): Promise<Permission[]> => {
    const response = await api.get<Permission[]>('/permissions');
    return response.data;
  },

  // Request new permission
  requestPermission: async (permission: CreatePermissionDto): Promise<Permission> => {
    const response = await api.post<Permission>('/permissions/request', permission);
    return response.data;
  },

  // Modify existing permission
  modifyPermission: async (id: number, permission: UpdatePermissionDto): Promise<Permission> => {
    const response = await api.put<Permission>(`/permissions/modify/${id}`, permission);
    return response.data;
  },
};

export default permissionService;
