import React, { Component } from 'react';

class LineaCentrado extends Component {
    render() {
        const { x, y, visible, isHorizontal, color } = this.props;
    
        const lineStyle = {
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${isHorizontal ? x : 0}px, ${isHorizontal ? 0 : y}px)`,
          width: isHorizontal ? '100%' : '1px',
          height: isHorizontal ? '1px' : '100%',
          backgroundColor: color ? color : '#2196f3',
          display: visible ? 'block' : 'none'
        };
    
        return (
          <div style={lineStyle}></div>
        );
    }
}

export default (LineaCentrado);
