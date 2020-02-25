import { EntityRepository, Repository } from 'typeorm';
import { AmazonUser } from './entity/AmazonUser';
import { AmazonApiEndpoint } from './entity/AmazonApiEndpoint';

@EntityRepository(AmazonUser)
export class AmazonUserRepository extends Repository<AmazonUser> {
    getUserWithProactiveEndpoint(userId: string, skillId: string) {
        return new Promise<AmazonUser>((resolve, reject) => {
            this.createQueryBuilder('user')
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

    
    getUser(userId: string) {
        return new Promise<AmazonUser>((resolve, reject) => {
            this.createQueryBuilder('user')
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


    /*
    delete(userId: string, skillId: string) {
        new Promise<DeleteResult>((resolve, reject) => {
            this.createQueryBuilder()
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
    */
    /*
        static save(user: AmazonUser) {
            new Promise<AmazonUser>((resolve, reject) => {
                save(user)
                    .then(user => resolve(user))
                    .catch(reason => reject(reason));
            });
        }
    */
}
