<template>
  <div id="table">
    <p id="customGraphLabel">Expressions</p>

    <hr> <!-- separator -->

    <table id="values">
      <tr v-for="graph in graphs" v-bind:key="graph">
        <th><input class="graphsName" @input="emit" v-model="graph.valueName" placeholder="P0"></th>      
        <td><input @input="emit" class="graphs" v-model="graph.input" placeholder="y = x"></td>
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
        <th class="emptyCell"></th>
        <th><input @input="emit" v-model="X" placeholder="X-axis"></th>
        <th><input @input="emit" v-model="Y" placeholder="Y-axis"></th>
      </tr>
      <tr v-for="value in values" v-bind:key="value.index">
        <th><input @input="emit" v-model="value.valueName" placeholder="P0"></th>      
        <td @input="order" ><input v-model="value.x" placeholder="0"></td>
        <td><input v-model="value.y" placeholder="0"></td>
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
  this.valueName = 'Graph ' + (countGraph + 1);
  this.pointNameVisibility = "hidden"
  this.input = "y = "
  this.index = countGraph;
  countGraph++
}

export default {
  name: "Table",
  data: function() {
      return {
          values: [],
          X: 'X-axis',
          Y: 'Y-axis',
          toggle: false,

          graphs: []
      }
  },
  created() {
    this.values[0] = new cell();
    this.graphs[0] = new graph();
    setTimeout(this.emit, 1);

    this.values[0].x = 4.5
    this.values[0].y = 6.5
  },
  methods: {
    clickPlus: function(value) {
      if(value == "point") {
        this.values[count] = new cell();  
        this.order();
      } else {
        this.graphs[countGraph] = new graph();
      }    
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
}
#values .emptyCell {
  border: none;
}
#values input {
  font-size: 15px;
  width: 55px;
  text-align: center;
  border: none;
}
#values .graphs {
  width: 98px;
  margin-left: 10px;
  text-align: left;
}
#values .graphsName {
  width: 60px;
}
td {
  text-align: center;
  border: 1px solid #ddd;
  padding: 0px; 
}
th {
  border: 1px solid #ddd;
  height: 35px;
  padding: 0px
}
hr {
  border: none;
  border-top: 1px solid #ddd;
}
#buttons {
  margin-right: 0px;
  margin-left: auto;
}
#autoscale {
  margin-right: -2px;
  margin-left: auto;
  margin-top: -3px;
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
#graphLabel, #pointsLabel #customGraphLabel{
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>