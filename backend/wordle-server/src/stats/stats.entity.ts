import { User } from 'src/users/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Stats extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  totalAttempts: number;

  @Column({ default: 0 })
  completed: number;

  @Column({ default: 0 })
  failed: number;

  @Column({ default: 0 })
  didNotFinish: number;

  @Column({ type: 'simple-array' })
  guessDistribution: [string, string, string, string, string, string];

  @Column({ default: 0 })
  currentStreak: number;

  @Column({ default: 0 })
  maxStreak: number;

  @Column({
    type: 'date',
    default: new Date().toISOString().split('T')[0],
  })
  lastCompletedDate: string;

  @Column({ unique: true })
  userId: number;
}
