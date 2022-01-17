import Nullstack from 'nullstack';

class ValidadeUser extends Nullstack {
  username = '';
  validUser = false;

  async validadeUser() {
    this.validUser = false;
    const user = await this.isValidUser({ name: this.username });
    if (!user) return (this.error = 'User not valid');

    this.validUser = true;
  }

  static async isValidUser({ database, name }) {
    const userFound = await database.collection('users').findOne({
      name,
    });

    return userFound != null;
  }

  render() {
    return (
      <>
        <div>
          <label>Is a valid User {this.validUser}</label>
          {this.error && <p> {this.error} </p>}
          <div>
            <label for="username">username</label>
            <input type="text" placeholder="Username" bind={this.username} />
          </div>
          <button type="button" onclick={this.validadeUser}>
            Validade
          </button>
        </div>
      </>
    );
  }
}

export default ValidadeUser;
