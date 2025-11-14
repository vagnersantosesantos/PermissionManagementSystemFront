import axios from 'axios';
import { PermissionType } from '../types/Permission';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:65126/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const permissionTypeService = {
  getPermissionTypes: async (): Promise<PermissionType[]> => {
    const response = await api.get<PermissionType[]>('/permissionsTypes/types');
    return response.data;
  },
};

export default permissionTypeService;
