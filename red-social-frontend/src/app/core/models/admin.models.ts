export interface AdminUser {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  perfil: 'usuario' | 'administrador';
  habilitado: boolean;
  imagenPerfil: string;
  createdAt: string;
}

export interface CreateUserDto {
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  password: string;
  fechaNacimiento?: string;
  descripcion?: string;
  perfil: 'usuario' | 'administrador';
}

export interface StatPostsByUser {
  username: string;
  total: number;
}

export interface StatCommentsOverTime {
  fecha: string;
  total: number;
}

export interface StatCommentsByPost {
  titulo: string;
  total: number;
}
