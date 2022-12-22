import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils/logger';
import { FruitItem } from '../models/FruitItem';
import { FruitUpdate } from '../models/FruitUpdate';
import { Types } from 'aws-sdk/clients/s3';

const logger = createLogger('FruitAccess')
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

export class FruitAccess{
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly fruitTable = process.env.FRUIT_TABLE,
        private readonly s3Client: Types = new AWS.S3({signatureVersion: 'v4'}),
        private readonly s3BucketName = process.env.S3_BUCKET_NAME
    ){}
    async getAllFruit(userId: string): Promise<FruitItem[]> { 
        logger.info(`Get all fruits with userId ${userId}`)
        const params = {
            TableName: this.fruitTable,
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeNames: {
                "#userId": "userId"
            },
            ExpressionAttributeValues: {
                ":userId": userId
            }
        };

        const result = await this.docClient.query(params).promise();
        console.log(result);
        const items = result.Items;

        return items as FruitItem[];
    }

    async createFruit(fruitItem: FruitItem){
        logger.info(`Create new fruit for user with id: ${fruitItem.userId}`)
        const params = {
            TableName: this.fruitTable,
            Item: fruitItem,
        };

        const result = await this.docClient.put(params).promise();
        console.log(result);

        return fruitItem as FruitItem;
    }

    async updateFruit(fruitUpdate: FruitUpdate, fruitId: string, userId: string): Promise<FruitUpdate> {
    
        const params = {
            TableName: this.fruitTable,
            Key: {
                "userId": userId,
                "fruitId": fruitId
            },
            UpdateExpression: "set #a = :a, #b = :b, #c = :c",
            ExpressionAttributeNames: {
                "#a": "name",
                "#b": "dueDate",
                "#c": "done"
            },
            ExpressionAttributeValues: {
                ":a": fruitUpdate['name'],
                ":b": fruitUpdate['dueDate'],
                ":c": fruitUpdate['done']
            },
            ReturnValues: "ALL_NEW"
        };

        const result = await this.docClient.update(params).promise();
        logger.info(`Update result: ${result}`)
        const attributes = result.Attributes;

        return attributes as FruitUpdate;
    }

    async deleteFruit(fruitId: string, userId: string): Promise<string> {
        logger.info("Deleting fruit with id: ${fruitId} of user with userId: ${userId}");

        const params = {
            TableName: this.fruitTable,
            Key: {
                "userId": userId,
                "fruitId": fruitId
            },
        };

        const result = await this.docClient.delete(params).promise();
        logger.info(`Result: ${result}`)
        

        return "" as string;
    }

    async generateUploadUrl(fruitId: string): Promise<string> {
        logger.info(`Generating url...`)

        const url = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3BucketName,
            Key: fruitId,
            Expires: 1000,
        });
        logger.info(`Result url: ${url}`)

        return url as string;
    }
}