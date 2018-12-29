import React from 'react';
import Head from 'next/head';
import { withRouter } from 'next/router';
import { Flex, Box } from 'rebass/emotion';
import Layout from '../components/Layout/Layout';
import { MainContent } from '../components/Layout/Content';
import { Section, Text } from '../components/shared/styles/type';

class FAQ extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Layout canonical="/faq">
          <Head>
            <title>{'Frequently Asked Questions | Comic Cruncher'}</title>
          </Head>
          <MainContent>
            <Flex flexWrap={'wrap'} m={'30px auto'} p={3}>
              <Box width={[1]}>
                <Section.Title>
                  <h1>FAQ</h1>
                </Section.Title>
                <Text.Default>
                  <p>This is the FAQ page!</p>
                </Text.Default>
              </Box>
            </Flex>
          </MainContent>
        </Layout>
      </React.Fragment>
    );
  }
}

export default withRouter(FAQ);
