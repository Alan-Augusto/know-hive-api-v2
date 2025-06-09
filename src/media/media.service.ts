import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class MediaService {

  async uploadImage(file: Express.Multer.File ): Promise<{ url: string }> {
    if (!file) {
      throw new InternalServerErrorException('Ocorreu um erro ao enviar o arquivo.');
    }
    const fileExtension = file.originalname.split('.').pop();
    const randomName = randomBytes(16).toString('hex');
    const fileName = `${randomName}.${fileExtension}`;

    const filePath = join(__dirname, '..', '..', 'uploads', fileName);

    try {
      await writeFile(filePath, file.buffer);

      const baseUrl = 'http://localhost:3000';
      const fileUrl = `${baseUrl}/uploads/${fileName}`;

      return { url: fileUrl };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Não foi possível salvar a imagem.',
      );
    }
  }

}
