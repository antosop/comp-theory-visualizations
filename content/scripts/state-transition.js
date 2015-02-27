//import React from 'react/addons';
var React = require('react/addons');

//export default React.createClass({
module.exports = React.createClass({
    propTypes: {
        active: React.PropTypes.bool.isRequired,
        startX: React.PropTypes.number.isRequired,
        startY: React.PropTypes.number.isRequired,
        endX: React.PropTypes.number.isRequired,
        endY: React.PropTypes.number.isRequired,
        input: React.PropTypes.string.isRequired,
        special: React.PropTypes.bool
    },

    render() {
        var classes = React.addons.classSet({
            transition: true,
            current: this.props.active
        });

        var labelClasses = React.addons.classSet({
            'transition-label': true,
            'special': this.props.special
        });

        var data = this.calculateData();
        return (
            <g className={classes}>
                <path d={data.pathData}/>
                <circle className="label-container" r="12" cx={data.midX} cy={data.midY}/>
                <text className={labelClasses} x={data.midX} y={data.midY + 5}>{this.props.input}</text>
            </g>
        );
    },

    calculateData() {
        var returnData = {};
        var stateRadius = 25;
        var x1;
        var x2;
        var y1;
        var y2;
        var radius = stateRadius;
        var loop = true;
        var arcToString;
        var lineToString;
        if(this.props.startX !== this.props.endX || this.props.startY !== this.props.endY){
            loop = false;
            var dx = (this.props.endX - this.props.startX);
            var dy = (this.props.endY - this.props.startY);
            var distance = Math.sqrt( dx * dx + dy * dy );
            var sign = dy > 0 ? 1 : -1;
            var direction = sign * Math.acos( dx / distance );
            if (this.props.arcDepth && this.props.arcDepth >= 1) {
                radius = (Math.pow(distance / 2, 2) + Math.pow(this.props.arcDepth)) / (2 * this.props.ardDepth);
                var angle = Math.acos(distance / (2 * radius)) - Math.acos(stateRadius / (2 * radius));
                x1 = this.props.startX + Math.cos( direction - angle ) * stateRadius;
                x2 = this.props.endX - Math.cos( direction + angle ) * stateRadius;
                y1 = this.props.startY + Math.sin( direction - angle ) * stateRadius;
                y2 = this.props.endY - Math.sin( direction + angle ) * stateRadius;
                arcToString = 'A' + radius + ',' + radius + ' 0 ' + ( loop ? 1 : 0 ) + ' ' + ( loop ? 0 : 1 ) + ' ' + x2 + ',' + y2;
                returnData.midX = this.props.startX + (dx / 2) + ((-dy) / distance) * this.props.arcDepth;
                returnData.midY = this.props.startY + (dy / 2) + ((dx) / distance) * this.props.arcDepth;
            } else {
                x1 = this.props.startX + Math.cos( direction ) * stateRadius;
                x2 = this.props.endX - Math.cos( direction ) * stateRadius;
                y1 = this.props.startY + Math.sin( direction ) * stateRadius;
                y2 = this.props.endY + Math.sin( direction ) * stateRadius;
                lineToString = 'L' + x2 + ',' + y2;
                returnData.midX = this.props.startX + dx / 2;
                returnData.midY = this.props.startY + dy / 2;
            }
        } else {
            x1 = this.props.startX;
            x2 = this.props.startX - stateRadius;
            y1 = this.props.startY - stateRadius;
            y2 = this.props.startY;
            arcToString = 'A' + radius + ',' + radius + ' 0 ' + ( loop ? 1 : 0 ) + ' ' + ( loop ? 0 : 1 ) + ' ' + x2 + ',' + y2;

            var diffX = x2 - x1;
            var diffY = y2 - y1;
            var dist = Math.sqrt( diffX * diffX + diffY * diffY );
            var perpDist = stateRadius + Math.sqrt( Math.pow(stateRadius, 2) - Math.pow(dist / 2, 2));
            returnData.midX = x1 + ( diffX / 2 ) + ((-diffY) / dist) * perpDist;
            returnData.midY = y1 + ( diffY / 2 ) + ((diffX) / dist) * perpDist;
        }
        returnData.pathData = 'M' + x1 + ',' + y1 + (arcToString || lineToString);
        return returnData;
    }
});
