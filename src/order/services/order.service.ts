import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';

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

  findById(orderId: string): Order {
    return this.orders[orderId];
  }

  create(data: any) {
    const id = v4();
    const order = {
      ...data,
      id,
      status: 'inProgress',
    };

    this.orders[id] = order;

    return order;
  }

  update(orderId, data) {
    const order = this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    this.orders[orderId] = {
      ...data,
      id: orderId,
    };
  }
}
