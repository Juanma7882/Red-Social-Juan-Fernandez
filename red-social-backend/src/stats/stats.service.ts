import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../post/schemas/post.schema';
import { Comment } from '../comments/schema/comment.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  private endOfDay(dateStr: string): Date {
    const d = new Date(dateStr);
    d.setUTCHours(23, 59, 59, 999);
    return d;
  }

  async getPostsByUser(from: string, to: string) {
    return this.postModel.aggregate([
      {
        $match: {
          eliminado: { $ne: true },
          createdAt: { $gte: new Date(from), $lte: this.endOfDay(to) },
        },
      },
      {
        $group: {
          _id: '$usuarioId',
          total: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { uid: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: [{ $toString: '$_id' }, '$$uid'] },
              },
            },
          ],
          as: 'usuario',
        },
      },
      { $unwind: '$usuario' },
      {
        $project: {
          _id: 0,
          username: '$usuario.username',
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);
  }

  async getCommentsOverTime(from: string, to: string) {
    return this.commentModel.aggregate([
      {
        $match: {
          eliminado: { $ne: true },
          createdAt: { $gte: new Date(from), $lte: this.endOfDay(to) },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          fecha: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: '$_id.day',
                },
              },
            },
          },
          total: 1,
        },
      },
      { $sort: { fecha: 1 } },
    ]);
  }

  async getCommentsByPost(from: string, to: string) {
    return this.commentModel.aggregate([
      {
        $match: {
          eliminado: { $ne: true },
          createdAt: { $gte: new Date(from), $lte: this.endOfDay(to) },
        },
      },
      {
        $group: {
          _id: '$postId',
          total: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'posts',
          let: { pid: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: [{ $toString: '$_id' }, '$$pid'] },
              },
            },
          ],
          as: 'post',
        },
      },
      { $unwind: '$post' },
      {
        $project: {
          _id: 0,
          titulo: '$post.titulo',
          total: 1,
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);
  }
}
