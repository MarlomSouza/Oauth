let db;

export default (injectedDBPool) => {
  db = injectedDBPool;

  return {
    saveUser: saveUser,
    getUser: getUser,
    existUser: existUser,
    saveAuthorizationCode: saveAuthorizationCode
  };
};

async function saveAuthorizationCode(authCode) {

  await db.collection('users').insertOne(authCode);
}

async function saveUser(username, password) {
  const insertedId = await db.collection('users').insertOne({ username, password });
  return insertedId;
}

async function existUser(username) {
  const userFound = await db.collection('users').findOne({
    username,
  });
  return userFound;
}

async function getUser(username, password) {
  const userFound = await db.collection('users').findOne({ username, password });
  return userFound;
}


async function getClient(username) {
  const userFound = await db.collection('client').findOne({ username });
  return userFound;
}

