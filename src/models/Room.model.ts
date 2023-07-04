import {
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript';
import Hotel from './Hotel.model';
import Booking from './Booking.model';

@Table({
  tableName: 'room',
  underscored: true,
  timestamps: false
})
export default class Room extends Model {
  @Column
  number: number;

  @HasMany(() => Booking)
  bookings: Booking[];

  @ForeignKey(() => Hotel)
  @Column
  hotelId: number;
}
