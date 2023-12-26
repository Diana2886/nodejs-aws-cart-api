import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import { CartItem } from './cart_item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer', nullable: false })
  price: number;

  @OneToMany(() => CartItem, (item) => item.product_id)
  @JoinColumn({ name: 'id', referencedColumnName: 'product_id' })
  cartItems: CartItem[];
}
