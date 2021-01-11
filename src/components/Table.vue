<template>
  <div id="table">
    <p id="customGraphLabel">Expressions</p>

    <hr> <!-- separator -->

    <table id="values">
      <tr v-for="graph in graphs" v-bind:key="graph">
        
        <th class="graphName" :id="'rowGraph' + graph.index" @click="changeVisibility(graph)">
          <input @input="emit" v-model="graph.valueName" placeholder="P0">
            
          <div id="dropdown-content">  
            <tr v-for="color of colors" v-bind:key="color">
              <td @click="changeGraphColor(graph, color)">
                <span class="dot" :style="'background-color:' + color + ';'"></span>
              </td>
            </tr>   
          </div>
       
        </th>      
        <td><input @input="emit" @change="updatePoints" class="graphs" v-model="graph.input" placeholder="y = x"></td>
      </tr>
    </table>
    <table id="buttons"> <!-- + and - buttons -->
      <td class="buttons">
        <button @click="clickPlus">+</button>
      </td>
      <td class="buttons">
        <button @click="clickMinus">−</button> 
      </td>  
    </table>

    <p id="pointsLabel">Points</p>

    <hr> <!-- separator -->
    
    <table id="values">
      <tr>
        <td class="emptyCell"></td>
        <td><input @input="emit" v-model="X" placeholder="X-axis"></td>
        <td><input @input="emit" v-model="Y" placeholder="Y-axis"></td>
      </tr>
      <tr v-for="value in values" v-bind:key="value.index" @click="highlight(value)">
        <th :id="'row' + value.index" @mouseover="setExprBind(value, 'show')" @mouseleave="setExprBind(value, 'hide')">
          <input @blur="clear" @input="emit" v-model="value.valueName" placeholder="Point 1">
          
          <div class="dropdown-contentExpr" :id="'dropdown-contentExpr' + value.index" style="display: none" @mouseover="setExprBind(value, 'show')" @mouseleave="setExprBind(value, 'hide')">  
            <tr v-for="graph in graphs" v-bind:key="graph.index">
              <td :id="value.index + 'Expr' + graph.index" @click="bindExpr(graph, value)">
                <span class="dotExpr">{{graph.valueName}}</span>
              </td>
            </tr>   
          </div>

        </th>      
        <td><input @blur="order" @input="pointExpr(value)" v-model="value.x" placeholder="0"></td>
        <td><input @blur="clear" v-model="value.y" placeholder="0"></td>

        
      </tr>
    </table>

    <table id="buttons"> <!-- + and - buttons -->
      <td class="buttons">
        <button @click="clickPlus('point')">+</button>
      </td>
      <td class="buttons">
        <button @click="clickMinus('point')">−</button> 
      </td>  
    </table>

    <hr> <!-- separator -->
    
    <p id="graphLabel">Connect points</p>

    <label class="switch" > <!-- Connect points toggle -->
      <input id="toggle" @click="connectPoints" @change="emit" type="checkbox" checked="true">
      <span class="slider"></span>
    </label>

    <hr> <!-- separator -->

    <table id="autoscale">
      <td class="buttons">
        <button @click="autoscale">Autoscale</button>
      </td>
    </table>
  </div>
</template>

<script>
var count = 0;
var countGraph = 0;

function cell() {
  this.valueName = 'Point ' + (count + 1);
  this.x = 0;
  this.y = 0;
  this.pointNameVisibility = "hidden"
  this.lock = false;
  this.index = count;
  count++
}
function graph() {
  this.valueName = 'Expr ' + (countGraph + 1);
  this.visibility = "visible"
  this.input = ""
  this.index = countGraph;
  this.converted = "";
  countGraph++
}

