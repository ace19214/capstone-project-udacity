import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';

const logger = createLogger('todos-access');
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async getUserTodos(userId: string): Promise<TodoItem[]> {
    logger.info(`Getting todos list for user with id: ${userId}`);

    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId
      }
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    logger.info(`Create new todo for user with id: ${todoItem.userId}`);

    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise();
    return todoItem;
  }

  async getTodoForUserById(userId: string, todoId: string): Promise<TodoItem> {
    logger.info(`Get todo for user with id: ${userId} by todo id: ${todoId}`);
    const resultSet = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: "userId = :userId AND todoId = :todoId",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":todoId": todoId
      }
    }).promise();
    const item = resultSet.Items;
    return item[0] as TodoItem;
  }

  async updateTodo(todoItem: TodoUpdate, userId: string, todoId: string) {
    const current = this.getTodoForUserById(userId, todoId);

    if (!current) {
      throw new Error(`Cannot find todo by id ${todoId} for user with id ${userId}`);
    }

    logger.info(`Update todo by id ${todoId} for user with id ${userId}`);
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: "SET #name = :name, #dueDate = :dueDate, #done = :done",
      ExpressionAttributeNames: {
        "#name": "name",
        "#dueDate": "dueDate",
        "#done": "done"
      },
      ExpressionAttributeValues: {
        ":name": todoItem.name,
        ":dueDate": todoItem.dueDate,
        ":done": todoItem.done
      }
    }).promise();
  }

  async deleteTodo(userId: string, todoId: string) {
    logger.info(`Delete todo with id: ${todoId} of user with id: ${userId}`);
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      }
    }).promise();
  }

  async updatePresignedUrlForTodo(attachmentUrl: string, userId: string, todoId: string) {
    const currentTodo = this.getTodoForUserById(userId, todoId);
    if (!currentTodo) {
      throw new Error(`Cannot find todo by id ${todoId} for user with id ${userId}`);
    }

    logger.info(`Update presigned url for todo by id ${todoId} for user with id ${userId}`);
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
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
}