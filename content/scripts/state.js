//import React from 'react/addons';
var React = require('react/addons');

//export default React.createClass({
module.exports = React.createClass({
    propTypes: {
        index: React.PropTypes.number.isRequired,
        label: React.PropTypes.string.isRequired,
        active: React.PropTypes.bool,
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
        accept: React.PropTypes.bool
    },

    render() {
        var classes = React.addons.classSet({
            state: true,
            'accept-state': this.props.accept,
            current: this.props.active
        });
        return (
            <g className={classes}>
                <circle r="25" cx={this.props.x} cy={this.props.y} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} />
                <text className="state-label" x={this.props.x} y={this.props.y + 5}>{this.props.label}</text>
            </g>
        );
    },

    mouseDown(e) {this.props.onMouseDown(this, e, this.props.index);}
});
