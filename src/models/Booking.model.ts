import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import Room from './Room.model';
import User from './User.model';

@Table({
  tableName: 'booking',
  underscored: true,
  timestamps: false
})
export default class Booking extends Model {
  @Column
  dateFrom: string;

  @Column
  dateTo: string;

  @Column
  vip: boolean;

  @ForeignKey(() => Room)
  @Column
  roomId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;
}
