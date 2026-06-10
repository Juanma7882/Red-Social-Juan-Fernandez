import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post, PostSchema } from './schemas/post.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';
import {
  LoginHistory,
  LoginHistorySchema,
} from './schemas/login-history.schema';
import { SharedPost, SharedPostSchema } from './schemas/shared-post.schema';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: Comment.name,
        schema: CommentSchema,
      },
      {
        name: SharedPost.name,
        schema: SharedPostSchema,
      },
      {
        name: LoginHistory.name,
        schema: LoginHistorySchema,
      },
    ]),
  ],
})
export class PostModule {}
