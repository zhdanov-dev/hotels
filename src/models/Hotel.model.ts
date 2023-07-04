import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import Room from './Room.model';

@Table({ tableName: 'hotel' })
export default class Hotel extends Model {
  @Column
  name: string;

  @HasMany(() => Room)
  rooms: Room[];
}
