let db;

export default (injectedDBPool) => {
  db = injectedDBPool;

  return {
    saveUser: saveUser,
    getUser: getUser,
    existUser: existUser,
  };
};

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
