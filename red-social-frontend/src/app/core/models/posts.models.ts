export interface CreatePostDto {
  titulo: string;
  mensaje: string;
  imagen?: string;
}

export interface responseCreatePostsDto {
  type: string;
  url: string;
  redirected: boolean;
  status: number;
  ok: boolean;
}

export interface PostModel {
  titulo: string;
  mensaje: string;
  imagen?: string;
  comentarios: [];
  likes: [];
}

export interface PostModel {
  data: Posts[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface Posts {
  _id: string;
  usuarioId: UsuarioId;
  titulo: string;
  mensaje: string;
  imagen: string;
  likes: any[];
  isLiked?: boolean;
  canDelete?: boolean;
  guardadosPor: any[];
  compartidosCount: number;
  eliminado: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  commentCount: number;
}

export interface UsuarioId {
  _id: string;
  nombre: string;
  apellido: string;
  username: string;
  imagenPerfil: string;
}

export interface QueryPostDto {
  orderBy?: orderBy;
  userId?: string;
  limit?: string;
  offset?: string;
}

export enum orderBy {
  likes = 'likes',
  guardados = 'guardados',
  compartidos = 'compartidos',
  fecha = 'fecha',
}
