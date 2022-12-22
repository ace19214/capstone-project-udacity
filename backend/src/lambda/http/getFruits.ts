import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { getAllFruit} from '../../businessLogic/fruits';
import { getJwtToken } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const jwtToken = await getJwtToken(event);
    const Fruits = await getAllFruit(jwtToken);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        "items": Fruits
      })
    }

  }
)
