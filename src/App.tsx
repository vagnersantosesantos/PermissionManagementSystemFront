import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PermissionList from './components/PermissionList';
import PermissionForm from './components/PermissionForm';
import { Permission, CreatePermissionDto, UpdatePermissionDto } from './types/Permission';
import { permissionService } from './services/permissionService';

function App() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    setLoading(true);
    try {
      const data = await permissionService.getPermissions();
      setPermissions(data);
    } catch (error) {
      showSnackbar('Error al cargar permisos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setSelectedPermission(undefined);
    setFormMode('create');
    setFormOpen(true);
  };

  const handleEditClick = (permission: Permission) => {
    setSelectedPermission(permission);
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: CreatePermissionDto | UpdatePermissionDto) => {
    try {
      if (formMode === 'create') {
        await permissionService.requestPermission(data as CreatePermissionDto);
        showSnackbar('Permiso creado exitosamente', 'success');
      } else {
        const updateData = data as UpdatePermissionDto;
        await permissionService.modifyPermission(updateData.id, updateData);
        showSnackbar('Permiso modificado exitosamente', 'success');
      }
      await loadPermissions();
    } catch (error) {
      showSnackbar(
        `Error al ${formMode === 'create' ? 'crear' : 'modificar'} permiso`,
        'error'
      );
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Gestión de Permisos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Sistema de administración de permisos de empleados
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Solicitar Permiso
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <PermissionList permissions={permissions} onEdit={handleEditClick} />
      )}

      <PermissionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        permission={selectedPermission}
        mode={formMode}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
