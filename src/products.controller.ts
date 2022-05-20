import { Controller, Get, Render, Param, Res } from '@nestjs/common';
import { ProductsService } from './models/product.service';

@Controller('/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  @Render('products/index')
  public async index() {
    const viewData = [];
    viewData['title'] = 'Products - Online Store';
    viewData['subtitle'] = 'List of products';
    viewData['products'] = await this.productsService.findAll();
    return { viewData };
  }
  @Get('/:id')
  public async show(@Param() params, @Res() response) {
    if (params === undefined) {
      return response.redirect('/products');
    }
    const product = await this.productsService.findOne(params);
    const viewData = [];
    viewData['title'] = product.name + ' - Online Store';
    viewData['subtitle'] = product.name + ' - Product Information';
    viewData['product'] = product;
    return response.render('products/show', { viewData });
  }
}
