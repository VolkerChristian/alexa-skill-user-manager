import { createConnection, Connection } from "typeorm";
import { inspect } from 'util';
import {
    AmazonUser,
    AmazonApiEndpoint,
    getAmazonUserRepository,
    getAmazonApiEndpointRepository,
    getEntities,
    setConnection
} from './';


export function connect() : Promise<Connection> {
    return createConnection({
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

/*
function dropTables() {
    return new Promise(async function (resolve, reject) {
        console.log("Start Drop Tables");
        try {
            let connection = await connect();
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
*/

function insertData() {
    return new Promise(async function (resolve, reject) {
        console.log("Start Insert Data");
        try {
            /*
            const amazonUser = new AmazonUser();
            amazonUser.accountLinked = true;
            amazonUser.proactivePermission = true;
            amazonUser.apiEndpoint = "Hallo Du";
            amazonUser.apiAccessToken = "AccessToken";
            amazonUser.applicationId = "SkillID";
            amazonUser.userId = "AmazonUser";
            amazonUser.created = new Date();
            await getAmazonUserRepository().save(amazonUser);
*/
            const amazonApiEndpoint = new AmazonApiEndpoint("SkillID");
            amazonApiEndpoint.apiAccessToken = "AccessToken";
            amazonApiEndpoint.tokenType = "Bearer";
            amazonApiEndpoint.created = new Date();
            amazonApiEndpoint.expires = new Date(Date.now() + 100000); // +100 Seconds

            const amazonApiEndpointI: AmazonApiEndpoint = await getAmazonApiEndpointRepository().save(amazonApiEndpoint);
            
//            amazonUser.amazonApiEndpoint = amazonApiEndpointI;
//            await getAmazonUserRepository().save(amazonUser);

            resolve();
        } catch (err) {
            reject(err);
        }
    })
}


connect()
    .then(async connection => {
        setConnection(connection);

        await insertData();

        console.log("Start");

        let skillId = 'SkillID';

        let user: AmazonUser = await getAmazonUserRepository().getUserWithProactiveEndpoint('AmazonUser', skillId);

        console.log("User: " + inspect(user));

        console.log(await getAmazonUserRepository().remove(user));

        console.log("Ready");
    }).catch(err => {
        console.log(err);
    });


/*
async function test() {
    try {
        //        await dropTables();

        //let connection =
        let connection = await connect();
        setConnection(connection);

        //        await insertData();


        console.log("Start");

        let skillId = 'SkillID';

        let user: AmazonUser = await getAmazonUserRepository().getUserWithProactiveEndpoint('AmazonUser', skillId);

        console.log("User: " + inspect(user));

        //        console.log(await AmazonUser.remove(user));

        //        getRepository<AmazonApiEndpoint>("AmazonUser")
        //            .save(user);

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

*/

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