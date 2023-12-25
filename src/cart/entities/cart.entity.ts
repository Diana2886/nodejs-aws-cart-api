import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CartItem } from './cart_item.entity';
import { Order } from 'src/order/entities/Order';

enum CartStatuses {
  OPEN = 'OPEN',
  STATUS = 'STATUS',
}

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: string;

  @Column({ type: 'enum', enum: CartStatuses, default: CartStatuses.OPEN })
  status: CartStatuses;

  @OneToMany(() => CartItem, (item) => item.cart, { eager: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'cart_id' })
  items: CartItem[];

  @OneToMany(() => Order, (order) => order.cart)
  order: Order[]
}
