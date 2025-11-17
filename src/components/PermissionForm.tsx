import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
} from '@mui/material';
import { Permission, CreatePermissionDto, UpdatePermissionDto, PermissionType } from '../types/Permission';
import permissionTypeService from '../services/permissionTypeService';

interface PermissionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (permission: CreatePermissionDto | UpdatePermissionDto) => Promise<void>;
  permission?: Permission;
  mode: 'create' | 'edit';
}

const PermissionForm: React.FC<PermissionFormProps> = ({
  open,
  onClose,
  onSubmit,
  permission,
  mode,
}) => {
  const [formData, setFormData] = useState({
    nombreEmpleado: '',
    apellidoEmpleado: '',
    tipoPermiso: 1,
    fechaPermiso: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [permissionTypes, setPermissionTypes] = useState<PermissionType[]>([]);

  useEffect(() => {
    if (mode === 'edit' && permission) {
      setFormData({
        nombreEmpleado: permission.nombreEmpleado,
        apellidoEmpleado: permission.apellidoEmpleado,
        tipoPermiso: permission.tipoPermiso,
        fechaPermiso: permission.fechaPermiso
          ? new Date(permission.fechaPermiso).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        nombreEmpleado: '',
        apellidoEmpleado: '',
        tipoPermiso: 1,
        fechaPermiso: new Date().toISOString().split('T')[0],
      });
    }

    if (open) {
      loadPermissionTypes();
    }
  }, [permission, mode, open]);

  const loadPermissionTypes = async () => {
    try {
      const types = await permissionTypeService.getPermissionTypes();
      setPermissionTypes(types);
    } catch (error) {
      console.error('Error al cargar tipos de permiso:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'tipoPermiso' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        fechaPermiso: new Date(formData.fechaPermiso).toISOString(),
        ...(mode === 'edit' && permission ? { id: permission.id } : {}),
      };

      await onSubmit(submitData as any);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Solicitar Permiso' : 'Modificar Permiso'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre del Empleado"
              name="nombreEmpleado"
              value={formData.nombreEmpleado}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Apellido del Empleado"
              name="apellidoEmpleado"
              value={formData.apellidoEmpleado}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              select
              label="Tipo de Permiso"
              name="tipoPermiso"
              value={formData.tipoPermiso}
              onChange={handleChange}
              required
              fullWidth
            >
              {permissionTypes.length === 0 ? (
                <MenuItem value="" disabled>
                  Cargando tipos...
                </MenuItem>
              ) : (
                permissionTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.description}
                  </MenuItem>
                ))
              )}
            </TextField>
            <TextField
              label="Fecha del Permiso"
              name="fechaPermiso"
              type="date"
              value={formData.fechaPermiso}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PermissionForm;