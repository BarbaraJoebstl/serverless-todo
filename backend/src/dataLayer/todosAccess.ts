import { TodoItem } from '../models/TodoItem';
import * as uuid from 'uuid';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import * as AWS  from 'aws-sdk'

export class TodosAccess {
    constructor(
        private readonly docClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.GROUPS_TABLE,
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

    async deleteTodo(todoId: string){
        const deleteParams = {
            TableName: this.todosTable,
            Key: {
                "todoId": todoId
            }
        }

        await this.docClient.delete(deleteParams).promise()
    }

    async getTodoById(todoId: string){
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
        }).promise
    }

}
