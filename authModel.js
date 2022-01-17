let userDb;
let tokendDB;

export default (injectedUserDB, injectedTokenDb) => {
  userDb = injectedUserDB;
  tokendDB = injectedTokenDb;

  return {
    getClient: getClient,
    saveAccessToken: saveAccessToken,
    getUser: getUser,
    grantTypeAllowed: grantTypeAllowed,
    getAccessToken: getAccessToken,
  };
};

function getClient(clientID, clientSecret, cbFunc) {
  const client = {
    clientID,
    clientSecret,
    grants: null,
    redirectUris: null,
  };

  cbFunc(false, client);
}

function grantTypeAllowed(clientID, grantType, cbFunc) {
  cbFunc(false, true);
}

async function getUser(username, password, cbFunc) {
  await userDb.getUser(username, password);
}

async function saveAccessToken(accessToken, userId, expires, user, cbFunc) {
  await tokendDB.saveAccessToken(accessToken, userId);
}

async function getAccessToken(bearerToken, cbFunc) {
  const result = await tokendDB.getUserIDFromBearerToken(bearerToken);

  const accessToken = {
    user: {
      id: result.userId,
    },
    expires: null,
  };

  cbFunc(result.userId === null, result.userId === null ? null : accessToken);
}
