var StateTransition = require('./state-transition');
var _ = require('lodash');
var React = require('react');

var stateMouseDown = function(stateMachine, state, e, index) {
    var pt = stateMachine.pointOnScreen(e);
    stateMachine.setState({
        drag: {
            state: index,
            currentLocation: {
                x: state.props.x,
                y: state.props.y
            },
            startPosition: pt
        }
    });
};

module.exports = {
    normal: {
        stateMouseDown(stateMachine, state, e, index) {
            return stateMouseDown(stateMachine, state, e, index);
        },
        stateMouseUp(/*stateMachine, state, e, index*/) {

        },
        transitionClicked(stateMachine, transition, e, index) {
            stateMachine.setState({mode: module.exports.editInput, edit: index, newInput: ''});
        },
        getAddingTransition(){
            return '';
        },
        canTrash(stateMachine){
            return stateMachine.state.drag && stateMachine.state.drag.state;
        },
        transitionMouseDown(stateMachine, transition, e, index){
            stateMachine.setState({
                drag: {
                    transition: index
                }
            });
        },
        mouseMove(stateMachine, e) {
            var point = stateMachine.pointOnScreen(e);
            var drag;
            if (stateMachine.state.drag) {
                var states = stateMachine.state.states;
                var transitions = _.flatten(stateMachine.state.transitions);
                drag = stateMachine.state.drag;
                var targetElement;
                if (stateMachine.state.drag.state || stateMachine.state.drag.state === 0) {
                    targetElement = states[stateMachine.state.drag.state];
                    targetElement.x = drag.currentLocation.x + ( point.x - drag.startPosition.x );
                    targetElement.y = drag.currentLocation.y + ( point.y - drag.startPosition.y );
                    stateMachine.setState({states: states});
                } else {
                    targetElement = transitions[stateMachine.state.drag.transition];
                    var fromState = stateMachine.state.states[targetElement.fromState];
                    var toState = stateMachine.state.states[targetElement.toState];
                    var lenX = toState.x - fromState.x;
                    var lenY = toState.y - fromState.y;
                    var dx = fromState.x - point.x;
                    var dy = fromState.y - point.y;
                    var dist = Math.sqrt(lenX * lenX + lenY * lenY);
                    targetElement.arcDepth = -(lenX * dy - dx * lenY) / dist;
                    stateMachine.forceUpdate();
                }
            } else if (stateMachine.state.newState) {
                var index = stateMachine.state.states.length;
                stateMachine.state.states.push({x: point.x, y: point.y, isAccpetState: false});
                stateMachine.state.transitions.push([]);
                drag = {
                    state: index,
                    currentLocation: {
                        x: point.x,
                        y: point.y
                    },
                    startPosition: point
                };
                stateMachine.setState({
                    newState: false,
                    drag: drag
                });
            }

        },
        keyPressed(stateMachine, e){
            if (e.key === 'Enter'){
                return;
            }
            var states = stateMachine.nextStates(stateMachine.state.activeStates, e.key);
            stateMachine.setState({activeStates: states, message: stateMachine.state.message + e.key});
            e.preventDefault();
        },
        keyDown(stateMachine, e) {
            if (e.keyCode === 27 || e.keyCode === 8){
                stateMachine.restart();
                e.preventDefault();
            }
        }
    },
    addTransition: {
        stateMouseDown(stateMachine, state, e, index) {
            return stateMouseDown(stateMachine, state, e, index);
        },
        stateMouseUp(stateMachine, state, e, index) {
            var fromState = stateMachine.state.drag.state;
            stateMachine.state.transitions[fromState].push({fromState: fromState, input: 'other', toState: index});
            stateMachine.restart();
        },
        transitionClicked(/*stateMachine, transition, e, index*/) {
            //stateMachine.setState({mode: module.exports.editInput, edit: index, newInput: ''});
        },
        getAddingTransition(stateMachine){
            if (stateMachine.state.drag){
                return <StateTransition
                    index={-1}
                    active={false}
                    startX={stateMachine.state.states[stateMachine.state.drag.state].x}
                    startY={stateMachine.state.states[stateMachine.state.drag.state].y}
                    endX={stateMachine.state.drag.currentLocation.x}
                    endY={stateMachine.state.drag.currentLocation.y}
                    input='*'
                    special={true}
                    arcDepth={0}
                />;
            }
        },
        canTrash(){
            return false;
        },
        transitionMouseDown(/*stateMachine, transition, e, index*/){
        },
        mouseMove(stateMachine, e) {
            if (stateMachine.state.drag) {
                var point = stateMachine.pointOnScreen(e);
                var drag = stateMachine.state.drag;
                drag.currentLocation = {x: point.x, y: point.y};
                stateMachine.forceUpdate();
            }
        },
        keyPressed(stateMachine, e){
            this.normal.keyPressed(stateMachine, e);
        },
        keyDown(stateMachine, e) {
            module.exports.normal.keyDown(stateMachine, e);
        }

    },
    editInput: {
        stateMouseDown(/*stateMachine, state, e, index*/) {
        },
        stateMouseUp(/*stateMachine, state, e, index*/) {
        },
        transitionClicked(/*stateMachine, transition, e, index*/) {
            //stateMachine.setState({mode: module.exports.editInput, edit: index, newInput: ''});
        },
        getAddingTransition(/*stateMachine*/){
        },
        canTrash(){
        },
        transitionMouseDown(/*stateMachine, transition, e, index*/){
        },
        mouseMove(/*stateMachine, e*/) {
        },
        keyPressed(stateMachine, e){
            if (e.key === 'Enter'){
                var editingTransition = _.flatten(stateMachine.state.transitions)[stateMachine.state.edit];
                if (stateMachine.state.newInput !== ''){
                    editingTransition.input = stateMachine.state.newInput;
                }
                stateMachine.restart();
            } else {
                stateMachine.setState({newInput: stateMachine.state.newInput + e.key});
            }
        },
        keyDown(stateMachine, e) {
            module.exports.normal.keyDown(stateMachine, e);
            if (e.keyCode === 46){
                var transition = _.flatten(stateMachine.state.transitions)[stateMachine.state.edit];
                var list = stateMachine.state.transitions[transition.fromState];
                var index = _.indexOf(list, transition);
                list.splice(index, 1);
                stateMachine.restart();
                e.preventDefault();
            }
        }
    }
};
