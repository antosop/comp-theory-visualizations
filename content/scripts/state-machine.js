"use strict";

export default class StateMachine {
    constructor(object) {
        if (object){
            this.states = object.states;
            this.names = {};
            this.updateNames();
            // two dimensional array
            this.transitions = object.transitions;
        } else {
            this.states = [new State(null,0,0,false)];
            this.names = {};
            this.transitions = [[]];
        }
    }

    updateNames() {
            for (var i = 0; i < this.states.length; i++) {
                this.updateName(i);
            }
    }

    updateName(index) {
        var s = this.state[index];
        if (s.name) this.names[s.name] = i;
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
            return this.transitions[stateIndex];
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
            return this.names[state.name]];

    }

    addTransition(fromState, toState, input, someArcParameter) {
       var fromStateIndex = getStateIndex(fromState);
       var toStateIndex = get StateIndex(toState);
       this.transitions[fromStateIndex].append({character:input, toState:toStateIndex, arc:someArcParameter});
    }
}
