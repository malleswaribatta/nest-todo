import { Injectable, NotFoundException, Res } from '@nestjs/common';
import { Task, Todo, User, UserSessionDetails } from './types';
import { Response, Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import _ from 'lodash';

export const counter = () => {
  let i = 1;
  return () => i += 1;
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
    return Object.keys(req.cookies)[0];
  }

  getAllUsers() {
    return this.allUsers;
  }

  createTodoFromRequest({ todo }): Todo {
    const todoId = this.counterGen().toString();
    console.log("todo>>>", todo)
    return {
      todoId: todoId,
      todo,
      tasks: [],
    };
  }

  createTaskFromRequest({ task }): Task {
    const taskId = this.counterGen().toString();

    return { id: taskId, task, done: false };
  };

  getMatchedTodos(req: Request): User | undefined {
    const username = this.getUsername(req);
    const allUsersTodos = this.getAllUsers();
    const matchedUserTodo = _.find(allUsersTodos, { username });

    return matchedUserTodo;
  }


  serveToggleHandler(req, todoId: string, taskId: string): Task {
    const userTodo = this.getMatchedTodos(req);
    const matchedTodo = _.find(userTodo?.todos, { todoId });
    const matchedTask = _.find(matchedTodo?.tasks, { id: taskId });
    console.log("machedTask----->>>", matchedTask, taskId, todoId, matchedTodo);

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
    const tasks: Task[] = _.find(userTodo?.todos, { todoId: todoId })?.tasks ?? [];
    // console.log(userTodo, "machedTodo>>", matchedTodo, "------>>", matchedTodo?.tasks, "taskId", taskId);

    // if (matchedTodo?.tasks) {
    // _.remove(tasks, (task: Task) => task.id === taskId);
    //   return;
    // }

    tasks.filter((task: Task) => task.id !== taskId);



    console.warn("No tasks found to remove from");

  }
}
