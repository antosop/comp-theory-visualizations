//import React from 'react/addons';
var React = require('react/addons');

//export default React.createClass({
module.exports = React.createClass({
    propTypes: {
        active: React.PropTypes.bool.isRequired,
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
            <circle className={classes} r="25" cx={this.props.x} cy={this.props.y} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} />
        );
    },

    mouseDown(e) {this.props.onMouseDown(this, e);},
    mouseUp(e) {this.props.onMouseUp(this, e);}
});
