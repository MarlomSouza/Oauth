import Nullstack from 'nullstack';
import userdb from '../userdb';

class User extends Nullstack {
  token = {
    _id: '',
    username: '',
    password: '',
  };

  static async getUserFromToken({ database, username, password }) {
    const userFound = await userdb(database).getUser(username, password);
    return userFound;
  }

  async logIn() {
    this.loggedIn = false;
    const user = await this.getUser({ username: this.user.username, password: this.user.password });
    if (!user) return (this.error = 'User not found');

    const { _id, username } = user;
    this.loggedIn = true;
    this.me = {
      _id,
      username,
    };
  }
  render() {
    return (
      <div>
        {this.error && <p> {this.error} </p>}

        <div>
          <label>Get User</label>
          {this.loggedIn && (
            <p>
              {this.me._id} - {this.me.username}{' '}
            </p>
          )}
          <div>
            <label for="username">Username: </label>
            <input type="text" placeholder="Username" bind={this.user.username} />
          </div>
          <div>
            <label for="password">Password: </label>
            <input type="password" placeholder="Password" bind={this.user.password} />
          </div>
          <button type="button" onclick={this.logIn}>
            Log In
          </button>
        </div>
      </div>
    );
  }
}

export default User;
