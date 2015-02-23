/** @jsx React.DOM */
"use strict";

import _ from 'lodash';
import React from 'react/addons';
import StateTransition from './state-transition';

export default React.createClass({

    render() {
        return (
            <svg className="state-machine">
                <defs >
                    <marker id="triangle" viewBox="0 0 10 10" dangerouslySetInnerHTML={{refX: 9, refY: 5, markerUnits:"strokeWidth", markerWidth:8, markerHeight:6, orient:"auto"}}>
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                    </marker>
                    <marker id="triangle-selected" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="strokeWidth" markerWidth="8" markerHeight="6" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                    </marker>
                </defs>
                <g id="transitions">
                {this.state.transitions.map(this.mapStateTransition)}
                </g>
                <g id="states">
                </g>
                <g id="labelContainers">
                //TODO
                </g>
                <g id="transitionLabels"></g>
                <g id="stateLabels"></g>
           </svg>
        )
    },

    mapStateTransition(t){
        var isActive = t.fromState === this.state.activeState;
        var startState = this.state.states[t.fromState];
        var endState = this.state.states[t.toState];
        return(<StateTransition
            active={isActive}
            startX={startState.x}
            startY={startState.y}
            endX={endState.x}
            endY={endState.y}
            input={t.input}
        />)
    },

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
        console.log(currentStates.filter(s => this.state.states[s].isAcceptState).map(s => this.state.states[s].response));
        return currentStates;
    },

    nextStates(currentStates, input) {
        var characterTransitions = this.state.transitions.filter(t => t.input !== 'other');
        var otherTransitions = this.state.transitions.filter(t => t.input === 'other');
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
