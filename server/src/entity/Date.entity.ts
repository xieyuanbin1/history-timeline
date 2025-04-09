import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

/**
 * id          : uuid
 * pid         : uuid   // 指向 slide.id 或 eras.id
 * type        : number // 0/start_date 1/end_date
 * year        :
 * month       :
 * day         :
 * hour        :
 * minute      :
 * second      :
 * millisecond :
 * display_date:
 * format      :
 */
@Entity('date')
export class DateEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  pid!: string;

  @Column({ type: 'int' })
  type!: number;

  @Column({ type: 'int' })
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

  @CreateDateColumn({
    default: () => "datetime(CURRENT_TIMESTAMP, 'localtime')",
  })
  create_time!: Date;

  @UpdateDateColumn({
    default: () => "datetime(CURRENT_TIMESTAMP, 'localtime')",
  })
  update_time!: Date;
}
