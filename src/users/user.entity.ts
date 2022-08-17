import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Report } from 'src/reports/reports.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @Column({ default: true })
  admin: boolean;
}
