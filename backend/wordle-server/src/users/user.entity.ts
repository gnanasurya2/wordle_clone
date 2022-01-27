import {
  AfterInsert,
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  getConnection,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Stats } from 'src/stats/stats.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hasPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
  @AfterInsert()
  async createStat() {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Stats)
      .values({
        userId: this.id,
        guessDistribution: ['0', '0', '0', '0', '0', '0'],
      })
      .execute();
  }
}
