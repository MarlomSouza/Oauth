let userDb;
let tokendDB;

export default (injectedUserDB, injectedTokenDb) => {
  userDb = injectedUserDB;
  tokendDB = injectedTokenDb;

  return {
    getClient: getClient,
    saveAccessToken: saveAccessToken,
    saveToken: saveToken,
    getUser: getUser,
    grantTypeAllowed: grantTypeAllowed,
    getAccessToken: getAccessToken,
    saveAuthorizationCode: saveAuthorizationCode,
  };
};

async function getClient(clientID, clientSecret, cbFunc) {
  console.log('getClient', clientID, clientSecret);
  const client = {
    id: 'application',
    clientId: 'application',
    clientSecret: 'secret',
    grants: null,
    redirectUris: null,
  };

  return client 
}

function grantTypeAllowed(clientID, grantType, cbFunc) {
  console.log('grantTypeAllowed');
  cbFunc(false, true);
  return true
}

async function saveAuthorizationCode(code, client, user) {
  console.log('Saving authorization code ', code, client, user);
  // imaginary DB queries
  let authCode = {
    authorization_code: code.authorizationCode,
    expires_at: code.expiresAt,
    redirect_uri: code.redirectUri,
    scope: code.scope,
    client_id: client.id,
    user_id: user.id,
  };

  await userDb.saveAuthorizationCode(authCode);
}

async function getUser(username, password, cbFunc) {
  console.log('get user');
  await userDb.getUser(username, password);
}

async function saveAccessToken(accessToken, userId, expires, user, cbFunc) {
  console.log('entrou aqui');
  await tokendDB.saveAccessToken(accessToken, userId);
}

async function getAccessToken(bearerToken, cbFunc) {
  console.log('get accessToken');

  const result = await tokendDB.getUserIDFromBearerToken(bearerToken);

  const accessToken = {
    user: {
      id: result.userId,
    },
    expires: null,
  };

  cbFunc(result.userId === null, result.userId === null ? null : accessToken);
}

async function saveToken(token, client, user, callback) {
  console.log('entrou aqui entao');
  token.client = {
    id: client.clientId,
  };

  token.user = {
    username: user.username,
  };

  var tokenInstance = new tokenModel(token);
  tokenInstance.save(
    function (callback, err, token) {
      if (!token) {
        console.error('Token not saved');
      } else {
        token = token.toObject();
        delete token._id;
        delete token.__v;
      }

      callback(err, token);
    }.bind(null, callback)
  );
}
