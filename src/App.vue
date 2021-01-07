<template>
<div id="app" @mousedown="this.$refs.graf.startDrag($event)" @mousemove="move($event)" @mouseup="this.$refs.graf.stopDrag($event)">
  <Table @newvalue="changevalue($event)" @autoscale="autoscale($event)"></Table>
  <Graph ref="graf" :values="sent"></Graph>
</div>
</template>

<script>
import Graph from './components/Graph.vue'
import Table from './components/Table.vue'

export default {
  name: 'App',
  data: function() {
    return {
      sent: [],
    }
  },
  components: {
    Graph,
    Table
  },
  methods: {
    changevalue(value) {
      this.sent = value;
    },
    move: function(event) {
      this.$refs.graf.move(event)
    },
    autoscale: async function(event) {
      var point = this.$refs.graf.values.values[this.$refs.graf.values.values.length - 1]
      
      while(point.x > this.$refs.graf.xAxis.points[this.$refs.graf.xAxis.points.length - 2].value) {
        var incr = 0;
        for(var i = 0; i < 20; i++) {
          var save = this.$refs.graf.xAxis.posSave;
          this.$refs.graf.xAxis.posSave = save + 25 + incr*2;
          await this.sleep(1);
          this.$refs.graf.values.autoscalex = true;
          this.$refs.graf.move(event)
          incr += 1
        }
      this.$refs.graf.values.autoscalex = false;
      }

      while(point.y > this.$refs.graf.yAxis.points[this.$refs.graf.yAxis.points.length - 2].value) {
        var incry = 0;
        for(var j = 0; j < 20; j++) {
          var savey = this.$refs.graf.yAxis.posSave;
          this.$refs.graf.yAxis.posSave = savey - 25 - incry*2;
          await this.sleep(1);
          this.$refs.graf.values.autoscaley = true;
          this.$refs.graf.move(event)
          incry += 1;
        }
      this.$refs.graf.values.autoscaley = false;
      }
    },
    sleep: function(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
}
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  width: 2000px;
  height: 2000px;
}
body {
  margin: 0;
  padding: 0;
  background-color:rgb(255, 255, 255);
}
</style>
