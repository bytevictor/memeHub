import React from 'react';
import { mount } from '@cypress/react';
import Editor from '../components/editor';

//To generate the file to drop
function dataURLtoFile(dataurl, filename) { 
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
      
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }

  let file = new File([u8arr], filename, {type:mime})

  return file
}

function dataTransferFileObject(files) {
  return {
    preventDefault: function() {},
    files: Array.isArray(files) ? files : [files]
  }
}

describe('Editor Tests', () => {
  it('should drop an image and load it', () => {
    mount(<Editor />);
    cy.get('span').contains('Drag & Drop to start editing!')
    cy.get('span').contains('Or press Ctrl + V to add from clipboard!')

    cy.readFile('src/test/mante.png', 'base64').then( (mante) =>{

      let base_64 = 'data:image/png;base64,' + mante
      let mante_file = dataURLtoFile(base_64, 'mante.png')
      let dataTransfer = dataTransferFileObject(mante_file)

      cy.get('.drop-container').trigger('drop', { dataTransfer }).then( () => {
        cy.get('canvas').invoke('width').should('greaterThan', 0)
        cy.get('.drop-container').should('not.exist')
      } )

    })

  })
})


