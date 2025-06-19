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

// @Injectable()
// export class Authentication implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     const path = req.cookies ? '/todo' : '/login';
//     // console.log('redirect>>', path);
//     // res.status(303).redirect(path);
//     next();
//   }
// }
