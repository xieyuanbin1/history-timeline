import {BaseEntity, Column, Entity, Generated, PrimaryGeneratedColumn} from "typeorm";

@Entity('timeline')
export class Timeline extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 时间区块名称
  @Column({type: 'varchar', unique: true})
  name!: string;

  @Column()
  @Generated('uuid')
  title!: string;

  @Column()
  @Generated('uuid')
  events!: string;

  @Column({type: 'int', default: 0})
  weight?: number;
}
