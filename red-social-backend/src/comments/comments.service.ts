import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './schema/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import JwtPayload from '../auth/interfaces/jwt-payload.auth.interface';
import { CommentPopulated } from './interfaces/comment-populated.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  async findByPost(
    postId: string,
    limit: number,
    offset: number,
    user: JwtPayload,
  ) {
    const postObjectId = new Types.ObjectId(String(postId));
    const [comments, total] = await Promise.all([
      this.commentModel
        .find({ postId: postObjectId, eliminado: false })
        .populate('usuarioId', 'nombre apellido username imagenPerfil')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean() as unknown as Promise<CommentPopulated[]>,
      this.commentModel.countDocuments({ postId: postObjectId, eliminado: false }),
    ]);

    const data = comments.map((c) => ({
      ...c,
      canDelete:
        c.usuarioId._id.toString() === user.sub ||
        user.perfil === 'administrador',
      canEdit: c.usuarioId._id.toString() === user.sub,
    }));

    return { data, total, limit, offset };
  }

  async create(dto: CreateCommentDto, user: JwtPayload) {
    return this.commentModel.create({
      postId: new Types.ObjectId(String(dto.postId)),
      usuarioId: new Types.ObjectId(String(user.sub)),
      mensaje: dto.mensaje,
    });
  }

  async update(id: string, dto: UpdateCommentDto, user: JwtPayload) {
    const comment = await this.commentModel.findOne({
      _id: id,
      eliminado: false,
    });

    if (!comment) throw new NotFoundException('Comentario no encontrado');
    if (comment.usuarioId.toString() !== user.sub)
      throw new ForbiddenException('No autorizado');

    return this.commentModel.findByIdAndUpdate(
      id,
      { mensaje: dto.mensaje, modificado: true },
      { new: true },
    );
  }

  async remove(id: string, user: JwtPayload) {
    const comment = await this.commentModel.findOne({
      _id: id,
      eliminado: false,
    });

    if (!comment) throw new NotFoundException('Comentario no encontrado');

    const isOwner = comment.usuarioId.toString() === user.sub;
    const isAdmin = user.perfil === 'administrador';
    if (!isOwner && !isAdmin) throw new ForbiddenException('No autorizado');

    return this.commentModel.findByIdAndUpdate(
      id,
      { eliminado: true },
      { new: true },
    );
  }
}
