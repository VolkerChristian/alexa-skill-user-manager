//import "reflect-metadata";
require('reflect-metadata');
import { Column, CreateDateColumn, DeleteResult, Entity, getConnection, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { AmazonApiEndpoint } from './AmazonApiEndpoint';

@Entity()
@Index("userId-applicationId", ["userId", "applicationId"], { unique: true })
export class AmazonUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => AmazonApiEndpoint, amazonApiEndpoint => amazonApiEndpoint.amazonUsers)
    amazonApiEndpoint: AmazonApiEndpoint;

    @Column("varchar", { length: 511 })
    userId: string;

    @Column("varchar", { length: 255 })
    applicationId: string;

    @Column()
    accountLinked: boolean;

    @Column()
    proactivePermission: boolean;

    @Column("varchar", { length: 1023 })
    apiEndpoint: string;

    @Column("varchar", { length: 1023 })
    apiAccessToken: string;

    @UpdateDateColumn()
    changed: Date;

    @CreateDateColumn()
    created: Date;

    @VersionColumn()
    version: Number;

    static getUserWithProactiveEndpoint(userId: string, skillId: string) {
        return new Promise<AmazonUser>((resolve, reject) => {
            getConnection('amazon')
                .getRepository<AmazonUser>('AmazonUser')
                .createQueryBuilder('user')
                .leftJoinAndMapOne(
                    'user.amazonApiEndpoint',
                    AmazonApiEndpoint, "amazonApiEndpoint",
                    "amazonApiEndpoint.id = user.amazonApiEndpointId"
                )
                .where(
                    'user.userId = :userId', { userId: userId }
                )
                .andWhere(
                    "amazonApiEndpoint.applicationId = :skillId", { skillId: skillId }
                )
                .getOne()
                .then((user) => resolve(user))
                .catch((reason) => reject(reason))
        });
    }

    static remove(user: AmazonUser) {
        return new Promise<AmazonUser>((resolve, reject) => {
            getConnection('amazon')
                .getRepository<AmazonUser>('AmazonUser')
                .remove(user)
                .then(value => resolve(value))
                .catch(reason => resolve(reason));
        })
    }

    static delete(userId: string, skillId: string) {
        return new Promise<DeleteResult>((resolve, reject) => {
            getConnection('amazon')
                .getRepository<AmazonUser>('AmazonUser')
                .createQueryBuilder()
                .delete()
                .where(
                    'userId = :userId', { userId: userId }
                )
                .andWhere(
                    'applicationId = :skillId', { skillId: skillId }
                )
                .execute()
                .then(value => resolve(value))
                .catch(reason => resolve(reason));
        })
    }

    static save(user: AmazonUser) {
        return new Promise<AmazonUser>((resolve, reject) => {
            getConnection('amazon')
                .getRepository<AmazonUser>('AmazonUser')
                .save(user)
                .then(user => resolve(user))
                .catch(reason => reject(reason));
        });
    }

    static getUser(userId: string) {
        return new Promise<AmazonUser>((resolve, reject) => {
            getConnection('amazon').getRepository<AmazonUser>('AmazonUser')
                .createQueryBuilder('user')
                .leftJoinAndMapOne(
                    'user.amazonApiEndpoint',
                    AmazonApiEndpoint, "amazonApiEndpoint",
                    "amazonApiEndpoint.id = user.amazonApiEndpointId"
                )
                .where(
                    'user.userId = :userId', { userId: userId }
                )
                .getOne()
                .then((user) => resolve(user))
                .catch((reason) => reject(reason))
        });
    }
}
