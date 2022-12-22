import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { CreateFruitRequest } from '../../requests/CreateFruitRequest'
import { getJwtToken } from '../utils';
import { createFruit } from '../../businessLogic/fruits'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newFruit: CreateFruitRequest = JSON.parse(event.body)
    const jwtToken = await getJwtToken(event)
    const newItem = await createFruit(newFruit, jwtToken)

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({item: newItem})
    }
  }
)
