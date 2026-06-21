import { Types } from 'mongoose';

export interface CommentAuthor {
  _id: Types.ObjectId;
  nombre: string;
  apellido: string;
  username: string;
  imagenPerfil: string;
}

export interface CommentPopulated {
  _id: Types.ObjectId;
  postId: Types.ObjectId;
  usuarioId: CommentAuthor;
  mensaje: string;
  modificado: boolean;
  eliminado: boolean;
  createdAt: Date;
  updatedAt: Date;
}
