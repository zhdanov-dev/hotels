import { Column, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
import Token from './Token.model';
import Booking from './Booking.model';

@Table({ tableName: 'user' })
export default class User extends Model {
  @Column
  email: string;

  @Column
  password: string;

  @Column
  name: string;

  @Column
  vip: boolean;

  @HasOne(() => Token)
  token: Token;

  @HasMany(() => Booking)
  Bookings: Booking[];
}
