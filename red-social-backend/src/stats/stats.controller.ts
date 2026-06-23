import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@UseGuards(AdminGuard)
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('posts-by-user')
  getPostsByUser(@Query('from') from: string, @Query('to') to: string) {
    const response = this.statsService.getPostsByUser(from, to);
    console.log('post by user:', response);
    return response;
  }

  @Get('comments-over-time')
  getCommentsOverTime(@Query('from') from: string, @Query('to') to: string) {
    return this.statsService.getCommentsOverTime(from, to);
  }

  @Get('comments-by-post')
  getCommentsByPost(@Query('from') from: string, @Query('to') to: string) {
    return this.statsService.getCommentsByPost(from, to);
  }
}
