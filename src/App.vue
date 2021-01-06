<template>
<div id="app" @mousedown="this.$refs.graf.startDrag($event)" @mousemove="this.$refs.graf.move($event)" @mouseup="this.$refs.graf.stopDrag($event)">
  <Table @newvalue="changevalue($event)"></Table>
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
