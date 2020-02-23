import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { ApiResponse } from '../../utils/api-response'
import { createLogger } from '../../utils/logger'
import { getAllTodosForUser } from '../../business/todos'

const logger = createLogger('todos')
const apiResponse = new ApiResponse()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): 
Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  logger.info(`GET - all todos for ${userId}`)
  const allTodosForUser = await getAllTodosForUser(userId)
  return apiResponse.successResponse(200, 'items', allTodosForUser)
}