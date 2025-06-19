import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController, RemoveTaskController, TaskController, TodoController, ToggleController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './logger.middleware';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
    exclude: ['/'],
  }),],
  controllers: [AuthController, TodoController, TaskController, ToggleController, RemoveTaskController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
