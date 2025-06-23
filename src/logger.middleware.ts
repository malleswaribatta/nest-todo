import { Body, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const url = req.originalUrl;
    console.log(`url ${url} ${req.method}`);
    next();
  }
}

@Injectable()
export class Login implements NestMiddleware {
  use(@Body() data: any, res: Response, next: NextFunction) {
    const { username } = data.body;
    res.cookie('username', username);
    next();
  }
}

@Injectable()
export class Logout implements NestMiddleware {
  use(res: Response, next: NextFunction) {
    res.clearCookie('username');
    next();
  }
}

@Injectable()
export class Authentication implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('inside moddleware');
    const username = req.cookies.username;
    // const path = req.cookies.username ? '/todo' : '/login.html';
    // console.log(req.cookies, 'redirect>>', path);

    // res.status(303).redirect(path);

    if (req.path === '/login.html' && username) {
      return res.redirect('/todo');
    }

    // If not logged in and accessing protected routes (like /todo), redirect to login
    if (req.path === '/todo' && !username) {
      return res.redirect('/login.html');
    }

    next();
  }
}
