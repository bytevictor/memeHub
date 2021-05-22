import React from 'react';
import { mount } from '@cypress/react';
import App from '../App';

it('Renders main page', () => {
  mount(<App />);
  cy.get('a').contains('EDITOR');
});