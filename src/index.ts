import { AmazonUser } from './entity/AmazonUser';
import { AmazonApiEndpoint } from './entity/AmazonApiEndpoint';
import { createConnection, Connection } from 'typeorm';


const amzStartUp = () => new Promise<Connection>((resolve, reject) => {
    createConnection('amazon')
        .then(connection => resolve(connection))
        .catch(reason => reject(reason));
});


export {
    amzStartUp,
    AmazonUser,
    AmazonApiEndpoint
}