"use strict";

export default class StateMachine {
    constructor(...states) {
        if (typeof states !== 'undefined'){
            this.states = states;
        } else {
            this.states = [];
        }
    }
    initialState() {
        states[0];
    }
    acceptStates() {
        return this.states.filter(s => s.isAcceptState);
    }
    outgoingTransitions(state) {
        if (typeof state === 'number')
            return this.states[state].transitions;
        return state.transitions;
    }
    incomingTransitions(state) {
        var transitions = [];
        var toState;
        if (typeof state === 'number'){
            toState = this.states[state];
        } else {
            toState = state;
        }
        this.states.forEach(s => {
            s.transitions.forEach(t => {
                if (t.toState == toState)
                    transitions.push(t);
            });
        });
    }
    addState(state)
}
