//import "reflect-metadata";
require('reflect-metadata');
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    Index,
    UpdateDateColumn,
    CreateDateColumn,
    VersionColumn,
    getRepository
} from "typeorm";
import {
    AmazonUser
} from "./AmazonUser";
import ClientOAuth2, {
    RequestObject
} from 'client-oauth2';
import amzConfig from '../../amzconfig.json';

@Entity()
export class AmazonApiEndpoint {

    constructor(applicationId: string) {
        this.applicationId = applicationId;
    }
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 255 })
    @Index("applicationId", { unique: true })
    readonly applicationId: string;

    @Column("varchar", { length: 1023 })
    apiAccessToken: string;

    @Column('varchar', { length: 63 })
    tokenType: string;

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

    set expiresIn(expiresIn: string) {
        this.expires = new Date((Date.now() / 1000 + +expiresIn) * 1000);
    }

    get expiresIn(): string {
        return (((this.expires.valueOf() - Date.now()) / 1000 - 300)|0).toString();
    }

    sign<T extends RequestObject>(req: T) {
        return new Promise<T>((resolve, reject) => {
            getApiToken(this.applicationId)
                .then(token => {
                    token.sign(req);
                    resolve(req);
                })
                .catch(reason => reject(reason));
        });
    };
}


const aptAuth: ClientOAuth2 = new ClientOAuth2(amzConfig.aptOAuth2Config);


const refreshToken = (endPoint: AmazonApiEndpoint) => {
    return new Promise<ClientOAuth2.Token>((resolve, reject) => {
        aptAuth.credentials.getToken()
            .then(token => {
                endPoint.apiAccessToken = token.accessToken;
                endPoint.expiresIn = token.data.expires_in;
                endPoint.tokenType = token.data.token_type;

                getRepository<AmazonApiEndpoint>("AmazonApiEndpoint")
                    .save(endPoint)
                    .then(() => resolve(token))
                    .catch(reason => reject(reason));
            })
            .catch(reason => reject(reason));

    })
}


export const getApiToken = (skillId: string) => {
    return new Promise<ClientOAuth2.Token>((resolve, reject) => {
        getRepository<AmazonApiEndpoint>("AmazonApiEndpoint")
            .findOne({ where: { applicationId: skillId } })
            .then(endPoint => {
                var token: ClientOAuth2.Token;
                if (endPoint) {
                    token = aptAuth.createToken({
                        access_token: endPoint.apiAccessToken,
                        token_type: endPoint.tokenType,
                        expires_in: endPoint.expiresIn

                    });
                    if (!token.expired()) {
                        resolve(token);
                    }
                } else {
                    endPoint = new AmazonApiEndpoint(skillId);
                }
                refreshToken(endPoint)
                    .then(token => resolve(token))
                    .catch(reason => reject(reason));

            })
            .catch(reason => reject(reason));
    });
}
