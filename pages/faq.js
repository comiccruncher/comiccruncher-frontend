import React from 'react';
import Head from 'next/head';
import { Box } from 'rebass/emotion';
import Layout from '../components/Layout/Layout';
import { MainPageFlex, WithFooter } from '../components/Layout/Content';
import { Section, Text } from '../components/shared/styles/type';

const FAQ = () => (
  <Layout>
    <Head>
      <title>{'Frequently Asked Questions | Comic Cruncher'}</title>
    </Head>
    <WithFooter>
      <MainPageFlex>
        <Box width={[1]}>
          <Section.Title>
            <h1>FAQ</h1>
          </Section.Title>
          <Text.Default>This is the FAQ page!</Text.Default>
        </Box>
      </MainPageFlex>
    </WithFooter>
  </Layout>
);

export default FAQ;
