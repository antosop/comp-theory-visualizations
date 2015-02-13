var StateMachine = function(states,initialState){
    this.states = states;
    this.initialState = states[initialState];
    this.acceptStates = [];
    for (var i = 2, i < arguments.length, i++){
        this.acceptStates.push(states[arguments[i]]);
    }
}
module.export = StateMachine;
