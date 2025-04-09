import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

/**
 * id  : uuid
 * name: varchar // 用于名称选择切换
 */
@Entity('timeline')
export class TimelineEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({type: 'varchar', unique: true})
  name!: string;

  @Column({type: 'int', default: 0})
  weight?: number;

  @CreateDateColumn({
    default: () => "datetime(CURRENT_TIMESTAMP, 'localtime')",
  })
  create_time!: Date;

  @UpdateDateColumn({
    default: () => "datetime(CURRENT_TIMESTAMP, 'localtime')",
  })
  update_time!: Date;
}
