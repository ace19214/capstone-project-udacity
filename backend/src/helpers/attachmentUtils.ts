import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { createLogger } from '../utils/logger';
const XAWS = AWSXRay.captureAWS(AWS);

// Fruit: Implement the fileStogare logic
const logger = createLogger('attachmentUtils');
const bucketName = process.env.S3_BUCKET_NAME;
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION;
const s3Client = new XAWS.S3({
  signatureVersion: 'v4'
});

export function createUrl(fruitId: string): string {
  return `https://${bucketName}.s3.amazonaws.com/${fruitId}`;
}

export async function generateUploadUrl(fruitId: string): Promise<string> {
  logger.info(`Generating url`)
  return s3Client.getSignedUrl("putObject", {
    Bucket: bucketName,
    Key: fruitId,
    Expires: parseInt(signedUrlExpiration)
  });
}

export async function deleteUrl(fruitId: string) {
  const params = {
    Bucket: bucketName,
    Key: fruitId
  };
  return await s3Client.deleteObject(params).promise();
}