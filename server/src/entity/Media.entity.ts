import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('media')
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({type: 'varchar'})
  mid!: string;

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
}