export default {
  name: "Table",
  props: {
    points: Object //values from user points UI (userpoint (name, x, y), X and Y axis names, graph toggle)
  },
  data: function() {
      return {
          values: [],
          X: 'X-axis',
          Y: 'Y-axis',
          toggle: false,

          graphs: [],
          colors: ['#cc5534', '#7396ff', '#90E580', '#FFCF00']
      }
  },
  created() {
    this.values[0] = new cell();
    this.graphs[0] = new graph();

    this.graphs[0].color = "#cc5534";

    this.values[0].x = 4.5
    this.values[0].y = 6.5

   
    setTimeout(this.emit, 1);
    setTimeout(this.createColorSelect, 1);
  },
  methods: {
    clickPlus: function(value) {
      if(value == "point") {
        this.values[count] = new cell();  
        setTimeout(() => {this.order()}, 10)
      } else {
        this.graphs[countGraph] = new graph();
        this.graphs[countGraph - 1].color = "#cc5534";
      }
      this.clear();    
    },
    clickMinus: function(value) {
      if(value == "point") {
        if(count > 1) {
          this.values.pop();
          count--
        }
      } else {
        if(countGraph > 1) {
          this.graphs.pop();
          countGraph--
          this.emit()
        }
      }
    },
    connectPoints: function() {
      var checkBox = document.getElementById("toggle");
      if (checkBox.checked == true){
        this.toggle = false;
      } else {
        this.toggle = true;
      }
    },
    emit: function() { //send collected values to graph
      this.$emit('newvalue', {values: this.values, X: this.X, Y: this.Y, toggle: this.toggle, graphs: this.graphs})
    },
    autoscale: function() {
      this.$emit('autoscale')
    },
    order: function() {
      for(var i = 0; i < this.values.length; i++) {
        if(i != this.values.length - 1 && parseFloat(this.values[i].x) > parseFloat(this.values[i + 1].x)) {
          var prev = this.values[i]
          this.values[i] = this.values[i + 1]
          this.values[i + 1] = prev;
          this.order();
        }
        this.values[i].index = this.values.indexOf(this.values[i])
        this.values[i].valueName = "Point " + (this.values[i].index + 1)

       
          for(var c = 0; c < this.graphs.length; c++) {
            document.getElementById(this.values[i].index + 'Expr' + c).style.backgroundColor = "white";
          }
          if(this.values[i].expr != undefined) {
            document.getElementById(this.values[i].index + 'Expr' + this.values[i].expr.index).style.backgroundColor = " #f1f1f1";
          }
      }
      this.clear();
    },
    highlight: function(value) {
      this.clear();
      setTimeout(() => {
        document.getElementById('row' + value.index).style.borderLeft = "2px solid #CD3810";
      }, 2)
    },
    clear: function() {
      setTimeout(() => {
        for(var i = 0; i < this.values.length; i++) {  
          document.getElementById('row' + i).style.borderLeft = "";
        }
      }, 1)
    },
    changeGraphColor: function(value, color) {
      document.getElementById('rowGraph' + value.index).style.borderLeft = "2px solid " + color;
      value.color = color;
      this.changeVisibility(value)
    },
    changeVisibility(value) {
      if(value.visibility == "visible") {
        value.visibility = "hidden"
      } else {
        value.visibility = "visible"
      }
      this.emit();
    },
    status: function() {
      this.values[count] = new cell()
      this.values[count - 1].x = this.points.point.X
      this.values[count - 1].y = this.points.point.Y
      setTimeout(() => {this.order()}, 10)
      
    },
    setExprBind: function(value, visibility) {
      if(visibility == "show") {
        document.getElementById('dropdown-contentExpr' + value.index).style.display = "inline";  
      } else if(visibility == "hide"){
        document.getElementById('dropdown-contentExpr' + value.index).style.display = "none";
      } 
    },
    bindExpr: function(graph, value) {
      for(var i = 0; i < this.graphs.length; i++) {
        document.getElementById(value.index + 'Expr' + i).style.backgroundColor = "white";
      }
      document.getElementById(value.index + 'Expr' + graph.index).style.backgroundColor = " #f1f1f1";
      value.expr = graph;
    },
    pointExpr: function(value) {
        if(value.expr != undefined) {
          var input;

          if(value.expr.input.includes("y = ")) {
            input = value.expr.input.replace("y = ", "")
          } else if(value.expr.input.includes("y=")) {
            input = value.expr.input.replace("y=", "")
          }
          value.y = eval(input.replace("x", value.x)) 
        }
    },
    updatePoints: function() {
      for(var i = 0; i < this.values.length; i++) {
        this.pointExpr(this.values[i])
      }
    }
  }
}
</script>

