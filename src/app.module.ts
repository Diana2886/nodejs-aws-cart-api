import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart/entities/cart.entity';
import { CartItem } from './cart/entities/cart_item.entity';
import 'dotenv/config';
import { Product } from './cart/entities/product.entity';
import { Order } from './order/entities/Order';

@Module({
  imports: [
    AuthModule,
    CartModule,
    OrderModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: +process.env.PG_PORT,
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      // entities: [Cart, CartItem, Product, Order],
      logging: true,
      ssl: {
        rejectUnauthorized: false
      },
    }),
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule {}
