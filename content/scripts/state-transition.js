"use strict";

export default class StateTransition {
    constructor(input, toStateName) {
        this.input = input;
        this.toState = toStateName;
    }
}
