import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/request/loginDto';

@Injectable()
export class AuthService {
  async login(loginDto: LoginDto) {
    return { username: loginDto.username };
  }
}
