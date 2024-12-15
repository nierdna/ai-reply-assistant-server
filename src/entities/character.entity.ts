import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { Gender } from "@/constants/enum";
@Entity("characters")
export class Character {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  tone: string;

  @Column({ nullable: true })
  style: string;

  @Column()
  purpose: string;

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  age: number;

  @Column({
    type: "enum",
    enum: Gender,
    default: Gender.MALE,
    nullable: true,
  })
  gender: Gender;
}
