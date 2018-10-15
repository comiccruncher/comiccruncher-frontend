import React from 'react';
import Link from 'next/link';
import {UI} from '../shared/styles/colors';
import Dimensions from '../shared/styles/dimensions';
import Spacing from '../shared/styles/spacing';
import Type, { UIFontStack, BangersFontStack } from '../shared/styles/type';

const mainNav = {
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: UI.Border.Dark,
    backgroundColor: UI.Background.Yellow,
    position: 'absolute',
    top: Spacing.Small,
    left: Spacing.Small
};

const linkStyle = {
    color: UI.Text.Dark,
    textDecoration: 'none',
    fontFamily: UIFontStack,
    fontWeight: Type.Weight.Bold,
    padding: Spacing.Small,
    display: 'inline-block'
};

const Header = () => (
    <div style={mainNav}>
        <Link href="/">
            <a style={linkStyle}>Home</a>
        </Link>
        <Link href="/about">
            <a style={linkStyle}>About</a>
        </Link>
    </div>
);

export default Header;