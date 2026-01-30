import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssetsService } from './assets.service';

// ══════════════════════════════════════════════════════════════════════════
// ASSETS CONTROLLER - Complete API Endpoints
// Includes all CRUD + publish/unpublish + images/documents management
// ══════════════════════════════════════════════════════════════════════════

@Controller('assets')
@UseGuards(AuthGuard('jwt'))
export class AssetsController {
  constructor(private assetsService: AssetsService) {}

  // ═══ BASIC CRUD ═══

  @Get()
  async findAll(@Query() query: any) {
    return this.assetsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.assetsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAssetDto: any) {
    return this.assetsService.create(createAssetDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAssetDto: any) {
    return this.assetsService.update(id, updateAssetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    return this.assetsService.delete(id);
  }

  // ═══ PUBLISH/UNPUBLISH ═══

  @Put(':id/publish')
  @HttpCode(HttpStatus.OK)
  async publish(@Param('id') id: string) {
    return this.assetsService.publish(id);
  }

  @Put(':id/unpublish')
  @HttpCode(HttpStatus.OK)
  async unpublish(@Param('id') id: string) {
    return this.assetsService.unpublish(id);
  }

  // ═══ IMAGE MANAGEMENT ═══

  @Post(':id/images')
  @HttpCode(HttpStatus.CREATED)
  async addImage(
    @Param('id') id: string,
    @Body() imageData: { url: string; caption?: string }
  ) {
    return this.assetsService.addImage(id, imageData);
  }

  @Delete(':id/images/:imageId')
  @HttpCode(HttpStatus.OK)
  async deleteImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string
  ) {
    return this.assetsService.deleteImage(id, imageId);
  }

  // ═══ DOCUMENT MANAGEMENT ═══

  @Post(':id/documents')
  @HttpCode(HttpStatus.CREATED)
  async addDocument(
    @Param('id') id: string,
    @Body() documentData: { url: string; name: string; type: string }
  ) {
    return this.assetsService.addDocument(id, documentData);
  }

  @Delete(':id/documents/:documentId')
  @HttpCode(HttpStatus.OK)
  async deleteDocument(
    @Param('id') id: string,
    @Param('documentId') documentId: string
  ) {
    return this.assetsService.deleteDocument(id, documentId);
  }
}
