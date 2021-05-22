import React from 'react';
import { mount } from '@cypress/react';
import Editor from '../components/editor';

it('Renders Editor page', () => {
  mount(<Editor />);
  cy.get('span').contains('Drag & Drop to start editing!');
  cy.get('span').contains('Or press Ctrl + V to add from clipboard!');
});

