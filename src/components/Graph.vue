<template>
  <div class="spacer">
    <svg id="wrapper" @click="createDetailPoint">
      <line x1="40" y1="490" x2="530" y2="490" stroke="black"/> <!-- X axis line -->
      <line x1="40" y1="0" x2="40" y2="490" stroke="black"/> <!-- Y axis line -->

      <line class="marks" v-for="point in xAxis.points" v-bind:key="point" :x1="point.x + 40" y1="486" :x2="point.x + 40" y2="494" /> <!-- marks on X axis -->
      <line class="marks" v-for="point in yAxis.points" v-bind:key="point" x1="36" :y1="490 -point.x" x2="44" :y2="490 -point.x" /> <!-- marks on Y axis -->

      <line class="grid" v-for="point in xAxis.points" v-bind:key="point" :x1="point.x + 40" y1="0" :x2="point.x + 40" y2="490" /> <!-- vertical grid lines -->
      <line class="grid" v-for="point in yAxis.points" v-bind:key="point" x1="40" :y1="490 -point.x" x2="530" :y2="490 - point.x" /> <!-- horizontal grid lines -->

      
      <text :id="'numberX' + xAxis.points.indexOf(point)" v-for="point in xAxis.points" v-bind:key="point" :x="point.x + 40" y="509" @click="changeStep(point, 'this.xAxis')">{{point.value}}</text> <!-- numbers below marks on X axis -->
      <text :id="'numberY' + yAxis.points.indexOf(point)" v-for="point in yAxis.points" v-bind:key="point" x="26" :y="490 - point.x + 5" @click="changeStep(point, 'this.yAxis')">{{point.value}}</text> <!-- numbers beside marks on Y axis -->
      
      <text class="axis" x="290" y="530">{{values.X}}</text> <!-- name of the X axis -->
      <text class="axis" transform="translate(11,245) rotate(-90)">{{values.Y}}</text> <!-- name of the Y axis -->
    
      <!-- User point details for X-axis -->
      <line class="details" v-for="userPoint in values.values" v-bind:key="userPoint" :x1="userPointX(userPoint) + 40" :y1="490 - userPointY(userPoint)" :x2="userPointX(userPoint)+ 40" y2="507" :visibility="userPoint.pointNameVisibility" />
      <text class="detailsText" v-for="userPoint in values.values" v-bind:key="userPoint" :x="userPointX(userPoint) + 40" y="522" :visibility="userPoint.pointNameVisibility">{{userPoint.x}}</text>
      <!-- User point details for Y-axis -->
      <line class="details" v-for="userPoint in values.values" v-bind:key="userPoint" x1="30" :y1="490 - userPointY(userPoint)" :x2="userPointX(userPoint)+ 40" :y2="490 - userPointY(userPoint)" :visibility="userPoint.pointNameVisibility" />
      <text class="detailsText" v-for="userPoint in values.values" v-bind:key="userPoint" x="15" :y="490 - userPointY(userPoint) + 4" :visibility="userPoint.pointNameVisibility">{{userPoint.y}}</text>

      <text v-for="userPoint in values.values" v-bind:key="userPoint" :x="userPointX(userPoint) + 40" :y="490 - userPointY(userPoint) - 10" :visibility="userPoint.pointNameVisibility">{{userPoint.valueName}}</text>

      <!-- User points -->
      <circle class="userPoints" v-for="userPoint in values.values" v-bind:key="userPoint"  :cx="userPointX(userPoint) + 40" :cy="490 - userPointY(userPoint)" r="3" />
      <svg v-if="values.toggle == false">
        <line class="graph" v-for="userPoint in values.values" v-bind:key="userPoint" :x1="graphX(userPoint) + 40" :y1="490 - graphY(userPoint)" :x2="userPointX(userPoint) + 40" :y2="490 - userPointY(userPoint)" />
      </svg>

      <circle :cx="detailLive.x + 40" :cy="490 - detailLive.y" r="3" fill="#cc5534" :visibility="detailLive.visibility"/>

      <!-- User point hitbox-->
      <circle v-for="userPoint in values.values" v-bind:key="userPoint" @mousedown="visibilityLock(userPoint)" @mouseover="pointNameVisibility(userPoint, 'visible')" @mouseleave="pointNameVisibility(userPoint, 'hidden')" :cx="userPointX(userPoint) + 40" :cy="490 - userPointY(userPoint)" r="10" opacity="0" fill="red"/>

      
    </svg>   
  </div>
  
  {{status}}
