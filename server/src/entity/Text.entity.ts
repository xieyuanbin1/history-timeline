import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

/**
 * id      : uuid
 * pid     : uuid    // 这里的 pid 指向 slide.id 或 eras.id
 * headline: varchar // 标题
 * text    : varchar // 详细说明
 */
@Entity('text')
export class TextEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({type: 'varchar'})
  pid!: string;

  @Column({type: 'varchar', nullable: true})
  headline?: string;

  @Column({type: 'varchar', nullable: true})
  text?: string;

  @CreateDateColumn({
    default: () => "datetime(CURRENT_TIMESTAMP, 'localtime')",
  })
  create_time!: Date;

  @UpdateDateColumn({
    default: () => "datetime(CURRENT_TIMESTAMP, 'localtime')",
  })
  update_time!: Date;
}
