import { Body, Controller, Get, Post, UseGuards, Request, UnauthorizedException, Logger } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateCategoryDto, CreateProductDto, CreateProductOptionDto } from 'src/admin/dto/product.dto';
import { UserService } from 'src/user/user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('admin')
export class AdminController {
  private logger = new Logger('AdminController');

  constructor(
    private adminService: AdminService,
    private userService: UserService,
  ) {}

  private checkAdminRole(@Request() req) {
    if (req.user.role !== 'ADMIN') {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(JwtGuard)
  @Post('category')
  addCategory(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
    this.checkAdminRole(req);
    this.logger.verbose(`카테고리 ${createCategoryDto.name} 항목 생성`);
    return this.adminService.addCategory(createCategoryDto);
  }

  @UseGuards(JwtGuard)
  @Get('users')
  getAllUser(@Request() req) {
    this.checkAdminRole(req);
    return this.userService.getAllUser();
  }

  @UseGuards(JwtGuard)
  @Post('product')
  addProduct(@Body() createProductDto: CreateProductDto, @Request() req) {
    this.checkAdminRole(req);
    this.logger.verbose(`상품 ${createProductDto.name} 항목 생성`);
    return this.adminService.addProduct(createProductDto);
  }

  @UseGuards(JwtGuard)
  @Post('productOption')
  addProductOption(@Body() createProductOptionDto: CreateProductOptionDto[], @Request() req) {
    this.checkAdminRole(req);
    this.logger.verbose('상품 옵션 생성');
    return this.adminService.addProductOption(createProductOptionDto);
  }
}
