import { Injectable, NotFoundException, Res } from '@nestjs/common';
import type { Task, Todo, User, UserSessionDetails } from './types';
import { Response, Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import * as _ from 'lodash';
import { CLIENT_RENEG_LIMIT } from 'tls';

export const counter = () => {
  let i = 1;
  return () => (i += 1);
};

@Injectable()
export class AppService {
  userSessionDetails: UserSessionDetails = {};
  allUsers: User[] = [];
  counterGen = counter();

  storeUsername(username): string {
    const sessionId = this.counterGen().toString();
    this.userSessionDetails[sessionId] = username;
    this.allUsers.push({ username, todos: [] });

    return sessionId;
  }

  getUsername(req: Request) {
    return req.cookies.username;
  }

  getAllUsers() {
    return this.allUsers;
  }

  createTodoFromRequest({ todo }): Todo {
    const todoId = this.counterGen().toString();
    return {
      todoId: todoId,
      todo,
      tasks: [],
    };
  }

  createTaskFromRequest({ task }): Task {
    const taskId = this.counterGen().toString();

    return { id: taskId, task, done: false };
  }

  getMatchedTodos(req: Request): User | undefined {
    const username = this.getUsername(req);
    const matchedUserTodo = _.find(this.allUsers, { username });

    return matchedUserTodo;
  }

  serveToggleHandler(req, todoId: string, taskId: string): Task {
    const userTodo = this.getMatchedTodos(req);
    const matchedTodo = _.find(userTodo?.todos, { todoId });
    const matchedTask = _.find(matchedTodo?.tasks, { id: taskId });

    if (!matchedTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    matchedTask.done = !matchedTask.done;
    return matchedTask;
  }

  serveTaskHandler(data: any, req, todoId: string): Task {
    const parsedTask = this.createTaskFromRequest(data);
    const userTodo = this.getMatchedTodos(req);
    const matchedTodo = _.find(userTodo?.todos, { todoId });

    matchedTodo?.tasks.push(parsedTask);
    return parsedTask;
  }

  storeTodoHandler(data: any, req): Todo {
    const todoList = this.createTodoFromRequest(data);
    const matchedTodo = this.getMatchedTodos(req);

    matchedTodo?.todos.push(todoList);
    return todoList;
  }

  removeTaskHandler(todoId: string, taskId: string, req: Request) {
    const userTodo = this.getMatchedTodos(req);
    const machedTodo = _.find(userTodo?.todos, { todoId });

    if (machedTodo && Array.isArray(machedTodo.tasks)) {
      _.remove(
        machedTodo.tasks as ArrayLike<Task>,
        (task: Task) => task.id === taskId,
      );
    }
  }

  removeTodoHandler(todoId: string, req: Request) {
    const userTodo = this.getMatchedTodos(req);

    _.remove(userTodo?.todos as ArrayLike<Todo>, { todoId: todoId });
  }
}
