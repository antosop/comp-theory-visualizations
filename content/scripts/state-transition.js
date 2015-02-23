"use strict";

import React from 'react/addons';

export default React.createClass({
    propTypes: {
        active: React.PropTypes.bool.isRequired,
        startX: React.PropTypes.number.isRequired,
        startY: React.PropTypes.number.isRequired,
        endX: React.PropTypes.number.isRequired,
        endY: React.PropTypes.number.isRequired,
        input: React.PropTypes.string.isRequired
    },

    render() {
        var classes = React.addons.classSet({
            transition: true,
            current: this.props.active
        });
        return (
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
          var dx = (this.props.endX - this.props.startX);
          var dy = (this.props.endY - this.props.startY);
          var m = Math.sqrt(dx*dx+dy*dy);
          var sign = dy > 0 ? 1 : -1;
          var a = sign*Math.acos(dx/m);
          x1 = this.props.startX+Math.cos(a-Math.PI/4) * 25;
          x2 = this.props.endX-Math.cos(a+Math.PI/4) * 25;
          y1 = this.props.startY+Math.sin(a-Math.PI/4) * 25;
          y2 = this.props.endY-Math.sin(a+Math.PI/4) * 25;
          r = m/1.75;
      } else {
          x1 = this.props.startX;
          x2 = this.props.startX - 25;
          y1 = this.props.startY - 25;
          y2 = this.props.startY;
      }

      return 'M' + x1 + ',' + y1 + 'A' + r + ',' + r + ' 0 '+ (loop?1:0) + ' '+ (loop?0:1) + ' ' + x2 + ',' + y2;

    }
});
