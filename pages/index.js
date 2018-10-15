import React from 'react';
import { css } from 'react-emotion';
import { Box, Flex } from '@rebass/grid/emotion';
import PropTypes from 'prop-types';
import axios from 'axios';
import CountUp from 'react-countup';
import Layout from '../components/Layout/Layout';
import {UI} from '../components/shared/styles/colors';
import Dimensions from '../components/shared/styles/dimensions';
import Spacing from '../components/shared/styles/spacing';
import Type, { Title, Section, Text } from '../components/shared/styles/type';
import Logo from '../components/shared/components/Logo';
import Search from '../components/Search/Search';
import HeaderSection from '../components/shared/components/HeaderSection';
import Head from 'next/head';

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
                <HeaderSection>
                    <Flex justifyContent='center' alignItems='center' alignContent='center' style={{height: '100%'}}>
                        <Box alignSelf='center'>
                            <Logo content="Comic Cruncher">Comic Cruncher</Logo>
                        </Box>
                    </Flex>
                </HeaderSection>
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
    const res = await axios.get('https://api.comiccruncher.com/stats?key=batmansmellsbadly');
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
