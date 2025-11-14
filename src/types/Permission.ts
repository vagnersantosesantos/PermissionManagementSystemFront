export interface Permission {
  id: number;
  nombreEmpleado: string;
  apellidoEmpleado: string;
  tipoPermiso: number;
  fechaPermiso: string;
  permissionTypeDescription?: string;
}

export interface CreatePermissionDto {
  nombreEmpleado: string;
  apellidoEmpleado: string;
  tipoPermiso: number;
  fechaPermiso: string;
}

export interface UpdatePermissionDto {
  id: number;
  nombreEmpleado: string;
  apellidoEmpleado: string;
  tipoPermiso: number;
  fechaPermiso: string;
}

export interface PermissionType {
  id: number;
  description: string;
}
