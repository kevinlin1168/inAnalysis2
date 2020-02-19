<template>
  <div class="flowChartContainer">
    <svg width="100%" :height="`${height}px`">
    </svg>
    <flowChartFile v-bind.sync="node" 
      v-for="(node, index) in scene.nodes" 
      :key="`node${index}`"
      :options="nodeOptions">
    </flowChartFile>
  </div>
</template>

<script>
import flowChartFile from './flowChartFile'
export default {
    name: "flowChartContainer",
    created: function() {
    },
    watch: {
    },
    computed: {
      nodeOptions() {
        return {
          centerY: this.scene.centerY,
          centerX: this.scene.centerX,
          scale: this.scene.scale,
          offsetTop: this.rootDivOffset.top,
          offsetLeft: this.rootDivOffset.left,
          selected: this.action.selected,
        }
      }
    },
    props: {
      scene: {
        type: Object,
        default() {
          return {
            centerX: 1024,
            centerY: 140,
            scale: 1,
            nodes: [
              {
                id: 2,
                x: -700,
                y: -69,
                type: 'Action',
                label: 'test1',
              },
            ],
            links: [
            ]
          }
        }
      },     
      height: {
        type: Number,
        default: 400,
      },
    },
    data() {
      return {
        action: {
          linking: false,
          dragging: false,
          scrolling: false,
          selected: 0,
        },
        mouse: {
          x: 0,
          y: 0,
          lastX: 0,
          lastY: 0,
        },
        draggingLink: null,
        rootDivOffset: {
          top: 0,
          left: 0
        },
      };
    },
    methods:{
    },
    components: {
      flowChartFile
    }
}
</script>

<style lang="scss" scoped>
    .flowChartContainer {
      margin: 0;
      background: #ddd;
      position: relative;
      overflow: hidden;
      svg {
        cursor: grab;
      }
    }
</style>