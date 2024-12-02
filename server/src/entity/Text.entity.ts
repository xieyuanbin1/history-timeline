import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('text')
export class Text extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({type: 'varchar'})
  tid!: string;

  @Column({type: 'varchar', nullable: true})
  headline?: string;

  @Column({type: 'varchar', nullable: true})
  text?: string;
}
