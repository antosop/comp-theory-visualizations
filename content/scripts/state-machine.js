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
                            <OverlayTrigger placement="bottom" overlay={
                                    <Tooltip >open</Tooltip>
                                } delayShow={300} delayHide={150}>
                                <Button id="open" onClick={e => {
                                    var inp = e.target.querySelector('#fileInput');
                                    if (inp) {inp.click();}
                                }}>
                                    <Glyphicon glyph="open" />
                                    <form id="openForm">
                                        <input id='fileInput' className="hidden" type="file" accept=".sm" onChange={this.openFileHandler}/>
                                    </form>
                                </Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="bottom" overlay={
                                    <Tooltip >save</Tooltip>
                                } delayShow={300} delayHide={150}>
                                <Button id="save" download="state-machine.sm" href={'data:text/json;charset=utf-8,' + JSON.stringify(
                                    {states: this.state.states, transitions: this.state.transitions})}>
                                    <Glyphicon glyph="save" />
                                </Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="bottom" overlay={
                                    <Tooltip >restart</Tooltip>
                                } delayShow={300} delayHide={150}>
                                <Button id="refresh" onClick={this.restart}>
                                    <Glyphicon glyph="refresh" />
                                </Button>
                            </OverlayTrigger>
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
                <svg id="state-machine-graph" viewBox={'' +
                        this.state.viewBox.x + ' ' +
                        this.state.viewBox.y + ' ' +
                        this.state.viewBox.w + ' ' +
                        this.state.viewBox.h + ' '}
                    onMouseMove={this.mouseMove} onMouseUp={this.mouseUp}
                >
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
                        {_.flatten(this.state.transitions).map((t, i) => {
                            var isActive = _.includes(this.state.activeStates, t.fromState);
                            var startState = this.state.states[t.fromState];
                            var endState = this.state.states[t.toState];
                            var special = null;
                            if (_.has(this.state.replacementCharacters, t.input)){
                                special = this.state.replacementCharacters[t.input];
                            }
                            return (<StateTransition
                                key={'transition' + i}
                                index={i}
                                active={isActive}
                                startX={startState.x}
                                startY={startState.y}
                                endX={endState.x}
                                endY={endState.y}
                                input={special || t.input}
                                special={special !== null}
                                arcDepth={t.arcDepth}
                                onMouseDown={this.transitionMouseDown}
                            />);
                        })}
                    </g>
                    <g id="states">
                        {this.state.states.map((s, i) =>
                            <StateMachineState
                                key={'state' + i}
                                index={i}
                                x={s.x}
                                y={s.y}
                                accept={s.isAcceptState}
                                active={_.includes(this.state.activeStates, i)}
                                label={'' + i}
                                onMouseDown={this.stateMouseDown}
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
            viewBox: {x: 0, y: 0, w: 800, h: 600},
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

    stateMouseDown(state, e, index) {
        var pt = this.pointOnScreen(e);
        this.setState({
            drag: {
                state: index,
                currentLocation: {
                    x: state.props.x,
                    y: state.props.y
                },
                startPosition: pt
            }
        });
    },
    transitionMouseDown(transition, e, index) {
        this.setState({
            drag: {
                transition: index
            }
        });
    },
    mouseUp() {this.setState({drag: null});},
    mouseMove(e) {
        if (this.state.drag) {
            var point = this.pointOnScreen(e);

            var states = this.state.states;
            var transitions = _.flatten(this.state.transitions);
            var drag = this.state.drag;
            var targetElement;
            if (this.state.drag.state || this.state.drag.state === 0) {
                targetElement = states[this.state.drag.state];
                targetElement.x = drag.currentLocation.x + ( point.x - drag.startPosition.x );
                targetElement.y = drag.currentLocation.y + ( point.y - drag.startPosition.y );
                this.setState({states: states});
            } else {
                targetElement = transitions[this.state.drag.transition];
                var fromState = this.state.states[targetElement.fromState];
                var toState = this.state.states[targetElement.toState];
                var lenX = toState.x - fromState.x;
                var lenY = toState.y - fromState.y;
                var dx = fromState.x - point.x;
                var dy = fromState.y - point.y;
                var dist = Math.sqrt(lenX * lenX + lenY * lenY);
                targetElement.arcDepth = -(lenX * dy - dx * lenY) / dist;
                this.forceUpdate();
            }
        }
    },

    pointOnScreen(e){
        var svg = this.getDOMNode().querySelector('#state-machine-graph');
        var pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        return pt.matrixTransform(svg.getScreenCTM().inverse());
    },

    openFileHandler(e) {
        var that = this;
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function(loadEvent) {
            var result = JSON.parse(loadEvent.target.result);
            that.setState(result);
            that.restart();
            that.getDOMNode().querySelector('#openForm').reset();
        };
        reader.readAsText(file);
    }
});
