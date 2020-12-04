import 'reflect-metadata';

import { AmazonUser } from './entity/AmazonUser';
import { AmazonApiEndpoint, getApiToken, setOAuth2Config as epSetOAuth2Config } from './entity/AmazonApiEndpoint';
import { Connection, createConnection } from 'typeorm';
import { AmazonUserRepository } from './AmazonUserRepository';
import { AmazonApiEndpointRepository } from './AmazonApiEndpointRepository';

export { AmazonApiEndpoint, getApiToken } from './entity/AmazonApiEndpoint';
export { AmazonUser } from './entity/AmazonUser'

let _connection: Connection;

export async function connect() {
    _connection = await createConnection({
        type: "mysql",
        host: "proliant.home.vchrist.at",
        port: 3306,
        username: "wastereminder",
        password: "!!!SoMaSi01!!!",
        database: "WasteReminder",
        synchronize: true,
        logging: false,
        entities: getEntities()
    });
}


export function setOAuth2Config(oAuth2Config) {
    epSetOAuth2Config(oAuth2Config);
}


export async function close() {
    if (connected()) {
        await _connection.close();
    }
}

export function connected() {
    return typeof _connection !== 'undefined';
}

export function getAmazonUserRepository(): AmazonUserRepository {
    return _connection.getCustomRepository(AmazonUserRepository);
}

export function getAmazonApiEndpointRepository(): AmazonApiEndpointRepository {
    return _connection.getCustomRepository(AmazonApiEndpointRepository);
}

export function getEntities() {
    return [AmazonUser, AmazonApiEndpoint]
}

export function setConnection(connection: Connection) {
    _connection = connection;
}
