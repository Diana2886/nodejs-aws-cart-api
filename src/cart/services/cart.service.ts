import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart_item.entity';
import { CartStatuses } from '../models/index';
import { Product } from '../entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findByUserId(userId: string): Promise<Cart> {
    console.log('userId', userId);
    const cart = await this.cartRepository.findOne({
      where: { user_id: userId },
      relations: ['items', 'items.product'],
    });
    return cart;
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
    let cart = await this.findByUserId(userId);

    if (!cart) {
      cart = await this.createByUserId(userId);
    }

    await this.cartRepository.update(
      { user_id: userId },
      {
        updated_at: new Date().toISOString().split('T')[0],
        status: CartStatuses.ORDERED,
      },
    );

    cart = await this.findByUserId(userId);

    for (const itemPayload of items) {
      const existingItem = cart.items.find(
        (cartItem) => cartItem.id === itemPayload.id,
      );

      if (existingItem) {
        const product = await this.productRepository.findOne({
          where: { id: itemPayload.product.id },
        });

        if (!product) {
          throw new Error(
            `Product with ID ${itemPayload.product.id} not found.`,
          );
        }

        existingItem.count = itemPayload.count;
        existingItem.product = product;
        await this.cartItemRepository.save(existingItem);
      } else {
        const product = await this.productRepository.findOne({
          where: { id: itemPayload.product.id },
          relations: ['cartItems'],
        });

        if (!product) {
          throw new Error(
            `Product with ID ${itemPayload.product.id} not found.`,
          );
        }

        const newCartItem = this.cartItemRepository.create({
          cart_id: cart.id,
          product_id: product.id,
          count: itemPayload.count,
          product: product,
        });

        await this.cartItemRepository.save(newCartItem);
      }
    }

    return cart;
  }

  async removeByUserId(userId: string): Promise<void> {
    await this.cartRepository.delete({ user_id: userId });
  }
}
