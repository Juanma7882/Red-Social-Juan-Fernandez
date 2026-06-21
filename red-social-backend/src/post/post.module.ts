import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post, PostSchema } from './schemas/post.schema';
// import { Comment, CommentSchema } from 'src/comments/schema/comment.schema';
import { Comment, CommentSchema } from '../comments/schema/comment.schema';
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
      { name: Post.name, schema: PostSchema },
      { name: SharedPost.name, schema: SharedPostSchema },
      { name: LoginHistory.name, schema: LoginHistorySchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
})
export class PostModule {}
