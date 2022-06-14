import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Render,
  Req,
} from '@nestjs/common';
import { Product } from '../models/product.entity';
import { ProductsService } from '../models/product.service';

@Controller('cart')
export class CartController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  @Render('cart/index')
  async index(@Req() request) {
    let total = 0;
    let productsInCar: Product[] = null;
    const productInSession = request.session.products;
    if (productInSession) {
      productsInCar = await this.productsService.findByIds(
        Object.keys(productInSession),
      );
      total = Product.sumPriceByQuantities(productsInCar, productInSession);
    }

    const viewData = [];
    viewData['title'] = 'Cart - online store';
    viewData['subtitle'] = 'Shooping cart';
    viewData['total'] = total;
    viewData['productsInCart'] = productsInCar;
    return { viewData };
  }

  @Post('add/:id')
  @Redirect('/cart')
  add(@Param('id') id: number, @Body() body, @Req() request) {
    let productsInSession = request.session.products;
    if (!productsInSession) {
      productsInSession = {};
    }
    productsInSession[id] = body.quantity;
    request.session.products = productsInSession;
  }

  @Get('/delete')
  @Redirect('/cart/')
  delete(@Req() request) {
    request.session.products = null;
  }
}
