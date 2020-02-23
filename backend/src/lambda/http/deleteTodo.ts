import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { TodosAccess } from '../../dataLayer/todosAccess'
import { ApiResponse } from '../../utils/api-response'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todos')
const apiResponse = new ApiResponse()
const todosAccess = new TodosAccess()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  if (!todoId){
    logger.error('ERROR DELETE - can t delete object with missing id')
    return apiResponse.errorResponse(404, 'no id to delete')
  }

  const userId = getUserId(event)
  const selectedTodo = await todosAccess.getTodoById(todoId)
  if(!selectedTodo) {
    logger.error('ERROR DELETE - no item found with that id')
    return apiResponse.errorResponse(404, 'no item found with that id')
  }

  logger.info(`DELETE Todo ${todoId} for user ${userId}`)
  await todosAccess.deleteTodo(todoId)
  return apiResponse.emptySuccessResponse()
}
