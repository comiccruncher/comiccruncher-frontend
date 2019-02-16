import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Layout from '../components/Layout/Layout';
import { WithFooter, CenterWrap } from '../components/Layout/Content';
import { Title } from '../components/shared/styles/type';
import ErrorDisplayTracker from '../components/shared/components/Error';

const StatusCodes = [401, 404, 304, 500];

const ErrorText = {
  404: {
    title: 'Page Not Found',
    content: 'Sorry, the page was not found.',
  },
  304: {
    title: 'Bad Request',
    content: 'Maybe try a different input.',
  },
  401: {
    title: 'Whoops',
    content: 'Cookies are needed for the site to function properly. Try refreshing the page or clearing your cookies.',
  },
  500: {
    title: 'Whoops',
    content: 'Something happened on our end. The error has been logged.',
  },
};

const Error = ({ status_code }) => {
  const { title, content } = StatusCodes.includes(status_code) ? ErrorText[status_code] : ErrorText[500];
  return (
    <Fragment>
      <Head>
        <title>{title} | Comic Cruncher</title>
      </Head>
      <Layout>
        <WithFooter>
          <CenterWrap>
            <Title.Large style={{ textAlign: 'center' }}>
              <h1>{title}</h1>
            </Title.Large>
            <ErrorDisplayTracker status_code={status_code} error={content} />
          </CenterWrap>
        </WithFooter>
      </Layout>
    </Fragment>
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
