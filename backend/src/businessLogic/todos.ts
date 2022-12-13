import { TodoAccess } from "../dataLayer/todoAccess";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { createAttachmentUrl, createPresignUrl, deleteAttachmentUrl } from "../helpers/attachmentUtils";

import * as uuid from 'uuid';

const toDoAccess = new TodoAccess();

export async function getTodosForUser(userId: string) {
  return await toDoAccess.getUserTodos(userId);
}

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string) {
  const todoId = uuid.v4();
  const createdAt = new Date().toISOString();
  return await toDoAccess.createTodo({
    userId: userId,
    todoId: todoId,
    createdAt: createdAt,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false
  });
}

export async function updateTodo(updateTodoRequest: UpdateTodoRequest, userId: string, todoId: string) {
  return await toDoAccess.updateTodo({
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
  }, userId, todoId);
}

export async function deleteTodo(userId: string, todoId: string) {
  // delete bucket object if exist
  const currentTodo = await toDoAccess.getTodoForUserById(userId, todoId);
  const attachmentUrl = currentTodo.attachmentUrl;
  if (attachmentUrl) {
    await deleteAttachmentUrl(todoId);
  }
  return await toDoAccess.deleteTodo(userId, todoId);
}

export async function createAttachmentPresignedUrl(todoId: string) {
  return await createPresignUrl(todoId);
}

export async function updatePresignedUrlForTodo(userId: string, todoId: string) {
  const attachmentUrl = createAttachmentUrl(todoId);
  return await toDoAccess.updatePresignedUrlForTodo(attachmentUrl, userId, todoId);
}