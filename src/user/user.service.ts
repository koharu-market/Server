import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from 'src/auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: LoginDto) {
    const newUser = await this.prismaService.customer.create({
      data: {
        ...dto,
      },
    });
    return newUser;
  }

  async findByEmail(email: string) {
    return await this.prismaService.customer.findUnique({
      where: {
        email: email,
      },
    });
  }

  async getAllUser() {
    return await this.prismaService.customer.findMany();
  }
}
