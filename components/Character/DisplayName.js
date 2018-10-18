import React from 'react';

// Shows the display name of the character.
export const DisplayName = (props) => props.name + (props.other_name ? ` (${props.other_name})` : '');
