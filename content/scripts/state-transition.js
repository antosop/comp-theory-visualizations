"use strict";

import React from 'react';

export default StateTransition = React.createClass({
    propTypes: {
        active: React.PropTypes.bool.isRequired,
        startX: React.PropTypes.number.isRequired,
        startY: React.PropTypes.number.isRequired,
        endX: React.PropTypes.number.isRequired,
        endY: React.PropTypes.number.isRequired,
        input: React.PropTypes.string.isRequired
        }
    },

    render() {
        return (
            var classes = React.addons.classSet({
                transition: true,
                current: this.props.active
            });
            <path className={classes} d={this.calculatePath()}/>
        )
    },

    calculatePath() {
      var x1;
      var x2;
      var y1;
      var y2;
      var r = 25;
      var loop = true;
      if(this.props.startX !== this.props.endX || this.props.startY !== this.props.endY){
          loop = false;
          var dx = (startX - endX);
          var dy = (startY - endY);
          var m = Math.sqrt(dx*dx+dy*dy);
          var sign = dy > 0 ? 1 : -1;
          var a = sign*Math.acos(dx/m);
          x1 = startX+Math.cos(a-Math.PI/4) * 25;
          x2 = endX-Math.cos(a+Math.PI/4) * 25;
          y1 = statY+Math.sin(a-Math.PI/4) * 25;
          y2 = endY-Math.sin(a+Math.PI/4) * 25;
          r = m/1.75;
      } else {
          x1 = startX;
          x2 = startX - 25;
          y1 = startY - 25;
          y2 = startY;
      }

      return 'M' + x1 + ',' + y1 + 'A' + r + ',' + r + ' 0 '+ (loop?1:0) + ' '+ (loop?0:1) + ' ' + x2 + ',' + y2;

    }
});
