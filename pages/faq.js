import React from 'react';
import Head from 'next/head';
import { Box } from 'rebass/emotion';
import Layout from '../components/Layout/Layout';
import { MainPageFlex, WithFooter } from '../components/Layout/Content';
import { Section, Text, Title } from '../components/shared/styles/type';
import { OutboundLink } from 'react-ga';

const FAQ = () => (
  <Layout canonical="/faq">
    <Head>
      <title>{'Frequently Asked Questions | Comic Cruncher'}</title>
    </Head>
    <WithFooter>
      <MainPageFlex>
        <Box width={[1]}>
          <Section.Title>
            <h1>FAQ</h1>
          </Section.Title>
          <Title.Medium>
            <h2>What counts as an appearance for a character?</h2>
          </Title.Medium>
          <Text.P>
            Variants, reprints, 2nd printings, ashcans, and magazines do not count as an appearance for a character.
          </Text.P>
          <Text.P>
            Standard issues, original graphic novels, and prestige issues count as appearances, as well as issues by
            other publishers for characters, such as crossovers or when Marvel was named Timely Comics.
          </Text.P>
          <Title.Medium>
            <h2>What counts as an alternate reality for a character?</h2>
          </Title.Medium>
          <Text.P>
            For Marvel, any appearance for a character that is not their main 616 counterpart is considered an alternate
            reality appearance.
          </Text.P>
          <Text.P>
            For DC, it's a little complicated because the main universe changes frequently, so the current, main
            universe of DC counts as its main universe, and the rest count as alternate realities.
          </Text.P>
          <Title.Medium>
            <h2>How accurate is the information?</h2>
          </Title.Medium>
          <Text.P>
            The trend for the graph of the character's appearances is going to be more accurate than the absolute number
            of issues that a character has actually appeared in. But if anything missing, it would be very small cameo
            or background appearances in which the character doesn't even talk.
          </Text.P>
          <Title.Medium>
            <h2>What technologies does the site use?</h2>
          </Title.Medium>
          <Text.P>
            The backend responsible for gathering all the issues and serving the character info is written in Golang and
            uses Postgres and Redis for persistence.
          </Text.P>
          <Text.P>
            The frontend is a React app with NextJS and Node. It communicates with the Golang REST API that efficiently
            serves the character data!
          </Text.P>
          <Text.P>
            <OutboundLink eventLabel="faq aimee" to="https://twitter.com/aimeelaplant">
              Aimee
            </OutboundLink>{' '}
            built the backend and logic for gathering the appearances and character data. The frontend was designed by{' '}
            <OutboundLink eventLabel="faq ghanbak" to="https://twitter.com/ghanbak">
              Ethan
            </OutboundLink>{' '}
            and developed by Aimee, Ethan, and a little React help from{' '}
            <OutboundLink eventLabel="faq ying" to="https://twitter.com/yinghang">
              Ying
            </OutboundLink>
            !
          </Text.P>
          <Text.P>
            If you have an idea or want to contribute, send in an issue on GitHub for the{' '}
            <OutboundLink eventLabel="faq backend" to="https://github.com/aimeelaplant/comiccruncher">
              backend
            </OutboundLink>{' '}
            or the{' '}
            <OutboundLink eventLabel="faq frontend" to="https://github.com/aimeelaplant/comiccruncher-frontend">
              frontend
            </OutboundLink>
            !
          </Text.P>
          <Title.Medium>
            <h2>Where did you get all the character data from?</h2>
          </Title.Medium>
          <Text.P>
            The Golang application efficiently scrapes multiple APIs and websites to gather the character and issue
            data.
          </Text.P>
          <Text.P>Individual Marvel and DC characters were populated from the Marvel API and DC website.</Text.P>
          <Text.P>
            The actual issue data for the characters comes from multiple sources and match closely with comicbookdb.com,
            the Marvel Wikia, and comics.org.
          </Text.P>
        </Box>
        <Title.Medium>
          <h1>What is your privacy policy?</h1>
        </Title.Medium>
        <Text.P>
          This site uses cookies and Google Analytics. Cookies are needed for the site to function properly. Google
          Analytics collects anonymous site usage data. If you would like to opt out Google Analytics, you may do so{' '}
          <OutboundLink eventLabel="ga opt-out" to="https://tools.google.com/dlpage/gaoptout">
            here
          </OutboundLink>
          .
        </Text.P>
        <Text.P>This site makes no money and is for fun only.</Text.P>
      </MainPageFlex>
    </WithFooter>
  </Layout>
);

export default FAQ;
