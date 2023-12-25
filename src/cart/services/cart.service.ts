import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart_item.entity';
import { CartStatuses } from '../models/index';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async findByUserId(userId: string): Promise<Cart> {
    return this.cartRepository.findOne({
      relations: ['items', 'items.product'],
      where: { user_id: userId, status: CartStatuses.OPEN },
    });
  }

  async createByUserId(userId: string): Promise<Cart> {
    const newCart = this.cartRepository.create({
      id: v4(),
      user_id: userId,
      items: [],
    });
    await this.cartRepository.save(newCart);
    return newCart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    const cartItems = items.map((item) => ({
      cartId: id,
      productId: item.product.id,
      count: item.count,
    }));

    const createdItems = cartItems.map((cartItem) =>
      this.cartItemRepository.create(cartItem),
    );

    createdItems.map((createdItem) =>
      this.cartItemRepository.save(createdItem),
    );

    return await this.findByUserId(userId);
  }

  async removeByUserId(userId: string): Promise<void> {
    await this.cartRepository.delete({ user_id: userId });
  }
}
