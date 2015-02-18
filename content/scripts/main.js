"use strict";
import StateMachine from './state-machine';
import css from '../styles/main.css';
import _ from 'lodash';

var stateMachine = new StateMachine({
    states: [
        {
            name:'ready',
            x:200,
            y:300,
            isAcceptState:false
        },
        {
            name:'wait',
            x:300,
            y:400,
            isAcceptState:false
        },
        {
            name:'found h',
            x:300,
            y:200,
            isAcceptState:false
        },
        {
            name:'found hi',
            x:400,
            y:200,
            isAcceptState:false
        },
        {
            name:'found word hi',
            x:500,
            y:300,
            isAcceptState:true,
            response: 'Hello!'
        }
    ],
    transitions: [
        {
            fromState: 1,
            input: ' ',
            toState: 0
        },
        {
            fromState: 1,
            input: 'other',
            toState: 1
        },
        {
            fromState: 0,
            input: 'h',
            toState: 2
        },
        {
            fromState: 0,
            input: ' ',
            toState: 0
        },
        {
            fromState: 0,
            input: 'other',
            toState: 1
        },
        {
            fromState: 2,
            input: 'i',
            toState: 3
        },
        {
            fromState: 2,
            input: ' ',
            toState: 0
        },
        {
            fromState: 2,
            input: 'other',
            toState: 1
        },
        {
            fromState: 3,
            input: ' ',
            toState: 4
        },
        {
            fromState: 3,
            input: 'other',
            toState: 1
        },
        {
            fromState: 4,
            input: 'other',
            toState: 4
        }
    ]
});

stateMachine.matchString("hi he said.");

var pathStartPositions = [];

var svg = d3.select("svg");
var paths = svg.append("g").selectAll("path")
  .data(stateMachine.transitions)
  .enter()
  .append("path")
  .attr('d',d => {
      var fs = stateMachine.states[d.fromState];
      var ts = stateMachine.states[d.toState];
      var x1;
      var x2;
      var y1;
      var y2;
      var r = 25;
      var loop = true;
      if(d.fromState !== d.toState){
          loop = false;
          var dx = (ts.x-fs.x);
          var dy = (ts.y-fs.y);
          var m = Math.sqrt(dx*dx+dy*dy);
          var sign = dy > 0 ? 1 : -1;
          var a = sign*Math.acos(dx/m);
          x1 = fs.x+Math.cos(a-Math.PI/4) * 25;
          x2 = ts.x-Math.cos(a+Math.PI/4) * 25;
          y1 = fs.y+Math.sin(a-Math.PI/4) * 25;
          y2 = ts.y-Math.sin(a+Math.PI/4) * 25;
          r = m/1.75;
      } else {
          x1 = fs.x;
          x2 = fs.x - 25;
          y1 = fs.y - 25;
          y2 = fs.y;
      }

      return 'M' + x1 + ',' + y1 + 'A' + r + ',' + r + ' 0 '+ (loop?1:0) + ' '+ (loop?0:1) + ' ' + x2 + ',' + y2;
  })
  .classed('transition',true)
  .classed('current',d => d.fromState === 0);

var circles = svg.append("g").selectAll("circle")
  .data(stateMachine.states)
  .enter()
  .append("circle")
  .classed("state",true)
  .classed("accept-state",d => d.isAcceptState)
  .classed("current",(d,i) => i === 0)
  .attr('r',25)
  .attr('cx',d => d.x)
  .attr('cy',d => d.y)
  .attr('name',d => d.name);

var labelContainer = svg.append("g").selectAll("circle")
    .data(paths[0])
    .enter()
    .append("circle")
    .attr('r',10)
    .attr('cx', d => d.getPointAtLength(d.getTotalLength()/2).x)
    .attr('cy', d => d.getPointAtLength(d.getTotalLength()/2).y)
    .classed("label-container",true);

var characterReplacements = {'other':'*', ' ':'_'};

var transitionLabels = svg.append("g").selectAll("text")
    .data(paths[0])
    .enter()
    .append("text")
    .attr('x', d => d.getPointAtLength(d.getTotalLength()/2).x)
    .attr('y', d => d.getPointAtLength(d.getTotalLength()/2).y+5)
    .classed("transition-label",true)
    .classed('special',d => (_.has(characterReplacements,d.__data__.input)))
    .text(d => _.has(characterReplacements,d.__data__.input) ? characterReplacements[d.__data__.input] : d.__data__.input);

var stateLabels = svg.append("g").selectAll("text")
    .data(stateMachine.states)
    .enter()
    .append("text")
    .attr('x',d => d.x)
    .attr('y',d => d.y+5)
    .classed('state-label',true)
    .text((d,i) => i);


