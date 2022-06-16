import { Module, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './models/users.service';
import { OrderService } from './models/orders.service';
import { Product } from './models/product.entity';
import { User } from './models/user.entity';
import { Order } from './models/order.entity';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { ProductsService } from './models/product.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Product, User, Order]),
    AdminModule,
    AuthModule,
    CartModule,
  ],
  controllers: [AppController, ProductsController],
  providers: [ProductsService, UsersService, OrderService],
  exports: [ProductsService, UsersService, OrderService],
})
export class AppModule {}
