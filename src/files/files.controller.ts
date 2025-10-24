// job.controller.ts
import { Controller, FileTypeValidator, HttpStatus, MaxFileSizeValidator, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { SafeParseFilePipe } from './pipes/safe-parse-file.pipe';


@Controller('files')
export class FilesController {

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('fileUpload'))
  uploadFile(@UploadedFile(
    new SafeParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: /^image\/(png|jpeg|jpg)$/ }),
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
      ],
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  ) file: Express.Multer.File) {
    return {
      filename: file.filename
    }
  }

}
