import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import Link from 'next/link';
import { UI } from '../styles/colors';
import Size, { UIFontStack, Weight } from '../styles/type';
import Spacing from '../styles/spacing';
import Responsive from '../styles/responsive';
import Button from './Button';

const NavItemProps = PropTypes.arrayOf(
  PropTypes.shape({
    href: PropTypes.string.isRequired,
    displayText: PropTypes.string.isRequired,
    prefetch: PropTypes.bool,
    isActive: PropTypes.bool,
  })
);

const NavContainer = styled('div')({
  display: 'block',
});

const Nav = styled('nav')({
  position: 'absolute',
  top: '100%',
  left: 0,
  zIndex: 100,
  backgroundColor: UI.Background.White,
  paddingTop: Spacing.Tiny,
  paddingBottom: Spacing.Tiny,
  minWidth: Spacing.xxLarge * 4,
  '> ul': {
    'list-style-type': 'none',
    ' > li': {
      display: 'block',
    },
  },
  [Responsive.Mobile]: {
    width: '100%',
    margin: '0 auto',
  },
});

const NavLink = styled.a((props) => ({
  fontFamily: UIFontStack,
  color: UI.Text.Dark,
  fontSize: Size.Default,
  fontWeight: Weight.Bold,
  cursor: 'pointer',
  display: 'block',
  textAlign: 'center',
  paddingTop: Spacing.Tiny,
  paddingBottom: Spacing.Tiny,
  paddingLeft: Spacing.Small,
  paddingRight: Spacing.Small,
  textDecoration: props.isActive ? 'underline' : 'none',
  '&:hover': {
    textDecoration: 'underline',
    backgroundColor: UI.Background.Gray,
  },
}));

const NavItems = ({ showMenu, items, activeHref }) => (
  <React.Fragment>
    {showMenu && (
      <Nav>
        <ul>
          {items &&
            items.map((item, i) => {
              return (
                <li key={item.href}>
                  <Link href={item.href} prefetch={item.prefetch || false}>
                    <NavLink isActive={activeHref === item.href}>{item.displayText}</NavLink>
                  </Link>
                </li>
              );
            })}
        </ul>
      </Nav>
    )}
  </React.Fragment>
);

NavItems.propTypes = {
  activeHref: PropTypes.string,
  showMenu: PropTypes.bool,
  items: NavItemProps,
};

class MainNav extends React.Component {
  state = {
    showMenu: false,
  };

  handleClick = (e) => {
    e.preventDefault();
    this.setState((prevState) => ({ showMenu: !prevState.showMenu }));
  };

  render() {
    return (
      <NavContainer>
        <Button onClick={this.handleClick}>Menu &#9662;</Button>
        <NavItems showMenu={this.state.showMenu} items={this.props.items} activeHref={this.props.activeHref} />
      </NavContainer>
    );
  }
}

MainNav.propTypes = {
  activeHref: PropTypes.string,
  items: NavItemProps,
};

export default MainNav;
