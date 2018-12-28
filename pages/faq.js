import React from 'react';
import { withRouter } from 'next/router';
import { Flex, Box } from 'rebass/emotion';
import Layout from '../components/Layout/Layout';
import { MainContent } from '../components/Layout/Content';
import { Section, Text } from '../components/shared/styles/type';

class FAQ extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Layout title={'Frequently Asked Questions | Comic Cruncher'} canonical="/faq">
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
