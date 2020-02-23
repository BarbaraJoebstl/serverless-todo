import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { ApiResponse } from '../../utils/api-response'
import { createLogger } from '../../utils/logger'
import { TodosAccess } from '../../dataLayer/todosAccess'

const logger = createLogger('todos')
const apiResponse = new ApiResponse()
const todosAccess = new TodosAccess()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const todoId = event.pathParameters.todoId
  const todo = await todosAccess.getTodoById(todoId)

  if(!todo) {
    logger.error('UPDATE ERROR - no todo with id ${todoId} found')
    return apiResponse.errorResponse(400, 'no todo with id ${todoId} found')
  }
  
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  logger.info('UPDATE - item ${todoId} for user ${userId}')
  await todosAccess.updateTodo(todoId, updatedTodo)
  return apiResponse.emptySuccessResponse()
}
