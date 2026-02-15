import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwtStrategy';
import { PrismaModule } from 'prisma/prisma.module';
@Module({
  controllers: [AuthController],
  imports:[
    JwtModule.register({
      secret: 'SUPER_SECRET_KEY', 
      signOptions: { expiresIn: '1h' },
    }),
    PrismaModule
  ],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
