import {BaseEntity, Column, Entity, Generated, PrimaryGeneratedColumn} from "typeorm";

@Entity('slide')
export class Slide extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'uuid',
    comment: '关联到 timeline 的 title 或 events'
  })
  pid!: string;

  @Column({ type: 'varchar' })
  from!: string;

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
}
