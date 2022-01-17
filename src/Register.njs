import Nullstack from 'nullstack';
import userdb from '../userdb';

class Register extends Nullstack {
  user = {
    _id: '',
    name: '',
    password: '',
  };

  error = null;

  static async create({ database, name, password }) {
    const insertedId = await userdb(database).saveUser(name, password);
    return insertedId;
  }

  async handleSubmit() {
    const insertedId = await this.create({ name: this.user.name, password: this.user.password });
    console.log('Save', insertedId);
  }

  render() {
    return (
      <div class="w-full h-full flex text-black">
        {this.error && <p> {this.error} </p>}

        <label>Register</label>
        <form onsubmit={this.handleSubmit}>
          <div>
            <label for="username">username</label>
            <input type="text" id="username" placeholder="Username" name="username" bind={this.user.name} />
          </div>
          <div>
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Password" name="password" bind={this.user.password} />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default Register;
