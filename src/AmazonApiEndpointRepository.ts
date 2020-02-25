import { EntityRepository, Repository } from 'typeorm';
import { AmazonApiEndpoint } from './entity/AmazonApiEndpoint';

@EntityRepository(AmazonApiEndpoint)
export class AmazonApiEndpointRepository extends Repository<AmazonApiEndpoint> {
}
