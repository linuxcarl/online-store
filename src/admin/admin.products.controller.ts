import { Controller, Get, Render } from '@nestjs/common';
import { ProductsService } from '../models/product.service';
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
}
