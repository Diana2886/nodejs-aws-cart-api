import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart, CartItem } from '../models';

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  findByUserId(userId: string): Cart {
    return this.userCarts[ userId ];
  }

  createByUserId(userId: string) {
    const id = v4();
    const userCart = {
      id,
      items: [],
    };

    this.userCarts[ userId ] = userCart;

    return userCart;
  }

  findOrCreateByUserId(userId: string): Cart {
    const userCart = this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  updateByUserId(userId: string, item: CartItem): Cart {
    const { id, items: existingItems, ...rest } = this.findOrCreateByUserId(userId);

    const existingItemIndex = existingItems.findIndex(item => item.product.title === item.product.title);

    if (existingItemIndex !== -1) {
      existingItems[existingItemIndex].count = item.count;
    } else {
      existingItems.push(item);
    }

    const updatedCart = {
      id,
      ...rest,
      items: existingItems,
    }

    this.userCarts[ userId ] = { ...updatedCart };

    return { ...updatedCart };
  }

  removeByUserId(userId): void {
    this.userCarts[ userId ] = null;
  }

}
