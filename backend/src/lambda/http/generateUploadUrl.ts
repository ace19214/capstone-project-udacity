import 'source-map-support/register';
import * as middy from 'middy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { generateUrl, updateUrlForFruit } from '../../businessLogic/fruits';
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const fruitId = event.pathParameters.fruitId;
    const userId = getUserId(event);
    const uploadUrl = await generateUrl(fruitId);
    await updateUrlForFruit(userId, fruitId);
      return {
        statusCode: 202,
        headers: {
        "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          uploadUrl
        })
      };
  });
  
