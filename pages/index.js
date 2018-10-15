import React from 'react';
import { css } from 'react-emotion';
import PropTypes from 'prop-types';
import axios from 'axios';
import CountUp from 'react-countup';
import Layout from '../components/Layout/Layout';
import Search from '../components/Search/Search';
import Head from 'next/head';

const myStyle = css`
  color: #ddd;
`;

class Home extends React.Component {
  render() {
    const s = this.props.data;
    return (
      <Layout>
        {/* How to render a title ...
          just import the head and use a title.
          You won't overwrite anything else set. */}
        <Head>
          <title>Comic Cruncher!!!</title>
        </Head>
        <p className={myStyle}>HELLO</p>
        <Search />
        <p>
          Total Characters: <CountUp end={s.total_characters} />
        </p>
        <p>
          Total Appearances: <CountUp end={s.total_appearances} />
        </p>
        <p>
          Total Issues: <CountUp end={s.total_issues} />
        </p>
        <p>
          From {s.min_year} to {s.max_year}
        </p>
      </Layout>
    );
  }
}

Home.getInitialProps = async ({ req }) => {
  const key = 'batmansmellsbadly';
  const res = await axios.get(`https://api.comiccruncher.com/stats?key=${key}`);
  return res.data;
};

Home.propTypes = {
  meta: PropTypes.shape({
    status_code: PropTypes.number,
    error: PropTypes.string,
  }),
  data: PropTypes.shape({
    total_characters: PropTypes.number,
    total_appearances: PropTypes.number,
    min_year: PropTypes.number,
    max_year: PropTypes.number,
    total_issues: PropTypes.number,
  }),
};

export default Home;
