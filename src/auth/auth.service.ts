import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import { JwtPayload } from './types/jwtPayload.type';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    let user = await this.prismaService.customer.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      user = await this.userService.create(dto);
    }

    const admin = await this.prismaService.admin.findUnique({
      where: {
        email: dto.email,
      },
    });

    const payload: JwtPayload = {
      id: user.customerId,
      email: user.email,
      name: user.name,
      role: admin ? 'admin' : 'user',
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET_KEY!,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_TOKEN_KEY!,
      }),
      role: admin ? 'admin' : 'user',
    };
  }

  async refreshToken(refreshToken: string) {
    // Verify refresh token
    // JWT Refresh Token 검증 로직
    const decodedRefreshToken = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_TOKEN_KEY! });

    const { id, email, name, role } = decodedRefreshToken;

    const payload: JwtPayload = {
      id,
      email,
      name,
      role,
    };

    if (payload) {
      return {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '1h',
          secret: process.env.JWT_SECRET_KEY!,
        }),
      };
    }

    throw new UnauthorizedException();
  }
}
