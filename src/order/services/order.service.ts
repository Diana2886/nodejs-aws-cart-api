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

  async create(data: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create(data);
    order.status = OrderStatus.OPEN;

    const createdOrder = await this.orderRepository.save(order);
    return createdOrder;
  }

  async update(orderId: string, data: Partial<Order>) {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    await this.orderRepository.update(orderId, {
      ...data,
    });

    return await this.findById(orderId);
  }
}
