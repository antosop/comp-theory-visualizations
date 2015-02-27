var _ = require('lodash');
var React = require('react/addons');

var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Tooltip = require('react-bootstrap').Tooltip;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var StateTransition = require('./state-transition');
var StateMachineState = require('./state.js');

module.exports = React.createClass({
    render() {
        return (
            <div id="state-machine" tabIndex="3" onKeyDown={this.keyDown} onKeyPress={this.stringChanged}>
                <div id="buttons">
                    <ButtonToolbar>
                        <ButtonGroup>
                            <OverlayTrigger placement="left" overlay={
                                    <Tooltip placement="left" right="25px">restart</Tooltip>
                                } delayShow={300} delayHide={150}>
                                <Button id="refresh" onMouseOver={this.mouseOver} onClick={this.restart}>
                                    <Glyphicon glyph="refresh" />
                                </Button>
                            </OverlayTrigger>
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
                <svg id="state-machine-graph" onMouseMove={this.mouseMove}>
                    <defs dangerouslySetInnerHTML={{__html:
                        '<marker ' +
                            'id="triangle" ' +
                            'viewBox="0 0 10 10" ' +
                            'refX="9" refY="5" ' +
                            'markerUnits="strokeWidth" ' +
                            'markerWidth="8" ' +
                            'markerHeight="6" ' +
                            'orient="auto"' +
                        '>' +
                            '<path d="M 0 0 L 10 5 L 0 10 z" />' +
                        '</marker>' +
                        '<marker ' +
                            'id="triangle-selected" ' +
                            'viewBox="0 0 10 10" ' +
                            'refX="9" refY="5" ' +
                            'markerUnits="strokeWidth" ' +
                            'markerWidth="8" ' +
                            'markerHeight="6" ' +
                            'orient="auto"' +
                        '>' +
                            '<path d="M 0 0 L 10 5 L 0 10 z" />' +
                        '</marker>'}}>
                    </defs>
                    <g id="transitions">
                        //{_.flatten(this.state.transitions).map(this.mapStateTransition)}
                        {_.flatten(this.state.transitions).map(t => {
                            var isActive = _.includes(this.state.activeStates, t.fromState);
                            var startState = this.state.states[t.fromState];
                            var endState = this.state.states[t.toState];
                            var special = null;
                            if (_.has(this.state.replacementCharacters, t.input)){
                                special = this.state.replacementCharacters[t.input];
                            }
                            return (<StateTransition
                                active={isActive}
                                startX={startState.x}
                                startY={startState.y}
                                endX={endState.x}
                                endY={endState.y}
                                input={special || t.input}
                                special={special !== null}
                            />);
                        })}
                    </g>
                    <g id="states">
                        {this.state.states.map((s, i) =>
                            <StateMachineState
                                key={'state' + i}
                                x={s.x}
                                y={s.y}
                                accept={s.isAcceptState}
                                active={_.includes(this.state.activeStates, i)}
                                label={'' + i}
                                onMouseDown={this.stateMouseDown}
                                onMouseUp={this.stateMouseUp}
                            />
                        )}
                    </g>
                </svg>
                <div id="response">
                    <p className="label">message:</p>
                    <p>{ this.state.message }</p>
                    <p className="label">response:</p>
                    <p>{'"' + this.state.activeStates.map(s => this.state.states[s].response).join('"\n"') + '"'}</p>
                </div>
            </div>
        );
    },

    getInitialState(){
        return {
            states: [{
                    name: null,
                    x: 0,
                    y: 0,
                    isAcceptState: false
                }],
            transitions: [[]],
            activeStates: [0],
            message: '',
            defaultResponse: 'how do you greet people?',
            replacementCharacters: {other: '*', ' ': '_'}
        };
    },

    getInitialStateMachineState(){
        return this.state.states[0];
    },

    getStateMachineAcceptStates() {
        return this.state.states.filter(s => s.isAcceptState);
    },

    getTransitions(index) {
        if (index){
            return this.transitions[index];
        }
    },

    addStateMachineState(obj) {
        this.states.append(obj);
    },

    addTransition(obj) {
       this.transitions[obj.fromState].append(obj);
    },

    stringChanged(e){
        if (e.key === 'Enter'){
            return;
        }
        var states = this.nextStates(this.state.activeStates, e.key);
        this.setState({activeStates: states, message: this.state.message + e.key});
        e.preventDefault();
    },

    restart(){
        this.setState({activeStates: [0], message: ''});
        this.getDOMNode().focus();
    },

    keyDown(e) {
        if (e.keyCode === 27 || e.keyCode === 8){
            this.restart();
            e.preventDefault();
        }
    },

    matchString(string){
        var currentStates = [0];
        for (var i = 0; i < string.length; i++){
            var c = string.charAt(i);
            currentStates = this.nextStates(currentStates, c);
        }
        return currentStates;
    },

    nextStates(currentStates, input) {
        var newStates = [];
        currentStates.forEach(i => {
            var matchedTransitions = this.state.transitions[i].filter(t => t.input === input);
            matchedTransitions = matchedTransitions.length > 0 ? matchedTransitions : this.state.transitions[i].filter(t => t.input === 'other');
            matchedTransitions.forEach(t => {
                if (!_.includes(newStates, t.toState)) {
                    newStates.push(t.toState);
                }
            });
        });
        return newStates;
    },

    getResponse() {
        return ;
    },

    stateMouseDown(state, e) {
        var node = this.getDOMNode();
        var svgElem = node.querySelector('#state-machine-graph');
        var rect = svgElem.getBoundingClientRect();
        this.setState({
            dragState: {
                state: _.findIndex(this.state.states, s => s.x === state.props.x && s.y === state.props.y),
                currentStateLocation: {
                    x: state.props.x,
                    y: state.props.y
                },
                startPosition: {
                    x: e.pageX - rect.left,
                    y: e.pageY - rect.top
                }
            }
        });
    },
    stateMouseUp() {this.setState({dragState: null});},
    mouseMove(e) {
        if (this.state.dragState) {
            var node = this.getDOMNode();
            var svgElem = node.querySelector('#state-machine-graph');
            var rect = svgElem.getBoundingClientRect();

            var currentX = e.pageX - rect.left;
            var currentY = e.pageY - rect.top;

            var states = this.state.states;
            var dragState = this.state.dragState;
            var targetState = states[this.state.dragState.state];
            targetState.x = dragState.currentStateLocation.x + ( currentX - dragState.startPosition.x );
            targetState.y = dragState.currentStateLocation.y + ( currentY - dragState.startPosition.y );

            this.setState({states: states});
        }
    }
});
