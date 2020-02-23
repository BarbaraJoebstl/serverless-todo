import { TodosAccess } from '../dataLayer/todosAccess';
import { TodoItem } from '../models/TodoItem';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const todosAccess = new TodosAccess()

export async function getAllTodosForUser(userId: string): Promise<TodoItem[]> {
    return todosAccess.getAllTodosForUser(userId)
}

export async function updateTodo(todoId: string, updateTodo: UpdateTodoRequest): Promise<void> {
    return todosAccess.updateTodo(todoId, updateTodo);
}