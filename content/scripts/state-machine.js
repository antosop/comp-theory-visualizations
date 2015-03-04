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

var Modes = require('./mode.js');

module.exports = React.createClass({
    render() {

        var addingTransition = '';// = this.state.mode.getAddingTransition(this);
        if (this.state.mode === Modes.addTransition && this.state.drag){
            addingTransition = <StateTransition
                index={-1}
                active={false}
                startX={this.state.states[this.state.drag.state].x}
                startY={this.state.states[this.state.drag.state].y}
                endX={this.state.drag.currentLocation.x}
                endY={this.state.drag.currentLocation.y}
                input='*'
                special={true}
                arcDepth={0}
            />;
        }
        var footText;
        if (this.state.mode === Modes.editInput){
            footText = <div id="footText">
                <p className="label">input:</p>
                <p>{this.state.newInput}</p>
            </div>;
        } else {
            footText = <div id="footText">
                <p className="label">message:</p>
                <p>{ this.state.message }</p>
                <p className="label">response:</p>
                <p>{'"' + this.state.activeStates.map(s => this.state.states[s].response).join('"\n"') + '"'}</p>
            </div>;
        }
        return (
            <div id="state-machine" >
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
                <div id="graph-container">
                    <div id="sidebar">
                        <svg id="tools" viewBox="-8 -8 66 66" preserveAspectRatio="xMidYMin" onMouseUp={this.cancelNew}>
                            <g className="tool" onMouseDown={this.newState}>
                                <circle r="25" cx={25} cy={25}/>
                                <text x={25} y={30}>new</text>
                            </g>
                            <g className={'tool ' + (this.state.mode === Modes.addTransition ? 'active' : '')}
                                onClick={this.toggleTransitionMode}>
                                <line x1="0" y1="75" x2="50" y2="75"/>
                            </g>
                        </svg>
                        <svg id="trash" viewBox="-8 -8 66 66">
                            <g className={'tool ' +
                                (this.state.mode.canTrash(this) ? 'can-trash ' : '') +
                                (this.state.remove ? 'remove' : '')
                            }>
                                <circle r="25" cx={25} cy={25}
                                    onMouseOver={() => {if (this.state.mode.canTrash(this)) {this.setState({remove: true});}}}
                                    onMouseOut={() => {this.setState({remove: false});}}
                                    onMouseUp={this.trashState} />
                                <text x={24} y={38}className="glyphicon">&#xe020;</text>
                            </g>
                        </svg>
                    </div>
                    <svg id="state-machine-graph" className={this.state.mode === Modes.editInput ? 'edit' : ''} viewBox={'' +
                            this.state.viewBox.x + ' ' +
                            this.state.viewBox.y + ' ' +
                            this.state.viewBox.w + ' ' +
                            this.state.viewBox.h + ' '}
                        onMouseMove={this.mouseMove} onMouseUp={this.mouseUp}
                        onKeyDown={this.keyDown} onKeyPress={this.keyPressed}
                        tabIndex="3"
                    >
                        <defs dangerouslySetInnerHTML={{__html:
                            '<marker ' +
                                'id="triangle-toolbox" ' +
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
                                    active={this.state.mode !== Modes.editInput && isActive}
                                    startX={startState.x}
                                    startY={startState.y}
                                    endX={endState.x}
                                    endY={endState.y}
                                    input={special || t.input}
                                    special={special !== null}
                                    arcDepth={t.arcDepth}
                                    edit={this.state.mode === Modes.editInput && this.state.edit === i}
                                    onMouseDown={this.transitionMouseDown}
                                    onClick={this.transitionClicked}
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
                                    active={this.state.mode !== Modes.editInput && _.includes(this.state.activeStates, i)}
                                    label={'' + i}
                                    onMouseDown={this.stateMouseDown}
                                    onMouseUp={this.stateMouseUp}
                                />
                            )}
                        </g>
                        <g>
                            {addingTransition}
                        </g>
                    </svg>
                </div>
                {footText}
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
            mode: Modes.normal,
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
            return this.state.transitions[index];
        }
    },

    addStateMachineState(obj) {
        this.states.append(obj);
    },

    addTransition(obj) {
       this.state.transitions[obj.fromState].append(obj);
    },

    keyPressed(e){
        this.state.mode.keyPressed(this, e);
    },

    restart(){
        this.setState({mode: Modes.normal, activeStates: [0], message: ''});
        var node = this.getDOMNode();
        var graph = node.querySelector('#state-machine-graph');
        graph.focus();
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
        this.state.mode.stateMouseDown(this, state, e, index);
    },
    stateMouseUp(state, e, index) {
        this.state.mode.stateMouseUp(this, state, e, index);
    },
    transitionMouseDown(transition, e, index) {
        this.state.mode.transitionMouseDown(this, transition, e, index);
    },
    transitionClicked(transition, e, index) {
        if (!this.state.ignoreClick){
            this.state.mode.transitionClicked(this, transition, e, index);
        }
    },
    mouseUp() {this.setState({drag: null, ignoreClick: this.state.moved, moved: false});},
    mouseMove(e) {
        this.setState({moved: this.state.drag !== null});
        this.state.mode.mouseMove(this, e);
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
    },

    newState() {
        if (this.state.mode === Modes.normal) {
            this.setState({
                newState: true
            });
        }
    },

    cancelNew(){
        this.setState({
            newState: false
        });
    },

    trashState() {
        if (this.state.mode.canTrash(this)) {
            this.state.states.splice(this.state.drag.state, 1);
            this.state.transitions.splice(this.state.drag.state, 1);
            this.state.transitions.forEach((transitionGroup, groupIndex) => {
                _.remove(transitionGroup, t => t.toState === this.state.drag.state);
                transitionGroup.forEach(transition => {
                    transition.fromState = groupIndex;
                    transition.toState = transition.toState > this.state.drag.state ? transition.toState - 1 : transition.toState;
                });
            });
            this.setState({drag: null, remove: false});
        }
    },

    toggleTransitionMode() {
        this.setState({mode: this.state.mode === Modes.addTransition ? Modes.normal : Modes.addTransition });
    }
});
