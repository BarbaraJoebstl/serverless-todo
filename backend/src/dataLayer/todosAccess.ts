import { TodoItem } from '../models/TodoItem';
import * as uuid from 'uuid';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';


/**
 * to enable tracing make sure it is also set in the serverless.yaml
 * for more info see: 
 * https://serverless-stack.com/chapters/tracing-serverless-apps-with-x-ray.html
 */
const AWSXRay = require('aws-xray-sdk')
const s3BucketName = process.env.ASSETS_BUCKET

let docClient: DocumentClient;
docClient = new DocumentClient();

AWSXRay.captureAWSClient((docClient as any).service);

export class TodosAccess {
    constructor(
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly userIndex = process.env.USER_INDEX
    ){ }

    async getAllTodosForUser(userId: string): Promise<TodoItem[]> {
        const allTodosForUser = await docClient.query({
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
      
        await docClient.put({
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

        await docClient.delete(deleteParams).promise()
    }

    async getTodoById(todoId: string) {
        return await docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'todoId = :todoId',
            ExpressionAttributeValues: {
                ':todoId': todoId
            }
        }).promise()

    }

    async updateTodo(todoId: string, updatedTodo: UpdateTodoRequest) {
        await docClient.update({
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

    async addAttachmentUrl(todoId: string){
        await docClient.update({
            TableName: this.todosTable,
            Key: { 'todoId': todoId },
            UpdateExpression: 'set #attachmentUrl = :a',
            ExpressionAttributeValues: {
                ':a': `https://www.${s3BucketName}.s3.eu-central-1.amazonaws.com/${todoId}.png`
            },
            ExpressionAttributeNames: {
                '#attachmentUrl': 'attachmentUrl'
            }

        }).promise()
    } 
}
