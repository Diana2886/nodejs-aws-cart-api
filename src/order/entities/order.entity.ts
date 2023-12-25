import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';
import { OrderStatus } from '../models';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @Column({ type: 'uuid', nullable: false })
  cart_id: string;

  @ManyToOne(() => Cart)
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart: Cart;

  @Column('json', { nullable: true })
  payment: {
    type: string;
    address?: any;
    creditCard?: any;
  };

  @Column('json', { nullable: true })
  delivery: {
    type: string;
    address: any;
  };

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.OPEN })
  status: OrderStatus;

  @Column({ type: 'integer', nullable: false })
  total: number;
}
