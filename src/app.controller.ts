import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { join } from 'path';
import * as _ from 'lodash';
import { Task, Todo } from './types';


//store username and serve index page
@Controller()
export class AuthController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getLogin(@Res() res: Response) {
    return res.sendFile(join(__dirname, '..', 'public', 'login.html'));
  }

  private serveCookie(username: string, sessionId: string, res: Response) {

    res.cookie(username, sessionId)

    return res.redirect(303, '/index.html');
  }

  @Post('/login')
  serveLogin(@Body() data, @Res() res: Response) {
    const { username } = data;
    const sessionId = this.appService.storeUsername(username);

    return this.serveCookie(username, sessionId, res);
  }

  @Get('/username')
  serveUsername(@Req() req: Request) {
    const username = this.appService.getUsername(req);

    return { username }
  }
}

@Controller('/todo')
export class TodoController {
  constructor(private readonly appService: AppService) { }

  @Get()
  serveTodo(@Req() req: Request, @Res() res: Response) {
    const matchedTodo = this.appService.getMatchedTodos(req)
    const todo = matchedTodo?.todos;

    return res.status(200).json(todo);
  }

  @Post()
  storeTodo(@Body() data, @Req() req: Request, @Res() res: Response) {
    const todoList = this.appService.storeTodoHandler(data, req);

    return res.status(201).json(todoList);
  }
}

@Controller('/todo/:todoId/task')
export class TaskController {
  constructor(private readonly appService: AppService) { }

  @Post()
  storeTask(@Body() data, @Req() req: Request, @Param("todoId") todoId: string, @Res() res: Response) {
    const parsedTask = this.appService.serveTaskHandler(data, req, todoId);

    return res.status(201).json(parsedTask)
  }
}

@Controller('/todo/:todoId/task/:taskId/toggle-status')
export class ToggleController {
  constructor(private readonly appService: AppService) { }

  @Patch()
  serveToggle(@Param("todoId") todoId: string, @Param("taskId") taskId: string, @Req() req: Request, @Res() res: Response) {
    const matchedTask = this.appService.serveToggleHandler(req, todoId, taskId);

    return res.status(200).json(matchedTask);
  }
}

//solve error
//write test cases

@Controller('/todo/:todoId/task/:taskId/remove-task')
export class RemoveTaskController {
  constructor(private readonly appService: AppService) { }

  @Delete()
  removeTask(@Param("todoId") todoId: string, @Param("taskId") taskId: string, @Req() req: Request, @Res() res: Response) {
    // const userTodo = this.appService.getMatchedTodos(req);
    // const matchedTodo = _.find(userTodo?.todos, { todoId: todoId });
    // console.log(userTodo, "machedTodo>>", matchedTodo, "------>>", matchedTodo?.tasks, "taskId", taskId);
    // //     {
    // //   todoId: '3',
    // //   todo: 'dsads',
    // //   tasks: [ { id: '4', task: 'car', done: false } ]
    // // }
    // if (!matchedTodo?.tasks) {
    //   console.warn("No tasks found to remove from");
    //   return;
    // }

    // const a = matchedTodo.tasks;

    // // _.remove(matchedTodo.tasks, { id: taskId });
    this.appService.removeTaskHandler(todoId, taskId, req);

    return res.status(200).json({ message: "Task removed successfully" });
  }
}
