import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ProductsController } from './products.controller';
import { Product } from './models/product.entity';
import { ProductsService } from './models/product.service';
@Module({
  imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Product])],
  controllers: [AppController, ProductsController],
  providers: [ProductsService],
})
export class AppModule {}
