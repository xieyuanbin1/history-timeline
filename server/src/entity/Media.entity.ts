import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

/**
 * id         : uuid
 * pid        : uuid    // 指向 slide.id
 * url        : varchar
 * caption    : varchar
 * credit     : varchar
 * thumbnail  : varchar
 * alt        : varchar
 * title      : varchar
 * link       : varchar
 * link_target: varchar
 */
@Entity('media')
export class MediaEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({type: 'varchar'})
  pid!: string;

  @Column({type: 'varchar'})
  url!: string;

  @Column({type: 'varchar', nullable: true})
  caption?: string;

  @Column({type: 'varchar', nullable: true})
  credit?: string;

  @Column({type: 'varchar', nullable: true})
  thumbnail?: string;

  @Column({type: 'varchar', nullable: true})
  alt?: string;

  @Column({type: 'varchar', nullable: true})
  title?: string;

  @Column({type: 'varchar', nullable: true})
  link?: string;

  @Column({type: 'varchar', nullable: true})
  link_target?: string;

  @CreateDateColumn({
    default: () => "datetime(CURRENT_TIMESTAMP, 'localtime')",
  })
  create_time!: Date;

  @UpdateDateColumn({
    default: () => "datetime(CURRENT_TIMESTAMP, 'localtime')",
  })
  update_time!: Date;
}
