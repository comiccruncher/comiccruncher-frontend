import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Flex, Box } from 'rebass/emotion';
import Layout from '../components/Layout/Layout';
import { MainContent } from '../components/Layout/Content';
import { Title, Text } from '../components/shared/styles/type';
import { TrackErrorWithEvent } from '../components/ga/Tracker';

const StatusCodes = [404, 304, 500];

const ErrorText = {
  404: {
    title: 'Page Not Found',
    content: 'Sorry, the page was not found.',
  },
  304: {
    title: 'Bad Request',
    content: 'Maybe try a different input.',
  },
  500: {
    title: 'Internal Server Error',
    content: 'There was something wrong with the server. The error has been logged.',
  },
};

export default class Error extends React.Component {
  static getInitialProps({ req, res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { status_code: statusCode, url: req ? req.originalUrl : null };
  }

  static propTypes = {
    url: PropTypes.string.isRequired,
    status_code: PropTypes.number.isRequired,
  };

  componentDidMount() {
    TrackErrorWithEvent(this.props.status_code, this.props.url);
  }

  render() {
    const { status_code } = this.props;
    const { title, content } = StatusCodes.includes(status_code) ? ErrorText[status_code] : ErrorText[500];
    return (
      <React.Fragment>
        <Head>
          <title>{title} | Comic Cruncher</title>
        </Head>
        <Layout>
          <MainContent>
            <Flex
              flexWrap="wrap"
              alignItems="center"
              alignContent="center"
              justifyContent="center"
              flexDirection="column"
              style={{ height: '420px' }}
            >
              <Box alignSelf="center" p={3}>
                <Title.Large>
                  <h1>{title}</h1>
                </Title.Large>
              </Box>
              <Text.Default>
                <p>{content}</p>
              </Text.Default>
            </Flex>
          </MainContent>
        </Layout>
      </React.Fragment>
    );
  }
}
