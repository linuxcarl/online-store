import { Controller, Get, Render, Post, Redirect, Body } from '@nestjs/common';
import { ProductsService } from '../models/product.service';
import { Product } from '../models/product.entity';
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get('/')
  @Render('admin/products/index')
  async index() {
    const viewData = [];
    viewData['title'] = 'Admin Products - Admin online store';
    viewData['products'] = await this.productService.findAll();
    return { viewData };
  }

  @Post('/store')
  @Redirect('/admin/products/')
  async store(@Body() body): Promise<void> {
    const newProduct = new Product();
    newProduct.setName(body.name);
    newProduct.setDescription(body.description);
    newProduct.setPrice(body.price);
    newProduct.setImage('game.png');
    await this.productService.createOrUpdate(newProduct);
  }
}