<style>
#table {
  float: left;
  margin-left: 100px;
  margin-top: 120px;
  margin-right: 100px;
}
#values {  
  border-collapse: collapse;
  margin-right: 0px;
  margin-left: auto;
}
#values .emptyCell {
  border: none;
}
#values input {
  font-size: 15px;
  width: 55px;
  text-align: center;
  border: none;
  float: right;
  clear: both;
}

td, th{
  text-align: center;
  border: 1px solid #ddd;
  padding: 0px; 
  height: 35px;
  width: 60px;
  box-sizing: border-box;
}
#values .graphs {
  box-sizing: border-box;
  width: 110px;
  text-align: left;
  margin-left: 7px; 
}
th {
  -webkit-transition: all 0.1s ease-in-out;
  transition: all 0.1s ease-in-out;
}
th:hover {
  box-sizing: border-box;
  border-left: 2px solid #cc5534;
  -webkit-transition: all 0.1s ease-in-out;
  transition: all 0.1s ease-in-out;
}
#values .graphName {
  border-left: 2px solid #cc5534;
}

hr {
  border: none;
  border-top: 1px solid #ddd;
}

#buttons {
  margin-right: 0px;
  margin-left: auto;
}
.buttons {
  border: none;
  width: 20px;
  height: 20px;
}
.buttons button {
  border: 1px solid #ddd;
  color: rgb(199, 199, 199);
  background-color: white;
  text-align: center;
  font-size: 13px;
  cursor: pointer;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.buttons button:hover {
  background-color: #f0f0f0;
}

.switch {
  margin-top: 0px;
  margin-left: 21px;
  position: relative;
  display: inline-block;
  width: 40px;
  height: 21px;
}
.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(201, 201, 201);
  -webkit-transition: .2s;
  transition: .2s;
  border-radius: 20px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 15px;
  width: 15px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  -webkit-transition: .2s;
  transition: .2s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color:#cc5534;
}
input:checked + .slider:before {
  -webkit-transform: translateX(19px);
  -ms-transform: translateX(19px);
  transform: translateX(19px);
}

#autoscale {
  margin-right: -2px;
  margin-left: auto;
  margin-top: -3px;
}
#graphLabel {
  font-size: 17px;
  margin-top: 2px;
  float: left;
  padding-bottom: 0px
}
#pointsLabel {
  font-size: 17px;
  margin: 0px;
  margin-top: 20px;
  margin-bottom: -6px;
}
#customGraphLabel{
  font-size: 17px;
  margin: 0px;
  margin-bottom: -6px;
}
#graphLabel, #pointsLabel, #customGraphLabel{
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}



#dropdown-content, .dropdown-contentExpr {
  display: none;
  position: absolute;
  width: 40px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
}
#dropdown-content {
  margin-top: -8px;
  left: 61px;
}
.dropdown-contentExpr {
  margin-top: -8px;
  left: 37px;
  width: 60px;
}
#dropdown-content td:hover {background-color: #f1f1f1;}
.dropdown-contentExpr td:hover {background-color: #f1f1f1;}

.graphName:hover #dropdown-content {
  display: inline;
}
.dot {
  margin: auto;
  margin-top: 4px;
  height: 25px;
  width: 25px;
  border-radius: 50%;
  display: block;
}
.dotExpr { 
  width: 60px;
  margin: auto;
  margin-top: 9px;
  height: 24px;
  display: block;
}


</style>