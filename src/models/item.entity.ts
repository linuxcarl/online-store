import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @ManyToOne(() => Product, (product) => product.items)
  product: Product;

  getId(): number {
    return this.id;
  }
  setId(id: number): void {
    this.id = id;
  }
  getQuantity(): number {
    return this.quantity;
  }
  setQuantity(quantity: number): void {
    this.quantity = quantity;
  }
  getPrice(): number {
    return this.price;
  }
  setPrice(price: number): void {
    this.price = price;
  }
  getOrder(): Order {
    return this.order;
  }
  setOrder(order: Order): void {
    this.order = order;
  }
  getProduct(): Product {
    return this.product;
  }
  setProduct(product: Product): void {
    this.product = product;
  }
}
