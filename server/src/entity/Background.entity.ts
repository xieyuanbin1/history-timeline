import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

/**
 * id   : uuid
 * pid  : uuid            // 指向 slide.id
 * url  : varchar
 * alt  : varchar
 * color: number | string // 以十六进制表示的 CSS 颜色（如 #0f9bd1）或有效的 CSS 颜色关键字。项目中仅使用十六进制
 */
@Entity('background')
export class BackgroundEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({type: 'varchar'})
  pid!: string;

  @Column({type: 'varchar', nullable: true})
  url?: string;

  @Column({type: 'varchar', nullable: true})
  alt?: string;

  @Column({type: 'int', nullable: true})
  color?: number;

  @CreateDateColumn({
    default: () => "datetime(CURRENT_TIMESTAMP, 'localtime')",
  })
  create_time!: Date;

  @UpdateDateColumn({
    default: () => "datetime(CURRENT_TIMESTAMP, 'localtime')",
  })
  update_time!: Date;
}
