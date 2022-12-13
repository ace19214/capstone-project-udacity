import 'source-map-support/register';

import * as middy from 'middy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { deleteTodo } from '../../businessLogic/todos';
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;
    // TODO: Remove a TODO item by id
    const userId = getUserId(event);
    try {
      await deleteTodo(userId, todoId);
      return {
        statusCode: 200,
        body: ""
      }
    } catch (e) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: e
        })
      }
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
