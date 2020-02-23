import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { TodosAccess } from '../../dataLayer/todosAccess'
import { ApiResponse } from '../../utils/api-response'
import { createLogger } from '../../utils/logger'
import { S3Helper } from '../../utils/s3-helper'

const todosAccess = new TodosAccess()
const apiResponse = new ApiResponse()
const logger = createLogger('todos')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const todo = await todosAccess.getTodoById(todoId)

  if(!todo) {
    logger.error(`ADD ATTACHEMENT ERROR - there is no todo item`)
    return apiResponse.errorResponse(400, 'no existing todo')
  }

  const url = new S3Helper().getPresignedUrl(todoId)

  return {
    statusCode: 200,
    headers: {'Access-Control-Allow-Origin':'*'},
    body: JSON.stringify({ 
      'uploadUrl': url
    })
  }

}
