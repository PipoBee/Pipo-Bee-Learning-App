import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { SpeechService } from './speech.service';

@ApiTags('Speech Assessment')
@Controller('api/v1/speech')
export class SpeechController {
  constructor(private readonly speechService: SpeechService) {}

  @Post('assess')
  @ApiOperation({ summary: 'Assess audio pronunciation (Azure proxy or local fallback)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('audio'))
  async assess(
    @UploadedFile() file: Express.Multer.File,
    @Body('referenceText') referenceText: string,
    @Body('targetPhoneme') targetPhoneme?: string
  ) {
    return this.speechService.assessSpeech(
      referenceText || 's',
      targetPhoneme,
      file ? file.buffer : undefined
    );
  }

  @Get('health')
  @ApiOperation({ summary: 'Check cloud speech provider configuration status' })
  async getHealth() {
    return this.speechService.getHealth();
  }
}
