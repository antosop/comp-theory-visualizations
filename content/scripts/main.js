"use strict";
import StateMachine from './state-machine'

var stateMachine = new StateMachine({
    states: [
        {
            name:null,
            x:50,
            y:200,
            isAcceptState:false
        },
        {
            name:'found h',
            x:150,
            y:250,
            isAcceptState:false
        },
        {
            name:'found hi',
            x:250,
            y:200,
            isAcceptState:true
        }
    ],
    transitions: [
        {
            fromState: 0,
            input: 'h',
            toState: 1
        },
        {
            fromState: 0,
            input: 'other',
            toState: 0
        },
        {
            fromState: 1,
            input: 'i',
            toState: 2
        },
        {
            fromState: 1,
            input: 'h',
            toState: 1
        },
        {
            fromState: 1,
            input: 'other',
            toState: 0
        },
        {
            fromState: 2,
            input: 'other',
            toState: 2
        }
    ]
});
var svg = d3.select("svg").attr('stroke-width',2);
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
  .attr('stroke', 'black')
  .attr('fill','none')
  .attr('marker-end', 'url(#triangle)');
var circles = svg.append("g").selectAll("circle")
  .data(stateMachine.states)
  .enter()
  .append("circle")
  .attr('r',25)
  .attr('stroke','black')
  .attr('fill','#aaa')
  .attr('cx',d => d.x)
  .attr('cy',d => d.y)
  .attr('name',d => d.name);
