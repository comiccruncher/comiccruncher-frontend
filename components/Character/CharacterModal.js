import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { FullCharacterProps } from './Types';
import FullCharacter from './FullCharacter';
import Button from '../shared/components/Button';
import Spacing from '../shared/styles/spacing';

Modal.setAppElement('#__next');

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
      <Button
        onClick={handleModalCloseRequest}
        style={{ position: 'absolute', top: Spacing.Small, right: Spacing.Small, zIndex: 20 }}
      >
        Close
      </Button>
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
