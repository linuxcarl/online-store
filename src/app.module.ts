import { Module, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './models/users.service';
import { Product } from './models/product.entity';
import { User } from './models/user.entity';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ProductsService } from './models/product.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Product, User]),
    AdminModule,
    AuthModule,
  ],
  controllers: [AppController, ProductsController],
  providers: [ProductsService, UsersService],
  exports: [ProductsService, UsersService],
})
export class AppModule {}
