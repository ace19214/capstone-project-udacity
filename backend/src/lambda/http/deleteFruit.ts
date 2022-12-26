import 'source-map-support/register';
import * as middy from 'middy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteFruit } from '../../businessLogic/fruits';
import { getUserId } from '../utils';
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const fruitId = event.pathParameters.fruitId;
    const userId = getUserId(event);
      await deleteFruit(userId, fruitId);
      return {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        statusCode: 200,
        body: ""
      }
  });

    