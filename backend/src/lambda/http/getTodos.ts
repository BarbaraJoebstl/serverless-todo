import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const userIndex = process.env.USER_INDEX

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event ', event)

  const userId = getUserId(event)

  const allTodosForUser = await docClient.query({
    TableName: todosTable,
    IndexName: userIndex,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId':userId
    }
  }).promise()

  const todoList = allTodosForUser.Items

  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin':'*'},
    body: JSON.stringify({
      todoList
    })
  }

}

