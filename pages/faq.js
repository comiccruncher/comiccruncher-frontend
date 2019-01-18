import React from 'react';
import Head from 'next/head';
import { Flex, Box } from 'rebass/emotion';
import Layout from '../components/Layout/Layout';
import { MainContent } from '../components/Layout/Content';
import { Section, Text } from '../components/shared/styles/type';

const FAQ = () => (
  <Layout>
    <Head>
      <title>{'Frequently Asked Questions | Comic Cruncher'}</title>
    </Head>
    <MainContent>
      <Flex flexWrap={'wrap'} m={'30px auto'} p={3}>
        <Box width={[1]}>
          <Section.Title>
            <h1>FAQ</h1>
          </Section.Title>
          <Text.Default>This is the FAQ page!</Text.Default>
        </Box>
      </Flex>
    </MainContent>
  </Layout>
);

export default FAQ;
