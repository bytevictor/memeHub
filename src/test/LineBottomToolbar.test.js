import React from 'react';
import { mount } from '@cypress/react';
import Editor from '../components/Editor';

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

describe('LineBottomToolbar tests', () => {
  it('should change the bottom toolbar', () => {
    mount(<Editor />);

    cy.readFile('src/test/mante.png', 'base64').then( (mante) =>{
      let base_64 = 'data:image/png;base64,' + mante
      let mante_file = dataURLtoFile(base_64, 'mante.png')
      let dataTransfer = dataTransferFileObject(mante_file)

      cy.get('.drop-container').trigger('drop', { dataTransfer }).then( () => {
        cy.wait(1000)
        cy.waitForReact()

        cy.get('#dashSelector').should('not.exist')

        cy.get('button[aria-label="FreeLine"]').click()

        cy.get('#dashSelector').should('exist')
      })
    })
  })
})
