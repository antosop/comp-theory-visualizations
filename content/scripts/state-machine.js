"use strict";

import _ from 'lodash';

export default class StateMachine {
    constructor(object) {
        if (object){
            this.states = object.states;
            this.names = {};
            this.updateNames();
            this.transitions = object.transitions;
        } else {
            this.states = [
                {
                    name:null,
                    x:0,
                    y:0,
                    isAcceptState:false
                }
            ];
            this.names = {};
            this.transitions = [];
        }
    }

    updateNames() {
            for (var i = 0; i < this.states.length; i++) {
                this.updateName(i);
            }
    }

    updateName(index) {
        var s = this.states[index];
        if (s.name) this.names[s.name] = index;
    }

    getInitialState() {
        return this.states[0];
    }

    getAcceptStates() {
        return this.states.filter(s => s.isAcceptState);
    }

    getTransitions(state) {
        var stateIndex = getStateIndex(state);
        if (stateIndex)
            return this.transitions.filter(t => t.fromState === stateIndex);
    }

    addState(name,x,y,isAcceptState) {
        var index = this.states.length;
        this.states.append({name:name, x:x, y:y, isAcceptState:isAcceptState});
        this.updateName(index);
    }

    getStateIndex(state){
        if (typeof state === 'number')
            return this.states[state] && state;
        if (typeof state === 'string')
            return this.names[state];
        if (state.name)
            return this.names[state.name];

    }

    addTransition(fromState, toState, input) {
       var fromStateIndex = getStateIndex(fromState);
       var toStateIndex = getStateIndex(toState);
       this.transitions.append({fromState:fromStateIndex, character:input, toState:toStateIndex});
    }

    matchString(string){
        var currentStates = [0];
        for (var i = 0; i < string.length; i++){
            var c = string.charAt(i);
            currentStates = this.nextStates(currentStates,c);
            console.log(c);
            console.log(currentStates);
        }
        console.log(currentStates.filter(s => this.states[s].isAcceptState).map(s => this.states[s].response));
    }

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
}
