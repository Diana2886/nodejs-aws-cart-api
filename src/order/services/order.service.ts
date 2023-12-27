import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderStatus } from '../models';

@Injectable()
export class OrderService {
  private orders: Record<string, Order> = {};
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  async find(): Promise<Order[]> {
    const orders = await this.orderRepository.find();
    return orders;
  }

  async findById(orderId: string): Promise<Order> {
    const order = this.orderRepository.findOneBy({ id: orderId });
    console.log('order', order);
    return order;
  }

  async create(data: Partial<Order> & { cartId: string }): Promise<Order> {
    const { cartId, ...orderData } = data;

    if (!cartId) {
      throw new Error('cartId is required to create an order');
    }

    const order = this.orderRepository.create({
      ...orderData,
      cart_id: cartId,
      status: OrderStatus.OPEN,
    });
    order.status = OrderStatus.OPEN;

    const createdOrder = await this.orderRepository.save(order);
    return createdOrder;
  }

  async update(orderId: string, data: Partial<Order>) {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    if ('cart_id' in data) {
      delete data.cart_id;
    }

    await this.orderRepository.update(orderId, {
      ...data,
    });

    return await this.findById(orderId);
  }

  async createTransactionally(data: Record<string, any>): Promise<Order> {
    const { user_id, cart_id, total, delivery, ...otherBodyProperties } = data;

    const newOrder = new Order();
    newOrder.user_id = user_id;
    newOrder.cart_id = cart_id;
    newOrder.total = total;
    newOrder.delivery = { type: 'someType', address: delivery };
    
    if ('payment' in otherBodyProperties) {
      newOrder.payment = otherBodyProperties.payment;
    }
    if ('comments' in otherBodyProperties) {
      newOrder.comments = otherBodyProperties.comments;
    }

    newOrder.status = OrderStatus.OPEN;

    await this.orderRepository.save(newOrder);
    return newOrder;
  }
}
