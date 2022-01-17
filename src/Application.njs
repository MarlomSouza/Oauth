import Nullstack from 'nullstack';
import './Application.scss';
import Home from './Home';
import Register from './Register.njs';
import User from './User.njs';
import ValidadeUser from './ValidadeUser.njs';

class Application extends Nullstack {
  prepare({ page, database }) {
    page.locale = 'en-US';

  }

  render() {
    return (
      <main class="h-screen">
        <Home route="/" />
        <Register route="/register" />
        <ValidadeUser route="/validade" />
        <User route="/user" />
      </main>
    );
  }
}

export default Application;
