import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('date')
export class Date extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    comment: '关联 start_date 或 end_date'
  })
  did!: string;

  @Column({
    type: 'int'
  })
  year!: number;

  @Column({type: 'int', nullable: true})
  month?: number;

  @Column({type: 'int', nullable: true})
  day?: number;

  @Column({type: 'int', nullable: true})
  hour?: number;

  @Column({type: 'int', nullable: true})
  minute?: number;

  @Column({type: 'int', nullable: true})
  second?: number;

  @Column({type: 'int', nullable: true})
  millisecond?: number;

  @Column({type: 'varchar', nullable: true})
  display_date?: string;

  @Column({type: 'varchar', nullable: true})
  format?: string;
}
