import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController, TodoController } from './app.controller';
import { AppService } from './app.service';
import { Authentication, LoggerMiddleware, Login } from './logger.middleware';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AuthController, TodoController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Authentication).forRoutes('/todo');
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(Login).forRoutes('/login');
  }
}
