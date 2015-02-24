//import _ from 'lodash';
var _ = require('lodash');
//import React from 'react/addons';
var React = require('react/addons');
//import StateTransition from './state-transition';
var StateTransition = require('./state-transition');
//import StateMachineState from './state.js';
var StateMachineState = require('./state.js');

//export default React.createClass({
module.exports = React.createClass({
    render() {
        return (
            <svg className="state-machine">
                <defs dangerouslySetInnerHTML={{__html: '<marker id=\"triangle\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerUnits=\"strokeWidth\" markerWidth=\"8\" markerHeight=\"6\" orient=\"auto\">' +
                        '<path d=\"M 0 0 L 10 5 L 0 10 z\" />' +
                    '</marker>' +
                    '<marker id=\"triangle-selected\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerUnits=\"strokeWidth\" markerWidth=\"8\" markerHeight=\"6\" orient=\"auto\">' +
                        '<path d=\"M 0 0 L 10 5 L 0 10 z\" />' +
                    '</marker>'}}>
                </defs>
                <g id="transitions">
                {this.state.transitions.map(this.mapStateTransition)}
                </g>
                <g id="states">
                {this.state.states.map((s, i) =>
                    <StateMachineState x={s.x} y={s.y} accept={s.isAcceptState} active={this.state.activeState === i} />
                )}
                </g>
                <g id="labelContainers">
                {this.state.transitions.map((t) => {
                    var classes = React.addons.classSet({
                        'label-container': true,
                        current: this.state.activeState === t.fromState
                    });
                    return <circle className={classes} r="12" cx={t.midX} cy={t.midY}/>;
                })}
                </g>
                <g id="transitionLabels">
                {this.state.transitions.map((t) => {
                    var special = null;
                    if (_.has(this.state.replacementCharacters, t.input)){
                        special = this.state.replacementCharacters[t.input];
                    }
                    var classes = React.addons.classSet({
                        'transition-label': true,
                        'current': this.state.activeState === t.fromState,
                        'special': special !== null
                    });
                    return <text className={classes} x={t.midX} y={t.midY + 5}>{special ? special : t.input}</text>;
                })}
                </g>
                <g id="stateLabels">
                {this.state.states.map((s, i) => <text className="state-label" x={s.x} y={s.y + 5}>{i}</text>)}
                </g>
           </svg>
        );
    },

    componentDidUpdate(){
        var node = this.getDOMNode();
        var transitionPaths = node.getElementById('transitions').children;
        var transitions = this.state.transitions;
        var needsUpdate = false;
        for (var i = 0; i < transitionPaths.length; i++) {
            var point = transitionPaths[i].getPointAtLength(transitionPaths[i].getTotalLength() / 2);
            if (transitions[i].midX !== point.x){
                transitions[i].midX = point.x;
                needsUpdate = true;
            }
            if (transitions[i].midY !== point.y){
                transitions[i].midY = point.y;
                needsUpdate = true;
            }
        }
        if (needsUpdate) {
            this.setState({transitions: transitions});
        }
    },

    mapStateTransition(t){
        var isActive = t.fromState === this.state.activeState;
        var startState = this.state.states[t.fromState];
        var endState = this.state.states[t.toState];
        return (<StateTransition
            active={isActive}
            startX={startState.x}
            startY={startState.y}
            endX={endState.x}
            endY={endState.y}
            input={t.input}
        />);
    },

    getInitialState(){
        return {
            states: [{
                    name: null,
                    x: 0,
                    y: 0,
                    isAcceptState: false
                }],
            transitions: [],
            activeState: 0,
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
            return this.transitions.filter(t => t.fromState === index);
        }
    },

    addStateMachineState(obj) {
        this.states.append(obj);
    },

    addTransition(obj) {
       this.transitions.append(obj);
    },

    matchString(string){
        var currentStates = [0];
        for (var i = 0; i < string.length; i++){
            var c = string.charAt(i);
            currentStates = this.nextStates(currentStates, c);
            console.log(c);
            console.log(currentStates);
        }
        console.log(currentStates.filter(s => this.state.states[s].isAcceptState).map(s => this.state.states[s].response));
        return currentStates;
    },

    nextStates(currentStates, input) {
        var characterTransitions = this.state.transitions.filter(t => t.input !== 'other');
        var otherTransitions = this.state.transitions.filter(t => t.input === 'other');
        var newStates = [];
        var matchedStates = [];
        characterTransitions.forEach(t => {
            if (_.includes(currentStates, t.fromState)) {
                if (t.input === input && !_.includes(newStates, t.toState)){
                    newStates.push(t.toState);
                    if (!_.includes(matchedStates, t.fromState)){
                        matchedStates.push(t.fromState);
                    }
                }
            }
        });
        var unmatchedStates = currentStates.filter(s => !_.includes(matchedStates, s));
        otherTransitions.forEach(t => {
            if (_.includes(unmatchedStates, t.fromState)) {
                newStates.push(t.toState);
            }
        });
        return newStates;
    }
});
