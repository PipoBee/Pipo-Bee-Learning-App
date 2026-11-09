import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ParentsService } from './parents.service';

export class CreateChildDto {
  @ApiProperty({ example: 'Mia' })
  @IsString()
  @MinLength(2)
  displayName: string;

  @ApiProperty({ example: 6, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(3)
  @Max(14)
  age?: number;

  @ApiProperty({ example: 'owl_01', required: false })
  @IsOptional()
  @IsString()
  avatarId?: string;
}

@ApiTags('Parent Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PARENT)
@Controller('api/v1/parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Get('children')
  @ApiOperation({ summary: 'List the parent child dashboards (max 3)' })
  listChildren(@Request() req: { user: { id: string } }) {
    return this.parentsService.listChildren(req.user.id);
  }

  @Post('children')
  @ApiOperation({ summary: 'Create a child dashboard (maximum of 3)' })
  createChild(@Request() req: { user: { id: string } }, @Body() body: CreateChildDto) {
    return this.parentsService.createChild(req.user.id, body);
  }

  @Get('children/:id/dashboard')
  @ApiOperation({ summary: 'View one child progress, completion, and pending work' })
  getChildDashboard(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.parentsService.getChildDashboard(req.user.id, id);
  }

  @Delete('children/:id')
  @ApiOperation({ summary: 'Remove a child dashboard and free a slot' })
  deleteChild(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.parentsService.deleteChild(req.user.id, id);
  }
}
