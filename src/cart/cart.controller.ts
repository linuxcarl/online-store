import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { Product } from '../models/product.entity';
import { ProductsService } from '../models/product.service';
import { OrderService } from '../models/orders.service';
import { UsersService } from '../models/users.service';
import { Item } from '../models/item.entity';
import { Order } from 'src/models/order.entity';

@Controller('cart')
export class CartController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly orderService: OrderService,
    private readonly usersService: UsersService,
  ) {}

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
  @Get('/purchase')
  async purchase(@Req() request, @Res() response) {
    if (!request.session.user) {
      return response.redirect('/auth/login');
    } else if (!request.session.products) {
      return response.redirect('/cart');
    } else {
      const user = await this.usersService.findOne(request.session.user.id);
      const productsInSession = request.session.products;
      const productsInCart = await this.productsService.findByIds(
        Object.keys(productsInSession),
      );
      let total = 0;
      const items: Item[] = [];
      for (const product of productsInCart) {
        const quantity = productsInSession[product.getId()];
        const item = new Item();
        item.setQuantity(quantity);
        item.setPrice(product.getPrice());
        item.setProduct(product);
        items.push(item);
        total += product.getId() * quantity;
      }
      const newOrder = new Order();
      newOrder.setTotal(total);
      newOrder.setItem(items);
      newOrder.setUser(user);
      const order = await this.orderService.createOrUpdate(newOrder);

      const newBalance = user.getBalance() - total;
      await this.usersService.updateBalance(user.getId(), newBalance);
      request.session.products = null;

      const viewData = [];
      viewData['title'] = 'Purcharse - online store';
      viewData['subtitle'] = 'Purcharse';
      viewData['orderId'] = order.getId();
      return response.render('cart/purchase', { viewData });
    }
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
