"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.get('/', (req, res) => {
    res.send('Kareem Is The Best!');
});
app.get('/answer', (req, res) => {
    let dbURL = req.query.dbURL;
    let dbName = req.query.dbName;
    let dbUserName = req.query.dbUserName;
    let dbPass = req.query.dbPass;
    let question = req.query.question;
    //TODO send back the actual answer
    res.send('Kareem Is The Best!!');
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
//CHANGE TEST
