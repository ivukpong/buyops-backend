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
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AssetsService } from './assets.service';
import { imageFileFilter, documentFileFilter } from '../common/upload.config';

// ══════════════════════════════════════════════════════════════════════════
// ASSETS CONTROLLER - Complete API Endpoints
// Includes all CRUD + publish/unpublish + images/documents management
// ══════════════════════════════════════════════════════════════════════════

@Controller('assets')
@UseGuards(AuthGuard('jwt'))
export class AssetsController {
  constructor(private assetsService: AssetsService) { }

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

  @Post(':id/images/upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `image-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: imageFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    })
  )
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.assetsService.uploadImages(id, files);
  }

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

  @Post(':id/documents/upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor('documents', 10, {
      storage: diskStorage({
        destination: './uploads/documents',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `doc-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: documentFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    })
  )
  async uploadDocuments(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.assetsService.uploadDocuments(id, files);
  }

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
