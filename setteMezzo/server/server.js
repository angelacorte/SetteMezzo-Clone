const express = require("express");
const cors = require("cors");
const app = express();
let bodyParser = require("body-parser");
//const routes = require('./routes/routes'); //we'll need it in the future

let corsOptions = {
  origin: "http://localhost:4200" //path for routes operation
};


app.use(cors(corsOptions));
/*let jsonParser = bodyParser.json();
let urlencodedParser = bodyParser.urlencoded({extended: false});*/

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Sette e Mezzo - start" });
});

// set port, listen for requests
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`); //localhost:5050 website path
});

//routes(app);
