//TODO server-side tests
const request = require('supertest');
const dbIndex = require('../../src/models/db.index');

const {MongoClient} = require('mongodb');


describe('My Server', ()=>{

    it.todo('Accepts client connections');

})

describe('database related tests', ()=>{

    beforeAll( async () =>{
        await dbIndex.connectDB();
    });

    afterAll( async () => {
        await dbIndex.disconnectDB();
    });

    it.todo('Make db requests');

})

