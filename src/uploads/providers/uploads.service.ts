import { BadRequestException, ConflictException, Injectable, UploadedFile } from '@nestjs/common';
import { Repository } from 'typeorm';
import type { Express } from 'express';
import { Upload } from '../upload.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { ConfigService } from '@nestjs/config';
import { uploadFile } from '../interfaces/upload-file.interface';
import { fileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {
    constructor(
        /** Inject configService  */
        private readonly configService: ConfigService,
        
        /** Inject uploadToAwsProvider */
        private readonly uploadToAwsProvider: UploadToAwsProvider,
       
        /** Inject uploads repository */
        @InjectRepository(Upload)
        private readonly uploadsRepository: Repository<Upload>
    ) {}
    public async uploadFile(file: Express.Multer.File){
        // Throw error if MIME type is unsupported
        if(!['image/gif', 'image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
            throw new BadRequestException('Mime type not supported');
        }
        try {
            // Upload the file to AWS S3
            const name = await this.uploadToAwsProvider.fileUpload(file);

            // Generate the new entry in the DB
            const uploadFile: uploadFile = {
                name: name,
                path: `https://${this.configService.get('appConfig.awsCloudFrontUrl')}/${name}`,
                type: fileTypes.IMAGE,
                mime: file.mimetype,
                size: file.size
            }
            const upload = this.uploadsRepository.create(uploadFile);
            return await this.uploadsRepository.save(upload);
        } catch( error) {
            throw new ConflictException('error');
        }
    }

}
