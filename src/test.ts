import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { AmazonUser } from './entity/AmazonUser';
import { AmazonApiEndpoint } from "./entity/AmazonApiEndpoint";
import { inspect } from 'util';

function dropTables() {
    return new Promise(async function (resolve, reject) {
        console.log("Start Drop Tables");
        try {
            let connection = await createConnection();
            let queryRunner = connection.createQueryRunner();

            await queryRunner.query("DROP TABLE amazon_user");
            await queryRunner.query("DROP TABLE amazon_api_endpoint");

            await connection.close();

            resolve();
        } catch (err) {
            reject(err);
        }
    })
}

function insertData() {
    return new Promise(async function (resolve, reject) {
        console.log("Start Insert Data");
        try {
            const amazonUser = new AmazonUser();
            amazonUser.accountLinked = true;
            amazonUser.proactivePermission = true;
            amazonUser.apiEndpoint = "Hallo Du";
            amazonUser.apiAccessToken = "AccessToken";
            amazonUser.applicationId = "SkillID";
            amazonUser.userId = "AmazonUser";
            amazonUser.created = new Date();
            await getRepository<AmazonApiEndpoint>("AmazonUser").save(amazonUser);
            // await connection.manager.save(amazonUser);

            const amazonApiEndpoint = new AmazonApiEndpoint();
            amazonApiEndpoint.apiAccessToken = "AccessToken";
            amazonApiEndpoint.applicationId = "SkillID";
            amazonApiEndpoint.created = new Date();
            amazonApiEndpoint.expires = new Date(Date.now() + 100000); // +100 Seconds
            const amazonApiEndpointI: AmazonApiEndpoint = await getRepository<AmazonApiEndpoint>("AmazonApiEndpoint")
                .save(amazonApiEndpoint);

            amazonUser.amazonApiEndpoint = amazonApiEndpointI;
            await getRepository<AmazonApiEndpoint>("AmazonUser").save(amazonUser);
            // await connection.manager.save(amazonUser);

            resolve();
        } catch (err) {
            reject(err);
        }
    })
}

async function test() {
    try {
//        await dropTables();

        //let connection =
        await createConnection();

        await insertData();


        console.log("Start");

        let skillId = 'SkillID';

        let user: AmazonUser = await AmazonUser.getUserWithProactiveEndpoint('AmazonUser', skillId);

        console.log("User: " + inspect(user));

//        console.log(await AmazonUser.remove(user));
/*
            getRepository<AmazonApiEndpoint>("AmazonUser")
            .save(user);
*/
        console.log("Ready");
    } catch (err) {
        console.log(err);
    }
}

try {
    test();
} catch (err) {
    console.log(err);
}
/*
joinQueryBuilder
    .innerJoinAndMapOne(
        "user.cloudUser",
        CloudUser, "cloudUser",
        "cloudUser.id = user.cloudUserId"
    )
    .innerJoinAndMapOne(
        "user.amazonApiEndpoint",
        AmazonApiEndpoint, "amazonApiEndpoint",
        "amazonApiEndpoint.id = user.amazonApiEndpointId"
    )
    .where(
        "cloudUser.userName = :userName", { userName: userName }
    )
    .andWhere(
        "amazonApiEndpoint.applicationId = :skillId", { skillId: skillId }
    );
    */