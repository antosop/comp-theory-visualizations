//import StateMachine from './state-machine';
var StateMachine = require('./state-machine');
//import css from '../styles/main.css';
require('../styles/main.css');
//import _ from 'lodash';
//var _ = require('lodash');
//import React from 'react'
var React = require('react');

var stateMachine = React.render(<StateMachine/>, document.getElementById('container'));

stateMachine.setState({
    states: [
        {
            name: 'A',
            x: 100,
            y: 100,
            isAcceptState: false
        },
        {
            name: 'B',
            x: 175,
            y: 200,
            isAcceptState: false
        },
        {
            name: 'C',
            x: 250,
            y: 200,
            isAcceptState: false
        },
        {
            name: 'D',
            x: 325,
            y: 200,
            isAcceptState: false
        },
        {
            name: 'E',
            x: 400,
            y: 200,
            isAcceptState: false
        },
        {
            name: 'F',
            x: 475,
            y: 200,
            isAcceptState: true,
            response: 'AloooooHAAAaa!'
        },
        {
            name: 'H',
            x: 175,
            y: 100,
            isAcceptState: false
        },
        {
            name: 'I',
            x: 250,
            y: 100,
            isAcceptState: true,
            response: 'Hello!'
        }
    ],
    transitions: [
        [
            {
                fromState: 0,
                input: 'a',
                toState: 1
            },
            {
                fromState: 0,
                input: 'h',
                toState: 6
            },
            {
                fromState: 0,
                input: 'other',
                toState: 0
            }
        ],
        [
            {
                fromState: 1,
                input: 'l',
                toState: 2
            },
            {
                fromState: 1,
                input: 'other',
                toState: 0
            }
        ],
        [
            {
                fromState: 2,
                input: 'o',
                toState: 3
            },
            {
                fromState: 2,
                input: 'other',
                toState: 0
            }
        ],
        [
            {
                fromState: 3,
                input: 'h',
                toState: 4
            },
            {
                fromState: 3,
                input: 'other',
                toState: 0
            }
        ],
        [
            {
                fromState: 4,
                input: 'a',
                toState: 5
            },
            {
                fromState: 4,
                input: 'i',
                toState: 7
            },
            {
                fromState: 4,
                input: 'other',
                toState: 0
            }
        ],
        [
            {
                fromState: 5,
                input: 'other',
                toState: 5
            }
        ],
        [
            {
                fromState: 6,
                input: 'i',
                toState: 7
            },
            {
                fromState: 6,
                input: 'other',
                toState: 0
            }
        ],
        [
            {
                fromState: 7,
                input: 'other',
                toState: 7
            }
        ]
    ]
});

stateMachine.matchString('alohohalohaahi he said. a bunch of text that should bog down the state machine a lot. aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

    //var setCurrent = function(states) {
        //circles.classed("current",(d,i) => _.includes(states,i));
        //labelContainer.classed("current",d => _.includes(states,d.__data__.fromState));
        //paths.classed("current",d => _.includes(states,d.fromState));
    //};

    //d3.select('#string').on('input',function(d,i) {
        //var states = stateMachine.matchString(this.value);
        //setCurrent(states);
    //});
