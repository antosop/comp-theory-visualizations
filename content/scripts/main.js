"use strict";
import StateMachine from './state-machine'

var stateMachine = new StateMachine({
    states: [
        {
            name:null,
            x:50,
            y:100,
            isAcceptState:false
        },
        {
            name:'found h',
            x:150,
            y:100,
            isAcceptState:false
        },
        {
            name:'found hi',
            x:250,
            y:100,
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
      //var fs = stateMachine.states[d.fromState];
      //var ts = stateMachine.states[d.toState];
      //var r = 25;
      //var largeArk = 1;
      //if(d.fromState !== d.toState){
      var largeArk = 0;
      var dx = (ts.x-fs.x);
      var dy = (ts.y-fs.y);
      var m = Math.sqrt(dx*dx+dy*dy);
      var sign = dx > 0 ? 1 : -1;
      var x1 = fs.x+Math.sin(Math.asin(dx/m)+sign*Math.PI/4) * 25;
      var x2 = ts.x-Math.sin(Math.asin(dx/m)-sign*Math.PI/4) * 25;
      var y1 = fs.y+Math.cos(Math.acos(dy/m)+sign*Math.PI/4) * 25;
      var y2 = ts.y-Math.cos(Math.acos(dy/m)-sign*Math.PI/4) * 25;
      var r = m/1.75;
      //}
      return 'M' + x1 + ',' + y1 + 'A' + r + ',' + r + ' 0 '+ largeArk + ' 1 ' + x2 + ',' + y2;
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
  //.text(d => {
    //let text = '';
    //if (stateMachine.initialState === d){
        //text += 'start ';
    //}
    //text += 'node ' + (d.name ? d.name : '') + ':\t'+ d.x + ',' +d.y;
    //return text;
  //});
