"use strict";

import _ from 'lodash';
import React from 'react';

export default StateMachine = React.createClass({

    render() {
        return (
            <svg>
                <defs>
                    <marker id="triangle" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="strokeWidth" markerWidth="8" markerHeight="6" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                    </marker>
                    <marker id="triangle-selected" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="strokeWidth" markerWidth="8" markerHeight="6" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                    </marker>
                </defs>
                <g id="transitions">
                this.state.transitions.map(t => {
                    var isActive = t.fromState === this.state.activeState;
                    var startState = this.state.states[t.fromState];
                    var endState = this.state.states[t.toState];
                    <StateTransition
                        active={isActive}
                        startX={startState.x}
                        startY={startState.y}
                        endX={endState.x}
                        endY={endState.y}
                        input={t.input}
                    />
                })
                </g>
                <g id="states">
                this.state.states.map( (s,i) => {
                    <State x={s.x} y={s.y} accept={s.isAcceptState} active={i === this.state.activeState}/>
                });
                </g>
                <g id="labelContainers">
                //TODO
                </g>
                <g id="transitionLabels"></g>
                <g id="stateLabels"></g>
           </svg>
        )
    }

    getInitialState(){
        return {
            states:[{
                    name:null,
                    x:0,
                    y:0,
                    isAcceptState:false
                }],
            transitions: [],
            activeState: 0
        }
    },

    getInitialStateMachineState(){
        return this.state.states[0];
    },

    getStateMachineAcceptStates() {
        return this.state.states.filter(s => s.isAcceptState);
    },

    getTransitions(index) {
        if (index)
            return this.transitions.filter(t => t.fromState === index);
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
            currentStates = this.nextStates(currentStates,c);
            console.log(c);
            console.log(currentStates);
        }
        console.log(currentStates.filter(s => this.states[s].isAcceptState).map(s => this.states[s].response));
        return currentStates;
    },

    nextStates(currentStates, input) {
        var characterTransitions = this.transitions.filter(t => t.input !== 'other');
        var otherTransitions = this.transitions.filter(t => t.input === 'other');
        var newStates = [];
        var matchedStates = [];
        characterTransitions.forEach(t => {
            if (_.includes(currentStates,t.fromState)) {
                if (t.input === input && !_.includes(newStates,t.toState)){
                    newStates.push(t.toState);
                    if (!_.includes(matchedStates,t.fromState)){
                        matchedStates.push(t.fromState);
                    }
                }
            }
        });
        var unmatchedStates = currentStates.filter(s => !_.includes(matchedStates,s));
        otherTransitions.forEach(t => {
            if (_.includes(unmatchedStates,t.fromState)) {
                newStates.push(t.toState);
            }
        });
        return newStates;
    }
});
