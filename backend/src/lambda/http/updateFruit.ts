import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { updateFruit } from '../../businessLogic/fruits';
import { UpdateFruitRequest } from '../../requests/UpdateFruitRequest';
import { getUserId } from '../utils';
import * as middy from 'middy';
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const fruitId = event.pathParameters.fruitId;
    const updatedFruit: UpdateFruitRequest = JSON.parse(event.body);
    const userId = getUserId(event);
    await updateFruit(updatedFruit, userId, fruitId);
      return {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        statusCode: 202,
        body: ""
      };
  });