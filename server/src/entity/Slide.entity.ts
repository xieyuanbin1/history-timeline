import {BaseEntity, Column, Entity, Generated, PrimaryGeneratedColumn} from "typeorm";

@Entity('slides')
export class Slide extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'uuid',
    comment: '关联到 timeline 的 title 或 events'
  })
  sid!: string;

  @Column()
  @Generated('uuid')
  start_date!: string;

  @Column()
  @Generated('uuid')
  end_date!: string;

  @Column()
  @Generated('uuid')
  text!: string;

  @Column()
  @Generated('uuid')
  media!: string;

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

  @Column()
  @Generated('uuid')
  background!: string;

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
