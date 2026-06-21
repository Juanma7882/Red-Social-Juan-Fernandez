import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import JwtPayload from '../auth/interfaces/jwt-payload.auth.interface';
import { QueryPostDto } from './dto/quey-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: { user: JwtPayload },
  ) {
    return this.postService.create(createPostDto, req.user);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@Query() query: QueryPostDto, @Req() req: { user: JwtPayload }) {
    return this.postService.findAll(query, req.user);
  }

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.postService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(
    @Param('id')
    id: string,

    @Req()
    req: {
      user: JwtPayload;
    },
  ) {
    return this.postService.remove(id, req.user);
  }

  @UseGuards(JwtGuard)
  @Post(':id/like')
  like(
    @Param('id')
    postId: string,

    @Req()
    req: {
      user: JwtPayload;
    },
  ) {
    return this.postService.likePost(postId, req.user.sub);
  }

  @UseGuards(JwtGuard)
  @Delete(':id/like')
  unlike(
    @Param('id')
    postId: string,

    @Req()
    req: {
      user: JwtPayload;
    },
  ) {
    return this.postService.unlikePost(postId, req.user.sub);
  }
}
