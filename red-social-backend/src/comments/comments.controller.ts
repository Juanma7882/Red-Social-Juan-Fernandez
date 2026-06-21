import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import JwtPayload from '../auth/interfaces/jwt-payload.auth.interface';

@UseGuards(JwtGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findByPost(
    @Query('postId') postId: string,
    @Query('limit') limit = '3',
    @Query('offset') offset = '0',
    @Req() req: { user: JwtPayload },
  ) {
    return this.commentsService.findByPost(
      postId,
      Number(limit),
      Number(offset),
      req.user,
    );
  }

  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: { user: JwtPayload },
  ) {
    return this.commentsService.create(createCommentDto, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: { user: JwtPayload },
  ) {
    return this.commentsService.update(id, updateCommentDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: { user: JwtPayload }) {
    return this.commentsService.remove(id, req.user);
  }
}
