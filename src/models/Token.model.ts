import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import User from './User.model';

@Table({ tableName: 'token' })
export default class Token extends Model {
  @Column
  refreshToken: string;

  @ForeignKey(() => User)
  @Column
  userId: number;
}
