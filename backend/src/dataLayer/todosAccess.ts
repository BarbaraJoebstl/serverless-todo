import { TodoItem } from '../models/TodoItem';
import * as uuid from 'uuid';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const AWSXRay = require('aws-xray-sdk')

export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly userIndex = process.env.USER_INDEX
    ){ }

    async getAllTodosForUser(userId: string): Promise<TodoItem[]> {
        const allTodosForUser = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.userIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
            ':userId':userId
            }
        }).promise()

        return allTodosForUser.Items as TodoItem[]
    }

    async createTodo(newTodoData: CreateTodoRequest, userId: string): Promise<TodoItem> {
        const todoId = uuid.v4()
        
        const newTodo: TodoItem = {
          todoId: todoId,
          userId: userId,
          done: false,
          createdAt: Date.now().toString(),
          ...newTodoData
        }
      
        await this.docClient.put({
          TableName: this.todosTable,
          Item: newTodo
        }).promise()

        return newTodo
    }

    async deleteTodo(todoId: string) {
        const deleteParams = {
            TableName: this.todosTable,
            Key: {
                "todoId": todoId
            }
        }

        await this.docClient.delete(deleteParams).promise()
    }

    async getTodoById(todoId: string) {
        return await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'todoId = :todoId',
            ExpressionAttributeValues: {
                ':todoId': todoId
            }
        }).promise()

    }

    async updateTodo(todoId: string, updatedTodo: UpdateTodoRequest) {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: { 'todoId': todoId },
            UpdateExpression: 'set #namefield = :n, dueDate = :d, done = :done',
            ExpressionAttributeValues: {
                ':n': updatedTodo.name,
                ':d': updatedTodo.dueDate,
                ':done': updatedTodo.done
            },
            ExpressionAttributeNames: {
                '#namefield': 'name'
            }
        }).promise()
    }

}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new AWSXRay.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new AWSXRay.DynamoDB.DocumentClient()
  }