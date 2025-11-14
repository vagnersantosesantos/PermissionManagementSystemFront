import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Permission, PermissionType } from '../types/Permission';
import permissionTypeService from '../services/permissionTypeService';

interface PermissionListProps {
  permissions: Permission[];
  onEdit: (permission: Permission) => void;
}

const PermissionList: React.FC<PermissionListProps> = ({ permissions, onEdit }) => {
const [permissionTypes, setPermissionTypes] = useState<PermissionType[]>([]);

  useEffect(() => {
    loadPermissionTypes();
  }, []);

  const loadPermissionTypes = async () => {
    try {
      const types = await permissionTypeService.getPermissionTypes();
      setPermissionTypes(types);
    } catch (error) {
      console.error('Error al cargar tipos de permiso:', error);
    }
  };

  const getPermissionTypeLabel = (tipoPermiso: number): string => {
    const type = permissionTypes.find(t => t.id === tipoPermiso);
    return type ? type.description : 'Desconocido';
  };

  // Cores para os chips (mantém hardcoded pois é visual)
  const getPermissionTypeColor = (tipoPermiso: number) => {
    const colors: { [key: number]: 'primary' | 'secondary' | 'success' | 'warning' | 'info' } = {
      1: 'primary',   // Consultor
      2: 'warning',   // Líder
      3: 'info',      // Gerente
      4: 'success',   // Admin
    };
    return colors[tipoPermiso] || 'default';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Tipo de Permiso</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {permissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No hay permisos registrados
              </TableCell>
            </TableRow>
          ) : (
            permissions.map((permission) => (
              <TableRow key={permission.id} hover>
                <TableCell>{permission.id}</TableCell>
                <TableCell>{permission.nombreEmpleado}</TableCell>
                <TableCell>{permission.apellidoEmpleado}</TableCell>
                <TableCell>
                  <Chip
                    label={getPermissionTypeLabel(permission.tipoPermiso)}
                    color={getPermissionTypeColor(permission.tipoPermiso)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(permission.fechaPermiso)}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => onEdit(permission)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PermissionList;