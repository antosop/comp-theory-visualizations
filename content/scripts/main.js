"use strict";

import StateMachine from "./state-machine";

var stateMachine = new StateMachine({
    a:1,
    b:2,
    c:3,
    d:4
},'a','d');

console.log(stateMachine.acceptStates[0]);
d3.select("body")
  .selectAll("p")
  .data(stateMachine.stateNames)
  .enter()
  .append("p")
  .text(d => {
    let text = '';
    if (stateMachine.initialState === stateMachine.states[d]){
        text += 'start ';
    }
    text += 'node ' + d + ':\t'+ stateMachine.states[d]
    return text;
  });