</template>

<script>
import $ from 'jquery' 

export default {
  name: 'Graph',
  emits: ['newExprPoint'],
  created() {
    for(var i = 0; i < 11; i++) {
      this.xAxis.points.push({})
      this.xAxis.points[i].x = 500/this.xAxis.pointsNum * (i + 1)
      this.xAxis.points[i].value = (i + 1);

      this.yAxis.points.push({})
      this.yAxis.points[i].x = 500/this.yAxis.pointsNum * (i + 1)
      this.yAxis.points[i].value = (i + 1);
    }   
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
        mult: 1, //numbers on axis multiplier
        step: 1
      },
      yAxis: {
        points: [],
        pointsNum: 11,
        line: 500,
        posSave: 0,
        start: 0,
        drag: 0,
        mult: 1,
        step: 1
      },
      userPoints: [], //points on graph added by user
      s: "", // selected axis
      dragging: false,
      autoscalex: false,
      autoscaley: false,

      args: [],
      newDetail: false,
      detailLive: {x: 0, y: 0, visibility: "hidden"},

      status: ""
    }
  },
  props: {
    values: Object //values from user points UI (userpoint (name, x, y), X and Y axis names, graph toggle)
  },
  methods: {
    startDrag: function(e) {
      //determines if pointer position is valid and if on X or Y axis
      
        if(e.clientY < $("svg").offset().top + 500 && $("svg").offset().top + 480 < e.clientY) {
          this.s = this.xAxis; //selected axis
          this.dragging = true;
          this.xAxis.start = e.clientX;
        } else if(e.clientX < $("svg").offset().left + 50 && $("svg").offset().left + 30 < e.clientX) {
          this.s = this.yAxis;
          this.dragging = true;
          this.yAxis.start = e.clientY;
        }
      
    },
    stopDrag: function(e) {
      if(this.dragging) {
          if(this.s == this.xAxis) {
            this.xAxis.posSave = this.xAxis.posSave + this.xAxis.start - e.clientX //saved position
          } else if(this.s == this.yAxis) {
            this.yAxis.posSave = this.yAxis.posSave + this.yAxis.start - e.clientY
          }
        this.dragging = false
      }
    },
    move: function(e) {
      if(this.dragging || this.autoscalex || this.autoscaley) {
        this.update()

        var cursor;
        if(this.autoscalex && !this.autoscaley) {
          cursor = 0;
          this.s = this.xAxis
        } else if(this.autoscaley) {
          cursor = 0;
          this.s = this.yAxis
        } else if(this.s == this.xAxis) {
          cursor = e.clientX 
        } else {
          cursor = e.clientY  
        }
       
        if(this.s == this.xAxis) {  
          this.s.drag = (this.s.start - cursor)
          this.s.line = 500 - this.s.posSave - this.s.drag;
        } else {
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
        if(this.s.points.length > 20 || this.s.points.length < 6 && this.s.mult > 0.007) {
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
        this.setPointNumbers();
      } else {
        setTimeout(() => {this.liveDetail(e)}, 10)
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
      } else if(this.values.connectZero){
        x = 0;
      } else {
        x = this.userPointX(this.values.values[value.index])
      }
      return x;
    },
    graphY: function(value) { // y1 for connected point lines
      var y;

      if(value.index >= 1) {
        y = this.userPointY(this.values.values[value.index - 1])
      } else if(this.values.connectZero) {
        y = 0;
      } else {
        y = this.userPointY(this.values.values[value.index])
      }
      return y;
    },
    autoscale: async function(event, callback, direction) {
      var pointForX = this.values.values[this.values.values.length - 1]
      var pointForY = this.values.values[0];

      for(var j = 1; j < this.values.values.length; j++) {
        if(parseFloat(this.values.values[j].y) > parseFloat(pointForY.y)) {
          pointForY = this.values.values[j]
        }      
      }
      
      for(var i = 0; i < 9; i++) {
        var saveX = this.xAxis.posSave;
        var saveY = this.yAxis.posSave;
        
        if(direction == "right") {
          this.yAxis.posSave = saveY - 25;
          this.xAxis.posSave = saveX + 25;
        } else if(direction == "left") {
          this.yAxis.posSave = saveY + 25;
          this.xAxis.posSave = saveX - 25;
        }
        if(callback == "both" || callback == "x") {
          this.autoscalex = true; 
          this.move(event)
        }
        if(callback == "both" || callback == "y") {
          this.autoscaley = true;
          this.move(event)
          this.autoscaley = false;
        } 
        await this.sleep(1);
      }
      this.autoscalex = false; 

      if(pointForX.x > this.xAxis.points[this.xAxis.points.length - 2].value && pointForY.y > this.yAxis.points[this.yAxis.points.length - 2].value) {
        this.autoscale(event, "both", "right")
      } else if(pointForX.x > this.xAxis.points[this.xAxis.points.length - 2].value) {
        this.autoscale(event, "x", "right")
      } else if(pointForY.y > this.yAxis.points[this.yAxis.points.length - 2].value) {
        this.autoscale(event, "y", "right")
      } else if(pointForX.x < this.xAxis.points[this.xAxis.points.length - 2].value / 2 && pointForY.y < this.yAxis.points[this.yAxis.points.length - 2].value / 2) {
        this.autoscale(event, "both", "left")
      } else if(pointForX.x < this.xAxis.points[this.xAxis.points.length - 2].value / 2) {
        this.autoscale(event, "x", "left")
      } else if(pointForY.y < this.yAxis.points[this.yAxis.points.length - 2].value / 2) {
        this.autoscale(event, "y", "left")
      }
    },
    sleep: function(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    draw: function(point) {
      if(document.getElementById(point) != null) {
        document.getElementById(point).remove();
      }
      var node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        
      
      var origin = { //origin of axes
        x: 40, 
        y: 490
      };
      var input = this.values.graphs[point].input
      
      
      if(input.includes("x") || /\d/g.test(input)) {
        var inputShort;
        var inputConvertedOne;
        var inputConvertedTwo;

        if(input.includes("y = ")) {
          inputShort = input.replace("y = ", "");
        } else if(input.includes("y=")) {
          inputShort = input.replace("y=", "")
        }
        
        if(input.includes("x")) {
          inputConvertedOne = inputShort.replace("x", "(i - 1) / this.xAxis.points[0].x * this.xAxis.mult")
          inputConvertedTwo = inputShort.replace("x", "i / this.xAxis.points[0].x * this.xAxis.mult")
        } else if (/\d/g.test(input)) {
          inputConvertedOne = inputConvertedTwo = parseFloat(inputShort)
        }
        for (var i = 1; i < 500; i++) {
          var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          var color = this.values.graphs[point].color
          var style = "stroke:" + color + ";stroke-width:2"
          var visibility = this.values.graphs[point].visibility
          
          try {
            line.setAttribute('x1', (i - 1)  + origin.x);
            line.setAttribute('y1', -eval(inputConvertedOne) * this.yAxis.points[0].x / this.yAxis.mult + origin.y);
        
            line.setAttribute('x2', i  + origin.x);
            line.setAttribute('y2', -eval(inputConvertedTwo) * this.yAxis.points[0].x / this.yAxis.mult + origin.y);
          } catch {
            line.setAttribute('x1', 0);
            line.setAttribute('y1', 0);

            line.setAttribute('x2', 0);
            line.setAttribute('y2', 0);
          }

          line.setAttribute('style', style);
          line.setAttribute('visibility', visibility);

          node.appendChild(line);
          node.setAttribute('id', this.values.graphs[point].index)
          
          document.getElementById("wrapper").appendChild(node)
        }
        try {
          this.args[point] = inputConvertedTwo
        } catch {
          this.args[point] = undefined;
        }
      }
    },
    update: function() {
      setTimeout(() => {
        for(var g = 0; g < this.values.graphs.length; g++) {
          this.draw(g)
          if(document.getElementById(g + 1) != null) {
            document.getElementById(g + 1).remove();
          }
        }
      }, 1)
    },
    createDetailPoint: function(e) {
      this.newDetail = true;
      this.liveDetail(e);
    },
    liveDetail: function(e) {
      var i = e.clientX - $("svg").offset().left - 40

      for(var a = 0; a < this.values.graphs.length; a++) {
        var y = Math.floor(eval(this.args[a]) * this.yAxis.points[0].x / this.yAxis.mult)

        if((490 - e.clientY + $("svg").offset().top) < y + 3 && (490 - e.clientY + $("svg").offset().top) > y - 3 && i > 0) {
          this.detailLive.visibility = "visible";
          this.detailLive.x = i;
          this.detailLive.y = y;

          if(this.newDetail &&  this.detailLive.visibility == "visible") {
           this.$emit('newExprPoint', {point: {
              x: i,
              X: (this.detailLive.x/this.xAxis.points[0].x * this.xAxis.mult).toFixed(3),
              y: y,
              Y: (this.detailLive.y/this.yAxis.points[0].x * this.yAxis.mult).toFixed(3)
            }})
          }
        } else {
          this.detailLive.visibility = "hidden";
        }
      }
      this.newDetail = false;
    },
    changeStep: function(point, axis) {
      if(document.getElementById('numberX' + this.xAxis.points.indexOf(point)).style.fontWeight == "") {
        document.getElementById('numberX' + this.xAxis.points.indexOf(point)).style.fontWeight = "500"
      }

      var state = document.getElementById('numberX' + this.xAxis.points.indexOf(point)).style.fontWeight
      this.numberValue = point;
      this.s = eval(axis)

      for(var i = 0; i < this.s.points.length; i++) {
        if(this.s == this.xAxis) {
          document.getElementById('numberX' + i).style.fontWeight = "500";
        } else {
          document.getElementById('numberY' + i).style.fontWeight = "500";
        }
      }
      if(state == "500") {
        document.getElementById('numberX' + this.xAxis.points.indexOf(point)).style.fontWeight = "900"
      } else {
        document.getElementById('numberX' + this.xAxis.points.indexOf(point)).style.fontWeight = "500"
        this.numberValue = undefined;
      }

    },
    stepUpdate: function() {
      if(this.numberValue != undefined) {
        var pointIndex;

        if(this.xAxis.points.includes(this.numberValue)) {
          pointIndex = this.xAxis.points.indexOf(this.numberValue) + 1
          this.s.step = this.values.stepX / pointIndex / this.s.mult;
          this.setPointNumbers()
          for(var i = 0; i < this.xAxis.points.length; i++) {
            document.getElementById('numberX' + i).style.fontWeight = "500";
          }
        } else {
          pointIndex = this.yAxis.points.indexOf(this.numberValue) + 1
          this.s.step = this.values.stepY / pointIndex / this.s.mult;
          this.setPointNumbers()
          for(var j = 0; j < this.yAxis.points.length; j++) {
            document.getElementById('numberY' + j).style.fontWeight = "500";
          }
        }
        this.numberValue = undefined;
      } else {
        if(this.s == this.xAxis) {
          this.s.step = this.values.stepX;
          this.setPointNumbers()
        } else if(this.s == this.yAxis) {
          this.s.step = this.values.stepY;
          this.setPointNumbers()
        }
      }
    }, 
    setPointNumbers: function() {
      for(var c = 0; c < this.s.points.length; c++) {
        var val = (c + 1) * this.s.mult * this.s.step;
        if(val.toString().includes(".") && val.toString().split(".")[1].length > 2) {
          this.s.points[c].value = val.toFixed(2);
        } else {
          this.s.points[c].value = val
        }
      }
    }
  }
}
</script>
<style>
svg{
  width: 530px;
  height: 530px;
}
.spacer {
  width: 530px;
  height: 650px;
  float: left;
  display: flex;
  align-items: flex-end
}
line {
  stroke: rgb(0, 0, 0);
}
text {
  text-anchor: middle; 
  font-size: 12px;
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
  stroke: #CD3810;
  stroke-width: 2px;
}
</style>