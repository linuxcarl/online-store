import {
  Controller,
  Get,
  Render,
  Post,
  Redirect,
  Body,
  UseInterceptors,
  UploadedFile,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { ProductsService } from '../models/product.service';
import { Product } from '../models/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductValidator } from '../validators/product.validator';
import * as fs from 'fs';
import { response } from 'express';
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
  @UseInterceptors(FileInterceptor('image', { dest: './public/uploads' }))
  @Redirect('/admin/products/')
  async store(
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
    @Req() request,
  ): Promise<void> {
    const toValidate: string[] = [
      'name',
      'description',
      'price',
      'imageCreate',
    ];
    const errors: string[] = ProductValidator.validate(body, file, toValidate);
    if (errors.length) {
      if (file) {
        fs.unlinkSync(file.path);
      }
      request.session.flashErrors = errors;
    } else {
      const newProduct = new Product();
      newProduct.setName(body.name);
      newProduct.setDescription(body.description);
      newProduct.setPrice(body.price);
      newProduct.setImage(file.filename);
      await this.productService.createOrUpdate(newProduct);
    }
  }
  @Post(':id')
  @Redirect('/admin/products')
  async remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
  @Get('/:id')
  @Render('admin/products/edit')
  async edit(@Param('id') id: string) {
    const viewData = [];
    viewData['title'] = 'Edit product - admin online store';
    viewData['product'] = await this.productService.findOne(id);
    return { viewData };
  }
  @Post('/:id/update')
  @UseInterceptors(FileInterceptor('image', { dest: 'public/uploads' }))
  async update(
    @Param('id') id: string,
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
    @Req() request,
    @Res() response,
  ) {
    const toValidate: string[] = [
      'name',
      'description',
      'price',
      'imageCreate',
    ];
    const errors: string[] = ProductValidator.validate(body, file, toValidate);
    if (errors.length) {
      if (file) {
        fs.unlinkSync(file.path);
      }
      request.session.flashErrors = errors;
      return response.redirect(`/admin/products/${id}`);
    } else {
      const product = await this.productService.findOne(id);
      product.setName(body.name);
      product.setDescription(body.description);
      product.setPrice(body.price);
      if (file) {
        product.setImage(file.filename);
      }
      await this.productService.createOrUpdate(product);
      return response.redirect(`/admin/products`);
    }
  }
}
