"use strict";

export default class State {
    constructor(...stateTransitions) {
        this.transitions = stateTransitions;
    }
}
