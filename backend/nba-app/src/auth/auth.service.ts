import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private users: { id: number, email: string; passwordHash: string }[] = [];

  constructor(private jwtService: JwtService) {
    // usuario hardcodeado para pruebas
    const hash = bcrypt.hashSync('123456', 10);

    this.users.push({
        id: 1,
      email: 'test@mail.com',
      passwordHash: hash,
    });
  }

  async login(email: string, password: string) {
    const user = this.users.find(u => u.email === email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
