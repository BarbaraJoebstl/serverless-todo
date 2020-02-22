import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as AWS from 'aws-sdk'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event ', event)

  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const params = {
    TableName: todosTable,
    Key: { 
      todoId: todoId,
      userId: userId
    },
    ExpressionAttributeValues: {
      name: updatedTodo.name,
      dueDate: updatedTodo.dueDate,
      done: updatedTodo.done
    }
  }

  const result = await docClient.update(params).promise()
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      result
    })
  }
}
