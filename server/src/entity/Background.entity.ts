import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('background')
export class Background extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({type: 'varchar'})
  bid!: string;

  @Column({type: 'varchar'})
  url!: string;

  @Column({type: 'varchar', nullable: true})
  alt?: string;

  @Column({type: 'int', nullable: true})
  color?: number;
}
