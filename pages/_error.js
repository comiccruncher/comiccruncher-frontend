import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Flex, Box } from 'rebass/emotion';
import Layout from '../components/Layout/Layout';
import { WithFooter, MainPageFlex } from '../components/Layout/Content';
import { Title } from '../components/shared/styles/type';
import ErrorDisplayTracker from '../components/shared/components/Error';

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

const Error = ({ status_code }) => {
  const { title, content } = StatusCodes.includes(status_code) ? ErrorText[status_code] : ErrorText[500];
  return (
    <React.Fragment>
      <Head>
        <title>{title} | Comic Cruncher</title>
      </Head>
      <Layout>
        <WithFooter>
          <MainPageFlex>
            <Box alignSelf="center" p={3}>
              <Title.Large>
                <h1>{title}</h1>
              </Title.Large>
              <ErrorDisplayTracker status_code={status_code} error={content} />
            </Box>
          </MainPageFlex>
        </WithFooter>
      </Layout>
    </React.Fragment>
  );
};

Error.propTypes = {
  status_code: PropTypes.number.isRequired,
};

Error.getInitialProps = async ({ req, res, err }) => {
  const status_code = res ? res.statusCode : err ? err.statusCode : null;
  return { status_code: status_code };
};

export default Error;
