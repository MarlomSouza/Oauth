import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import Nullstack from 'nullstack';
import Request from 'oauth2-server/lib/request';
import Response from 'oauth2-server/lib/response';
import OAuth2Server from 'oauth2-server/lib/server';
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
let oauthServer = new OAuth2Server({
  model: auth,
  accessTokenLifetime: 60 * 60,
  allowBearerTokensInQueryString: true,
});
server.oauth = oauthServer;

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.post('/signin', async (req, res) => {
  const existUser = await userDB.existUser(req.body.username);
  if (existUser) return res.status(409).send('user already exists');

  // const response = await userDB.saveUser(req.body.username, req.body.password);
  // res.status(201).send(response);
});

server.post('/oauth/token', obtainToken);

server.get('/login', (req, res) => {
  res.send('ok');
});

server.get('/', authenticateRequest, function (req, res) {
  res.send('Congratulations, you are in a secret area!');
});

function obtainToken(req, res) {
  var request = new Request(req);
  var response = new Response(res);

  return server.oauth
    .authorize(request, response)
    .then(function (token) {
      res.json(token);
    })
    .catch(function (err) {
      res.status(err.code || 500).json(err);
    });
}

function authenticateRequest(req, res, next) {
  var request = new Request(req);
  var response = new Response(res);

  return server.oauth
    .authenticate(request, response)
    .then(function (token) {
      debug('the request was successfully authenticated');

      next();
    })
    .catch(function (err) {
      res.status(err.code || 500).json(err);
    });
}

export default context;
