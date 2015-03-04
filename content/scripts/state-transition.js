//import React from 'react/addons';
var React = require('react/addons');

//export default React.createClass({
module.exports = React.createClass({
    propTypes: {
        index: React.PropTypes.number.isRequired,
        active: React.PropTypes.bool.isRequired,
        startX: React.PropTypes.number.isRequired,
        startY: React.PropTypes.number.isRequired,
        endX: React.PropTypes.number.isRequired,
        endY: React.PropTypes.number.isRequired,
        input: React.PropTypes.string.isRequired,
        arcDepth: React.PropTypes.number,
        special: React.PropTypes.bool,
        edit: React.PropTypes.bool
    },

    render() {
        var classes = React.addons.classSet({
            transition: true,
            current: this.props.active,
            edit: this.props.edit
        });

        var labelClasses = React.addons.classSet({
            'transition-label': true,
            'special': this.props.special
        });

        var data = this.calculateData();
        return (
            <g className={classes}>
                <path d={data.pathData}/>
                <circle className="label-container" r="12" cx={data.midX} cy={data.midY} onMouseDown={this.mouseDown} onClick={this.clicked}/>
                <text className={labelClasses} x={data.midX} y={data.midY + 5}>{this.props.input}</text>
            </g>
        );
    },

    mouseDown(e) {this.props.onMouseDown(this, e, this.props.index);},
    clicked(e) {this.props.onClick(this, e, this.props.index);},

    calculateData() {
        var returnData = {};
        var stateRadius = 25;
        var x1;
        var x2;
        var y1;
        var y2;
        var radius = stateRadius;
        var largeArc = true;
        var sweep = false;
        var arcToString;
        var lineToString;
        if(this.props.startX !== this.props.endX || this.props.startY !== this.props.endY){
            var dx = (this.props.endX - this.props.startX);
            var dy = (this.props.endY - this.props.startY);
            var distance = Math.sqrt( dx * dx + dy * dy );
            var sign = dy > 0 ? 1 : -1;
            var direction = sign * Math.acos( dx / distance );
            if (this.props.arcDepth && Math.abs(this.props.arcDepth) >= 1) {
                radius = (Math.pow(distance / 2, 2) + Math.pow(this.props.arcDepth, 2)) / (2 * Math.abs(this.props.arcDepth));
                var pastThreshold = Math.abs(this.props.arcDepth) > radius;
                sweep = this.props.arcDepth < 0;
                var radiusAngle = Math.acos(distance / (2 * radius));
                var stateRadiusAngle = Math.acos(stateRadius / (2 * radius));
                var angle = pastThreshold ? stateRadiusAngle + radiusAngle : stateRadiusAngle - radiusAngle;
                angle = sweep ? angle : -angle;
                x1 = this.props.startX + Math.cos( direction - angle ) * stateRadius;
                x2 = this.props.endX - Math.cos( direction + angle ) * stateRadius;
                y1 = this.props.startY + Math.sin( direction - angle ) * stateRadius;
                y2 = this.props.endY - Math.sin( direction + angle ) * stateRadius;

                largeArc = (Math.abs(this.props.arcDepth) - stateRadius) > radius;
                arcToString = 'A' + radius + ',' + radius + ' 0 ' + ( largeArc ? 1 : 0 ) + ' ' + ( sweep ? 1 : 0 ) + ' ' + x2 + ',' + y2;
                returnData.midX = this.props.startX + (dx / 2) + ((-dy) / distance) * this.props.arcDepth;
                returnData.midY = this.props.startY + (dy / 2) + ((dx) / distance) * this.props.arcDepth;
            } else {
                x1 = this.props.startX + Math.cos( direction ) * stateRadius;
                x2 = this.props.endX - Math.cos( direction ) * stateRadius;
                y1 = this.props.startY + Math.sin( direction ) * stateRadius;
                y2 = this.props.endY - Math.sin( direction ) * stateRadius;
                lineToString = 'L' + x2 + ',' + y2;
                returnData.midX = this.props.startX + dx / 2;
                returnData.midY = this.props.startY + dy / 2;
            }
        } else {
            x1 = this.props.startX;
            x2 = this.props.startX - stateRadius;
            y1 = this.props.startY - stateRadius;
            y2 = this.props.startY;
            arcToString = 'A' + radius + ',' + radius + ' 0 ' + ( largeArc ? 1 : 0 ) + ' ' + ( sweep ? 1 : 0 ) + ' ' + x2 + ',' + y2;

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
