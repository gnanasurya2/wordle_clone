import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Word extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  word: string;

  @Column({ default: 0 })
  frequency: number;

  @Column({ default: false })
  alreadyUsedAsWordle: boolean;
}
