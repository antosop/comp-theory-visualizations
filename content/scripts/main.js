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
            y: 200,
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
        },
        {
            fromState: 1,
            input: 'l',
            toState: 2
        },
        {
            fromState: 1,
            input: 'other',
            toState: 0
        },
        {
            fromState: 2,
            input: 'o',
            toState: 3
        },
        {
            fromState: 2,
            input: 'other',
            toState: 0
        },
        {
            fromState: 3,
            input: 'h',
            toState: 4
        },
        {
            fromState: 3,
            input: 'other',
            toState: 0
        },
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
        },
        {
            fromState: 5,
            input: 'other',
            toState: 5
        },
        {
            fromState: 6,
            input: 'i',
            toState: 7
        },
        {
            fromState: 6,
            input: 'other',
            toState: 0
        },
        {
            fromState: 7,
            input: 'other',
            toState: 7
        }
    ]
});

stateMachine.matchString('hi he said.');

//var labelContainer = svg.append("g").selectAll("circle")
    //.data(paths[0])
    //.enter()
    //.append("circle")
    //.attr('r',12)
    //.attr('cx', d => d.getPointAtLength(d.getTotalLength()/2).x)
    //.attr('cy', d => d.getPointAtLength(d.getTotalLength()/2).y)
    //.classed("label-container",true)
    //.classed("current",d => d.__data__.fromState ===0);

//var characterReplacements = {'other':'*', ' ':'_'};

//var transitionLabels = svg.append("g").selectAll("text")
    //.data(paths[0])
    //.enter()
    //.append("text")
    //.attr('x', d => d.getPointAtLength(d.getTotalLength()/2).x)
    //.attr('y', d => d.getPointAtLength(d.getTotalLength()/2).y+5)
    //.classed("transition-label",true)
    //.classed("current",d => d.__data__.fromState === 0)
    //.classed('special',d => (_.has(characterReplacements,d.__data__.input)))
    //.text(d => _.has(characterReplacements,d.__data__.input) ? characterReplacements[d.__data__.input] : d.__data__.input);

//var stateLabels = svg.append("g").selectAll("text")
    //.data(stateMachine.states)
    //.enter()
    //.append("text")
    //.attr('x',d => d.x)
    //.attr('y',d => d.y+5)
    //.classed('state-label',true)
    //.text((d,i) => i);

    //var setCurrent = function(states) {
        //circles.classed("current",(d,i) => _.includes(states,i));
        //labelContainer.classed("current",d => _.includes(states,d.__data__.fromState));
        //paths.classed("current",d => _.includes(states,d.fromState));
    //};

    //d3.select('#string').on('input',function(d,i) {
        //var states = stateMachine.matchString(this.value);
        //setCurrent(states);
    //});
