import React from 'react';
import { mount } from '@cypress/react';
import App from '../App';

it('Renders main page', () => {
  mount(<App />);
  cy.get('span').contains('Drag & Drop to start editing!');
});