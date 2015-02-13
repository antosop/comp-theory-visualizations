"use strict";

export default class StateMachine {
    constructor(states, initialState, ...acceptStates) {
        this.states = states;
        this.initialState = states[initialState];
        this.acceptStates = acceptStates.map(s => states[s]);
    }
}
