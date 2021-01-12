<template>
<div id="app" @mousedown="this.$refs.graf.startDrag($event)" @mousemove="move($event)" @mouseup="this.$refs.graf.stopDrag($event)">
  <Table ref="table" @newvalue="changevalue($event)" @autoscale="this.$refs.graf.autoscale($event)" :points="returned"></Table>
  <Graph ref="graf" @newExprPoint="changevalueGraph($event)" :values="sent"></Graph>
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
      returned: [],
      stepSaveX: 0,
      stepSaveY: 0
    }
  },
  components: {
    Graph,
    Table
  },
  methods: {
    changevalue(value) {
      this.sent = value;
      this.$refs.graf.update();

      setTimeout(() => {
        for(var i = 0; i < this.sent.graphs.length; i++) {
          this.$refs.graf.draw(i);
          if(this.stepSaveX != value.stepX || this.stepSaveY != value.stepY)
          this.$refs.graf.stepUpdate();
          this.stepSaveX = value.stepX;
          this.stepSaveY = value.stepY;
        }
      }, 1)
      
    },
    move: function(event) {
      this.$refs.graf.move(event)
    },
    changevalueGraph(value) {
      this.returned = value;
      setTimeout(() => {
        this.$refs.table.status();
      }, 1)
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
