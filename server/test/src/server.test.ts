//TODO server-side tests
const request = require('supertest');
const dbIndex = require('../../src/models/db.index');

const {MongoClient} = require('mongodb');


describe('My Server', ()=>{

    it.todo('Accepts client connections');

})

/*describe('database related tests', ()=>{

    let connection:any;
    let db;

    /!*beforeAll( async () =>{
        connection = await MongoClient.connect(dbIndex.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = await connection.db(dbIndex.__DB_NAME__)
    });

    afterAll( async () => {
        await connection.close();
    });*!/

    test("connection to db", done =>{
        it.todo('Make db requests');
    })
})*/

