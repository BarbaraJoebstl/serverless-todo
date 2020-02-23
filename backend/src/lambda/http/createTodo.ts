import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { getUserId } from '../utils'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodosAccess } from '../../dataLayer/todosAccess'
import { ApiResponse } from '../../utils/api-response'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todos')
const apiResponse = new ApiResponse()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  const todo: CreateTodoRequest = JSON.parse(event.body)
  
  logger.info(`CREATE - new item for ${userId}`)
  const createdTodo = await new TodosAccess().createTodo(todo, userId);
  return apiResponse.successResponse(201, 'item', createdTodo)
}

