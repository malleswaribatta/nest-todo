import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './app.controller';
import { AppService } from './app.service';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AppService],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(authController.getLogin()).toBe('Hello World!');
    });
  });
});
