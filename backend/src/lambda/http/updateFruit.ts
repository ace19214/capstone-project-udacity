import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { updateFruit } from '../../businessLogic/fruits'
import { UpdateFruitRequest } from '../../requests/UpdateFruitRequest'
import { getJwtToken } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const fruitId = event.pathParameters.fruitId
    const updatedFruit: UpdateFruitRequest = JSON.parse(event.body)
    const jwtToken = await getJwtToken(event);

    const fruitItem = await updateFruit(updatedFruit, fruitId, jwtToken)

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        "item": fruitItem
      }),
    }
  }
)
