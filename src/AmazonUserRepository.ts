import { EntityRepository, Repository, DeleteResult } from 'typeorm';
import { AmazonUser } from './entity/AmazonUser';
import { AmazonApiEndpoint } from './entity/AmazonApiEndpoint';

@EntityRepository(AmazonUser)
export class AmazonUserRepository extends Repository<AmazonUser> {
    getUserWithProactiveEndpoint(userId: string, skillId: string) {
        return this.createQueryBuilder('user')
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
            .getOne();
    }


    getUser(userId: string) {
        return this.createQueryBuilder('user')
            .leftJoinAndMapOne(
                'user.amazonApiEndpoint',
                AmazonApiEndpoint, "amazonApiEndpoint",
                "amazonApiEndpoint.id = user.amazonApiEndpointId"
            )
            .where(
                'user.userId = :userId', { userId: userId }
            )
            .getOne();
    }


    deleteUser(userId: string, skillId: string) {
        return this.createQueryBuilder()
            .delete()
            .where(
                'userId = :userId', { userId: userId }
            )
            .andWhere(
                'applicationId = :skillId', { skillId: skillId }
            )
            .execute();
    }
}
