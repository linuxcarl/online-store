import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ProductsController } from './products.controller';
import { Product } from './models/product.entity';
import { ProductsService } from './models/product.service';
import { AdminModule } from './admin/admin.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Product]),
    AdminModule,
  ],
  controllers: [AppController, ProductsController],
  providers: [ProductsService],
})
export class AppModule {}
