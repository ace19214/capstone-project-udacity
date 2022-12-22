import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { getJwtToken } from '../utils'
import { deleteFruit } from '../../businessLogic/fruits'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const fruitId = event.pathParameters.fruitId
    const jwtToken = await getJwtToken(event);

    const deleteData = await deleteFruit(fruitId, jwtToken);
    
    return {
      statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: deleteData,
    }
  }
)
