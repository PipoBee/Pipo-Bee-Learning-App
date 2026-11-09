import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContentService } from './content.service';

@ApiTags('Curriculum Content')
@Controller('api/v1/content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('bundle')
  @ApiOperation({ summary: 'Download complete offline-ready curriculum JSON pack' })
  @ApiResponse({ status: 200, description: 'Content pack bundle' })
  async getBundle() {
    return this.contentService.getBundle();
  }

  @Get('worlds')
  @ApiOperation({ summary: 'List all published worlds and levels' })
  async getWorlds() {
    return this.contentService.getWorlds();
  }

  @Get('levels/:id')
  @ApiOperation({ summary: 'Get single level details with tasks and items' })
  async getLevelById(@Param('id') id: string) {
    return this.contentService.getLevelById(id);
  }
}
