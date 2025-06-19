import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { join } from 'path';
import * as _ from 'lodash';
import { Task, Todo } from './types';

//store username and serve index page
@Controller()
export class AuthController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getLogin(@Res() res: Response) {
    return res.sendFile(join(__dirname, '..', 'public', 'login.html'));
  }

  private serveCookie(username: string, res: Response) {
    // res.cookie(username, sessionId);

    return res.redirect(303, '/index.html');
  }

  @Post('/login')
  serveLogin(@Body() data, @Res() res: Response) {
    const { username } = data;
    const sessionId = this.appService.storeUsername(username);

    return this.serveCookie(username, res);
  }

  @Get('/username')
  serveUsername(@Req() req: Request, @Res() res: Response) {
    const username = this.appService.getUsername(req);

    return res.status(200).json(username);
  }

  @Post('/logout')
  serveLogout(@Res() res: Response) {
    return res.status(303).redirect('/login.html');
  }
}

@Controller('/todo')
export class TodoController {
  constructor(private readonly appService: AppService) {}

  @Get()
  serveTodo(@Req() req: Request, @Res() res: Response) {
    const matchedTodo = this.appService.getMatchedTodos(req);
    const todo = matchedTodo?.todos;
    const username = this.appService.getUsername(req);
    if (!todo) {
      return;
    }

    return res.status(200).json({ todo, username });
  }

  @Post()
  storeTodo(@Body() data, @Req() req: Request, @Res() res: Response) {
    const todoList = this.appService.storeTodoHandler(data, req);

    return res.status(201).json(todoList);
  }

  @Post('/:todoId/task')
  storeTask(
    @Body() data,
    @Req() req: Request,
    @Param('todoId') todoId: string,
    @Res() res: Response,
  ) {
    const parsedTask = this.appService.serveTaskHandler(data, req, todoId);

    return res.status(201).json(parsedTask);
  }

  @Patch('/:todoId/task/:taskId/toggle-status')
  serveToggle(
    @Param('todoId') todoId: string,
    @Param('taskId') taskId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const matchedTask = this.appService.serveToggleHandler(req, todoId, taskId);

    return res.status(200).json(matchedTask);
  }

  @Delete('/:todoId/task/:taskId/remove-task')
  removeTask(
    @Param('todoId') todoId: string,
    @Param('taskId') taskId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.appService.removeTaskHandler(todoId, taskId, req);

    return res.status(200).json({ message: 'Task removed successfully' });
  }

  @Delete('/:todoId/remove-todo')
  removeTodo(@Param('todoId') todoId: string, @Req() req: Request) {
    this.appService.removeTodoHandler(todoId, req);
  }
}
