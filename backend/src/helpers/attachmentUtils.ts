import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { createLogger } from '../utils/logger';
const XAWS = AWSXRay.captureAWS(AWS);

// TODO: Implement the fileStogare logic
const logger = createLogger('attachmentUtils');
const bucketName = process.env.ATTACHMENT_S3_BUCKET;
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION;
const s3_bucket = new XAWS.S3({
  signatureVersion: 'v4'
});

export async function createPresignUrl(todoId: string): Promise<string> {
  return s3_bucket.getSignedUrl("putObject", {
    Bucket: bucketName,
    Key: todoId,
    Expires: parseInt(signedUrlExpiration)
  });
}

export function createAttachmentUrl(todoId: string): string {
  return `https://${bucketName}.s3.amazonaws.com/${todoId}`;
}

export async function deleteAttachmentUrl(todoId: string) {
  const params = {
    Bucket: bucketName,
    Key: todoId
  };

  try {
    await s3_bucket.headObject(params).promise();
    try {
      return await s3_bucket.deleteObject(params).promise();
    }
    catch (e) {
      logger.error("Error occur when deleting S3 bucket object. Error: " + JSON.stringify(e));
    }
  } catch (e) {
    logger.error("Unable to retrieve S3 bucket object. Error: " + e.code);
  }
}