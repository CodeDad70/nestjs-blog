import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Express } from 'express';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UploadToAwsProvider {
    constructor(
        /** Inject configService */
        private readonly configService: ConfigService
    ){}

    public async fileUpload(file: Express.Multer.File) {
        // create a new s3 object to upload images to AWS S3
        const s3 = new S3();

        try {
            const uploadResult = await s3.upload({
                Bucket: this.configService.get('appConfig.awsBucketName') ?? '',
                Body: file.buffer,
                Key: this.generateFileName(file),
                ContentType: file.mimetype
            }).promise();
            
            return uploadResult.Key;
        } catch (error) {
            throw new RequestTimeoutException(error)
        }
    }

    private generateFileName(file: Express.Multer.File) {
        // Extract file name
        const name = file.originalname.split('.')[0];
        // Remove white space
        name.replace(/\s/g, '').trim();
        // Extract the extension
        let extension = path.extname(file.originalname)
        // Generate time stamp to append to filename 
        let timestamp = new Date().getTime().toString().trim();
        // Return concat file name with uuid 
        return `${name}-${timestamp}-${uuid4()}${extension}`
    }
}
