let bodyParser = require("body-parser");
const express = require('express');
export const app = express();
import {db} from './models/db.index';
import {PORT} from "./server";

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

app.get('/', (req:any,res:any) =>{
    res.status(200).send("Root path");
});

db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((res:any)=>{
    res.status(201).send("Connected to database.");
}).catch((res:any, err:any)=>{
    res.status(403).send(err);
    process.exit();
});