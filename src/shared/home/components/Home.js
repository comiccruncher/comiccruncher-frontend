import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Search from '../../search/components/Search';

// TODO: figure out why component doesn't render when using client-side route.
// https://github.com/supasate/connected-react-router
// https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md
class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>Search for something</h1>
        <Search />
        <p>Home</p>
        <ul>
          <li>
            <Link
              to="/characters/batman"
              onClick={() => this.props.pushRoute('/characters/batman')}
            >
              Batman
            </Link>
          </li>
          <li>
            <Link
              to="/characters/jean-grey"
              onClick={() => this.props.pushRoute('/characters/jean-grey')}
            >
              Jean Grey
            </Link>
          </li>
          <li>
            <Link
              to="/characters/falcon"
              onClick={() => this.props.pushRoute('/characters/falcon')}
            >
              Falcon
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(Home);
