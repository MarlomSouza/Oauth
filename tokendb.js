let db;

export default (injectedDBPool) => {
  db = injectedDBPool;

  return {
    saveAccessToken: saveAccessToken,
    getUserIDFromBearerToken: getUserIDFromBearerToken,
  };
};

async function saveAccessToken(accessToken, userId) {
  const insertedId = await db.collection('access_tokens').insertOne({ accessToken, userId });
  return insertedId;
}

async function getUserIDFromBearerToken(accessToken) {
  const userFound = await db.collection('accessToken').findOne({ accessToken });
  return userFound;
}
