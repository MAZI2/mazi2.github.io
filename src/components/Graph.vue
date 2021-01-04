<template>
  <div id="Graph" @mousedown="startDrag" @mouseup="stopDrag" @mousemove="move" @mouseleave="stopDrag">
    <svg>
      <line x1="40" y1="490" x2="530" y2="490" stroke="black"/> <!-- X axis line -->
      <line x1="40" y1="0" x2="40" y2="490" stroke="black"/> <!-- Y axis line -->

      <line class="marks" v-for="point in xAxis.points" v-bind:key="point" :x1="point.x + 40" y1="486" :x2="point.x + 40" y2="494" /> <!-- marks on X axis -->
      <line class="marks" v-for="point in yAxis.points" v-bind:key="point" x1="36" :y1="490 -point.x" x2="44" :y2="490 -point.x" /> <!-- marks on Y axis -->

      <line class="grid" v-for="point in xAxis.points" v-bind:key="point" :x1="point.x + 40" y1="0" :x2="point.x + 40" y2="490" /> <!-- vertical grid lines -->
      <line class="grid" v-for="point in yAxis.points" v-bind:key="point" x1="40" :y1="490 -point.x" x2="530" :y2="490 -point.x" /> <!-- horizontal grid lines -->

      <text v-for="point in xAxis.points" v-bind:key="point" :x="point.x + 40" y="509">{{point.value}}</text> <!-- numbers below marks on X axis -->
      <text v-for="point in yAxis.points" v-bind:key="point" x="26" :y="490 - point.x + 5">{{point.value}}</text> <!-- numbers beside marks on Y axis -->
      
      <text class="axis" x="290" y="530">{{values.X}}</text> <!-- name of the X axis -->
      <text class="axis" transform="translate(11,245) rotate(-90)">{{values.Y}}</text> <!-- name of the Y axis -->
    
      <!-- User point details for X-axis -->
      <line class="details" v-for="userPoint in values.values" v-bind:key="userPoint" :x1="userPointX(userPoint) + 40" :y1="490 - userPointY(userPoint)" :x2="userPointX(userPoint)+ 40" y2="507" :visibility="userPoint.pointNameVisibility" />
      <text class="detailsText" v-for="userPoint in values.values" v-bind:key="userPoint" :x="userPointX(userPoint) + 40" y="522" :visibility="userPoint.pointNameVisibility">{{userPoint.x}}</text>
      <!-- User point details for Y-axis -->
      <line class="details" v-for="userPoint in values.values" v-bind:key="userPoint" x1="26" :y1="490 - userPointY(userPoint)" :x2="userPointX(userPoint)+ 40" :y2="490 - userPointY(userPoint)" :visibility="userPoint.pointNameVisibility" />
      <text class="detailsText" v-for="userPoint in values.values" v-bind:key="userPoint" x="12" :y="490 - userPointY(userPoint) + 4" :visibility="userPoint.pointNameVisibility">{{userPoint.y}}</text>

      <!-- User points -->
      <circle class="userPoints" v-for="userPoint in values.values" v-bind:key="userPoint"  :cx="userPointX(userPoint) + 40" :cy="490 - userPointY(userPoint)" r="3" />
      <text v-for="userPoint in values.values" v-bind:key="userPoint" :x="userPointX(userPoint) + 40" :y="490 - userPointY(userPoint) - 10" :visibility="userPoint.pointNameVisibility">{{userPoint.valueName}}</text>
      <svg v-if="values.toggle == false">
        <line class="graph" v-for="userPoint in values.values" v-bind:key="userPoint.index" :x1="graphX(userPoint) + 40" :y1="490 - graphY(userPoint)" :x2="userPointX(userPoint) + 40" :y2="490 - userPointY(userPoint)" />
      </svg>

      <!-- User point hitbox-->
      <circle v-for="userPoint in values.values" v-bind:key="userPoint" @mousedown="visibilityLock(userPoint)" @mouseover="pointNameVisibility(userPoint, 'visible')" @mouseleave="pointNameVisibility(userPoint, 'hidden')" :cx="userPointX(userPoint) + 40" :cy="490 - userPointY(userPoint)" r="10" opacity="0" fill="red"/>
    </svg>
  </div>
