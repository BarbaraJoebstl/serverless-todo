import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from './logger';

const logger = createLogger('todos')

export class S3Helper {
    constructor(
        public readonly XAWS = AWSXRay.captureAWS(AWS),
        private readonly s3:AWS.S3 = new XAWS.S3({
            signatureVersion: 'v4',
            region: process.env.region,
            params: { Bucket: process.env.ASSETS_BUCKET }
        }),
        private readonly expiration = 60*5 // in seconds
    ) { }

    async getAttachmentUrl(todoId: string): Promise<string> {
        try{
            await this.s3.headObject({
                Bucket: process.env.ASSETS_BUCKET,
                Key: `${todoId}.png`
            }).promise()
        
            return this.s3.getSignedUrl('getObject', {
                Bucket: process.env.ASSETS_BUCKET,
                Key: `${todoId}.png`,
                Expires: this.expiration
            });
        } catch(err) {
            logger.error(`ATTACHMENT URL - ${err}`)
        }
        return null
    }

    getPresignedUrl(todoId: string): string {
        return this.s3.getSignedUrl('putObject', {
            Bucket: process.env.ASSETS_BUCKET,
            Key: `${todoId}.png`,
            Expires: this.expiration
        }) as string;
    }
}