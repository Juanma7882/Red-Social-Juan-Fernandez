import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Model, Types } from 'mongoose';
import { Post } from './schemas/post.schema';
import JwtPayload from '../auth/interfaces/jwt-payload.auth.interface';
import { QueryPostDto } from './dto/quey-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../comments/schema/comment.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
  ) {}

  async create(createPostDto: CreatePostDto, user: JwtPayload) {
    return this.postModel.create({
      ...createPostDto,

      usuarioId: user.sub,
    });
  }

  async findAll(query: QueryPostDto) {
    const { orderBy, limit, offset, userId } = query;

    const limitNumber = Number(limit);
    const offsetNumber = Number(offset);

    const filters: { eliminado: boolean; usuarioId?: string } = {
      eliminado: false,
    };
    if (userId) filters.usuarioId = userId;

    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    switch (orderBy) {
      case 'likes':
        sort = { likes: -1 };
        break;
      case 'guardados':
        sort = { guardadosPor: -1 };
        break;
      case 'compartidos':
        sort = { compartidosCount: -1 };
        break;
    }

    const [posts, total] = await Promise.all([
      this.postModel
        .find(filters)
        .populate('usuarioId', 'nombre apellido username imagenPerfil')
        .sort(sort)
        .skip(offsetNumber)
        .limit(limitNumber)
        .lean(), // ← lean() para poder agregarle commentCount
      this.postModel.countDocuments(filters),
    ]);

    // Contar comentarios de cada post en un solo aggregate
    const postIds = posts.map((p) => p._id);
    const commentCounts = await this.commentModel.aggregate<{
      _id: Types.ObjectId;
      count: number;
    }>([
      { $match: { postId: { $in: postIds }, eliminado: false } },
      { $group: { _id: '$postId', count: { $sum: 1 } } },
    ]);

    // Mapear counts a un objeto para lookup O(1)
    const countMap = new Map(
      commentCounts.map((c) => [c._id.toString(), c.count]),
    );

    // Agregar commentCount a cada post
    const data = posts.map((post) => ({
      ...post,
      commentCount: countMap.get(post._id.toString()) ?? 0,
    }));

    const page = Math.floor(offsetNumber / limitNumber) + 1;

    return {
      data,
      total,
      page,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    };
  }
  async findOne(id: string) {
    const post = await this.postModel
      .findOne({
        _id: id,
        eliminado: false,
      })
      .populate('usuarioId');

    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    return post;
  }

  async remove(id: string, user: JwtPayload) {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    const isOwner = post.usuarioId.toString() === user.sub;

    const isAdmin = user.perfil === 'administrador';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('No autorizado');
    }

    return this.postModel.findByIdAndUpdate(
      id,
      {
        eliminado: true,
      },
      {
        new: true,
      },
    );
  }

  async likePost(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      return post;
    }

    return this.postModel.findByIdAndUpdate(
      postId,
      {
        $push: {
          likes: userId,
        },
      },
      {
        new: true,
      },
    );
  }

  async unlikePost(postId: string, userId: string) {
    return this.postModel.findByIdAndUpdate(
      postId,
      {
        $pull: {
          likes: userId,
        },
      },
      {
        new: true,
      },
    );
  }
}
