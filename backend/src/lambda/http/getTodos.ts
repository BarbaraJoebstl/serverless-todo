import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { getAllTodosForUser } from '../../business/todos'

const logger = createLogger('todos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): 
Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  logger.info(`GET - all todos for ${userId}`)
  const allTodosForUser = await getAllTodosForUser(userId)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ allTodosForUser })
  }
}