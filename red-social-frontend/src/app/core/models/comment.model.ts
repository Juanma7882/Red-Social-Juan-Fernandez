export interface CommentAuthor {
  _id: string;
  nombre: string;
  apellido: string;
  username: string;
  imagenPerfil: string;
}

export interface Comment {
  _id: string;
  postId: string;
  usuarioId: CommentAuthor;
  mensaje: string;
  modificado: boolean;
  eliminado: boolean;
  createdAt: string;
  updatedAt: string;
  canDelete: boolean;
  canEdit: boolean;
}

export interface CommentResponse {
  data: Comment[];
  total: number;
  limit: number;
  offset: number;
}
