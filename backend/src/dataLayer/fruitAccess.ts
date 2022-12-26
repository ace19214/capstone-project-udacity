import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { FruitItem } from '../models/FruitItem';
import { FruitUpdate } from '../models/FruitUpdate';

const logger = createLogger('Fruits-access');
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

export class FruitAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly fruitsTable = process.env.FRUITS_TABLE) {
  }

  async getAllFruits(userId: string): Promise<FruitItem[]> {
    logger.info(`Get all fruits for user with id: ${userId}`);
    const params = {
      TableName: this.fruitsTable,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
          ":userId": userId
      }
  };
    const result = await this.docClient.query(params).promise();
    const items = result.Items
    return items as FruitItem[]
  }

  async createFruit(fruitItem: FruitItem): Promise<FruitItem> {
    logger.info(`Create new Fruit for user with id: ${fruitItem.userId}`);
    const params = {
      TableName: this.fruitsTable,
      Item: fruitItem
    };
    await this.docClient.put(params).promise();
    return fruitItem;
  }

  async getFruitForUserById(userId: string, fruitId: string): Promise<FruitItem> {
    logger.info(`Get Fruit for user with id: ${userId} by fruit id: ${fruitId}`);
    const resultSet = await this.docClient.query({
      TableName: this.fruitsTable,
      KeyConditionExpression: "userId = :userId AND fruitId = :fruitId",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":fruitId": fruitId
      }
    }).promise();
    const item = resultSet.Items;
    return item[0] as FruitItem;
  }

  async updateFruit(fruitItem: FruitUpdate, userId: string, fruitId: string) {
    await this.docClient.update({
      TableName: this.fruitsTable,
      Key: {
        userId,
        fruitId
      },
      UpdateExpression: "SET #name = :name, #dueDate = :dueDate, #done = :done",
      ExpressionAttributeNames: {
        "#name": "name",
        "#dueDate": "dueDate",
        "#done": "done"
      },
      ExpressionAttributeValues: {
        ":name": fruitItem.name,
        ":dueDate": fruitItem.dueDate,
        ":done": fruitItem.done
      }
    }).promise();
  }

  async updateUrlForFruit(attachmentUrl: string, userId: string, fruitId: string) {
    await this.docClient.update({
      TableName: this.fruitsTable,
      Key: {
        userId,
        fruitId
      },
      UpdateExpression: "SET #attachmentUrl = :attachmentUrl",
      ExpressionAttributeNames: {
        "#attachmentUrl": "attachmentUrl"
      },
      ExpressionAttributeValues: {
        ":attachmentUrl": attachmentUrl
      }
    }).promise();
  }

  async deleteFruit(userId: string, fruitId: string) {
    logger.info(`Deleting Fruit with id: ${fruitId} of user with id: ${userId}`);
    await this.docClient.delete({
      TableName: this.fruitsTable,
      Key: {
        userId,
        fruitId
      }
    }).promise();
  }
}