import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import styled from 'react-emotion';
import { FullCharacterProps } from './Types';
import FullCharacter from './FullCharacter';
import Button from '../shared/components/Button';
import Spacing from '../shared/styles/spacing';

Modal.setAppElement('#__next');

const StyledButton = styled(Button)({
  position: 'absolute',
  top: Spacing.Small,
  right: Spacing.Small,
  zIndex: 20,
});

const CharacterModal = ({ handleModalCloseRequest, character, isOpen }) => {
  return (
    <Modal
      closeTimeoutMS={300}
      className="Modal"
      overlayClassName="Overlay"
      id={character ? character.slug : 1}
      onRequestClose={handleModalCloseRequest}
      isOpen={isOpen}
      shouldCloseOnOverlayClick={true}
    >
      <StyledButton onClick={handleModalCloseRequest}>Close</StyledButton>
      {isOpen && <FullCharacter character={character} showFooterText={false} />}
    </Modal>
  );
};

CharacterModal.propTypes = {
  handleModalCloseRequest: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  character: FullCharacterProps,
};

export default CharacterModal;
