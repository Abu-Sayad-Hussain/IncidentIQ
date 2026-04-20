import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';
import { RegisterDto } from '@incident-iq/shared-types';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('auth/register')
  register(@Body() registerDto: RegisterDto) {
    // Send message to the auth microservice via TCP
    return this.authClient.send({ cmd: 'register' }, registerDto);
  }
}
