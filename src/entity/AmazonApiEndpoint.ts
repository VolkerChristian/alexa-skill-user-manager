//import "reflect-metadata";
require('reflect-metadata');
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, BaseEntity, UpdateDateColumn, CreateDateColumn, VersionColumn } from "typeorm";
import { AmazonUser } from "./AmazonUser";

@Entity()
export class AmazonApiEndpoint {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 255 })
    @Index("applicationId", { unique: true })
    applicationId: string;

    @Column("varchar", { length: 1023 })
    apiAccessToken: string;

    @Column("datetime")
    expires: Date;

    @UpdateDateColumn()
    changed: Date;

    @CreateDateColumn()
    created: Date;

    @VersionColumn()
    version: Number;

    @OneToMany(type => AmazonUser, amazonUser => amazonUser.amazonApiEndpoint)
    amazonUsers: AmazonUser[];
}