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

const { PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD, PG_DATABASE } = process.env;
@Module({
  imports: [
    AuthModule,
    CartModule,
    OrderModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: PG_HOST,
      port: +PG_PORT,
      username: PG_USERNAME,
      password: PG_PASSWORD,
      database: PG_DATABASE,
      entities: [Cart, CartItem, Product, Order],
      logging: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
