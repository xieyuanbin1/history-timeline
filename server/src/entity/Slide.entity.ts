import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

/**
 * id           : uuid
 * pid          : uuid    // 关联到父 id
 * type         : varchar // timeline 上有 title 和 events 都有 slide，type 用于区分归属
 * group        : varchar
 * display_date : varchar
 * autolink     : boolean
 * unique_id    : varchar
 */
@Entity('slide')
export class SlideEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'uuid',
    comment: '关联到 timeline 的 id'
  })
  pid!: string;

  @Column({ type: 'varchar' })
  type!: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  group?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  display_date?: string;

  @Column({
    type: 'boolean',
    nullable: true
  })
  autolink?: boolean;

  @Column({
    type: 'varchar',
    nullable: true
  })
  unique_id?: string;

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

// slide.type 字段
export enum SlideFrom  {
  TITLE = '0', // 对应 title 字段
  EVENT = '1', // 对应 events 字段
}