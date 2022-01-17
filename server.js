import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import OAuth2Server from 'node-oauth2-server';
import Nullstack from 'nullstack';
import authModel from './authModel';
import Application from './src/Application';
import tokendb from './tokendb';
import userdb from './userdb';

const context = Nullstack.start(Application);
const { server, database } = context;
let userDB;
let tokenDB;

context.start = async function () {
  const { secrets, server } = context;
  const databaseClient = new MongoClient('mongodb://root:example@localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await databaseClient.connect();

  const database = await databaseClient.db('oauth');
  context.database = database;
  userDB = userdb(database);
  tokenDB = tokendb(database);
};

let auth = authModel(userdb(database), tokendb(database));
let oauthServer = new OAuth2Server({ model: auth, grants: ['password'], debug: true });

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.post('/signin', async (req, res) => {
  console.log(oauthServer.authorise(req, res));
  const existUser = await userDB.existUser(req.body.username);
  if (existUser) return res.status(409).send('user already exists');
  
  // const response = await userDB.saveUser(req.body.username, req.body.password);
  // res.status(201).send(response);
});

server.get('/login', (req, res) => {
  console.log('auth', a);
  console.log('grant', oauthServer.grant(req, res));
  res.send('ok');
});


export default context;