</template>

<script>
import $ from 'jquery' 

export default {
  name: 'Graph',
  created() {
    for(var i = 0; i < 11; i++) {
      this.xAxis.points.push({})
      this.xAxis.points[i].x = 500/this.xAxis.pointsNum * (i + 1)
      this.xAxis.points[i].value = i + 1;

      this.yAxis.points.push({})
      this.yAxis.points[i].x = 500/this.yAxis.pointsNum * (i + 1)
      this.yAxis.points[i].value = i + 1;
    }
    this.move();
  },
  data: function() {
    return {
      xAxis: {
        points: [],
        pointsNum: 11, //default number of marks on axis
        line: 500, //length of draggable axis
        posSave: 0, //saved position after dragging has stopped
        start: 0, //start position of drag
        drag: 0, //drag length
        mult: 1 //numbers on axis multiplier
      },
      yAxis: {
        points: [],
        pointsNum: 11,
        line: 500,
        posSave: 0,
        start: 0,
        drag: 0,
        mult: 1
      },
      userPoints: [], //points on graph added by user
      s: "", // selected axis
      dragging: false,
    }
  },
  props: {
    values: Object //values from user points UI (userpoint (name, x, y), X and Y axis names, graph toggle)
  },
  methods: {
    startDrag: function(e) {
      //determines if pointer position is valid and if on X or Y axis
      if(e.clientX < $("svg").offset().left + 530 && $("svg").offset().left + 30 < e.clientX && e.clientY < $("svg").offset().top + 510 && $("svg").offset().top < e.clientY) {
        if(e.clientY < $("svg").offset().top + 500 && $("svg").offset().top + 480 < e.clientY) {
          this.s = this.xAxis; //selected axis
          this.dragging = true;
          this.xAxis.start = e.clientX;
        } else if(e.clientX < $("svg").offset().left + 50 && $("svg").offset().left + 30 < e.clientX) {
          this.s = this.yAxis;
          this.dragging = true;
          this.yAxis.start = e.clientY;
        }
      }
    },
    stopDrag: function(e) {
      if(this.dragging) {
        this.dragging = false;
        if(e.clientX < $("svg").offset().left + 530 && $("svg").offset().left < e.clientX && e.clientY < $("svg").offset().top + 530 && $("svg").offset().top < e.clientY) {
          if(this.s == this.xAxis) {
            this.xAxis.posSave = this.xAxis.posSave + this.xAxis.start - e.clientX //saved position
          } else if(this.s == this.yAxis) {
            this.yAxis.posSave = this.yAxis.posSave + this.yAxis.start - e.clientY
          }
        }
      }
    },
    move: function(e) {
      if(this.dragging) {
        var cursor;
       
        if(this.s == this.xAxis) {
          cursor = e.clientX //if selected X axis then use x poisition of pointer, otherwise y
          this.s.drag = (this.s.start - cursor) 
          this.s.line = 500 - this.s.posSave - this.s.drag;
        } else {
          cursor = e.clientY
          this.s.drag = -(this.s.start - cursor)
          this.s.line = 500 + this.s.posSave - this.s.drag;
        }
        
        //adding new point / removing a point
        if(Math.abs(500 - this.s.line) > this.s.points[0].x) {
          if(500 - this.s.line > 0) {
            this.s.pointsNum += 1;
          } else {
            this.s.pointsNum -= 1;
          }
          this.s.line = 500;
          this.s.posSave = 0;
          this.s.drag = 0;
          this.s.start = cursor;
        } 
        for(var i = 0; i < this.s.pointsNum; i++) {
          if(this.s.pointsNum > this.s.points.length) {
            this.s.points.push({});
          } else if(this.s.pointsNum < this.s.points.length) {
            this.s.points.pop();
          }
          this.s.points[i].x = this.s.line/this.s.pointsNum * (i + 1)
        }

        //if axis is divided into more than 20 points, then reset back to 10 and multiply points by 2
        //if axis is divided into less than 5 points, then reset back to 10 and divide points by 2 
        if(this.s.points.length > 20 || this.s.points.length < 6) {
          var n;
          if(this.s.points.length > 20) {
            n = 2;
          } else {
            n = 1/2;
          }
          this.s.points = [];
          this.s.pointsNum = 11;

          for(var f = 0; f < 11; f++) {
            this.s.points.push({});
            this.s.points[f].x = 500/this.s.pointsNum * (f + 1);
          }

          this.s.mult *= n;
        }

        //set point numbers on axis 
        for(var c = 0; c < this.s.points.length; c++) {
          this.s.points[c].value = (c + 1) * this.s.mult;
        }
      }
    },
    userPointX: function(value) { //translate X set by user to actual x position
      var x;

      for(var i = 0; i < this.xAxis.points.length; i++) {
        if(value.x >= this.xAxis.points[i].value) {
          x = this.xAxis.points[i].x + (value.x - this.xAxis.points[i].value)/(this.xAxis.points[1].value - this.xAxis.points[0].value)*(this.xAxis.points[1].x - this.xAxis.points[0].x)
        } else if(value.x < this.xAxis.points[0].value) {
          x = this.xAxis.points[0].x - ((this.xAxis.points[0].value - value.x) / this.xAxis.points[0].value * this.xAxis.points[0].x)
        }
      }
      return x;
    },
    userPointY: function(value) { //translate Y set by user to actual y position
      var y;

      for(var i = 0; i < this.yAxis.points.length; i++) {
        if(value.y >= this.yAxis.points[i].value) {
          y = this.yAxis.points[i].x + (value.y - this.yAxis.points[i].value)/(this.yAxis.points[1].value - this.yAxis.points[0].value)*(this.yAxis.points[1].x - this.yAxis.points[0].x)
        } else if(value.y < this.yAxis.points[0].value) {
          y = this.yAxis.points[0].x - ((this.yAxis.points[0].value - value.y) / this.yAxis.points[0].value * this.yAxis.points[0].x)
        }
      }
      return y;
    },
    pointNameVisibility: function(value, visibility) { //make details of user point visible on mouseover or if toggled by click on point
      if(!value.lock) {
        value.pointNameVisibility = visibility;
      } else {
        value.pointNameVisibility = "visible";
      }
    },
    visibilityLock: function(value) { //toggle visibility of point details
      if(!value.lock) {
        value.lock = true;
      } else {
        value.lock = false;
      }
    },
    graphX: function(value) { // x1 for connected point lines
      var x;

      if(value.index >= 1) {
        x = this.userPointX(this.values.values[value.index - 1])
      } else {
        x = 0;
      }
      return x;
    },
    graphY: function(value) { // y1 for connected point lines
      var y;

      if(value.index >= 1) {
        y = this.userPointY(this.values.values[value.index - 1])
      } else {
        y = 0;
      }
      return y;
    }
  }
}
</script>
<style>
#Graph {
  float: left;
  margin-left: 70px;
}
#Graph svg{
  width: 530px;
  height: 530px;
}
line {
  stroke: rgb(0, 0, 0);
}
text {
  text-anchor: middle; 
  font-size: 12px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.userPoints {
  fill: #CD3810;
}
.marks {
  stroke-width: 1.5px;
}
.grid {
  stroke-opacity: 0.1;
}
.details {
  stroke: #7396ff;
  stroke-width: 2px;
}
.detailsText {
  color: black;
  font-weight: bold;
}
.axis {
  font-weight: bold;
  opacity: 0.3
}
.graph {
  stroke: #eeff00;
  stroke-width: 2px;
}
</style>