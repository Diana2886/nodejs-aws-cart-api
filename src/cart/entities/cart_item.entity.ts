import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';
import { Order } from 'src/order/entities/order.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  product_id: string;

  @Column({ type: 'integer', nullable: false })
  count: number;

  @ManyToOne(() => Cart)
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart_id: Cart['id'];

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;
}
