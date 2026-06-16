export interface LoginAuth {
  identifier: string;
  password: string;
}

export interface SignUpAuth {
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  password: string;
  fechaNacimiento: string;
  descripcion: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  password: string;
  fechaNacimiento: string;
  descripcion: string;
  imagenPerfil: string;
  perfil: 'usuario' | 'admin'; // Tipo específico
  habilitado: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
