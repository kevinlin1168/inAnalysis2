<template>
  <div class="flowChartContainer" 
    @mousemove="handleMove"
    @mouseup="handleUp">
    <svg width="100%" :height="`${height}px`">
      <flowChartLink v-bind.sync="link" 
        v-for="(link, index) in lines" 
        :key="`link${index}`"
        @deleteLink="linkDelete(link.id)">
      </flowChartLink>
    </svg>
    <flowChartComponent v-bind.sync="node" 
      v-for="(node, index) in scene.nodes" 
      :key="`node${index}`"
      :options="nodeOptions"
      @nodeSelected="nodeSelected(node.id, $event)"
      @linkingStart="linkingStart(node.id)"
      @linkingStop="linkingStop(node.id)">
    </flowChartComponent>
  </div>
</template>

<script>
import flowChartComponent from './flowChartComponent';
import flowChartLink from './flowChartLink';
import { getMousePosition } from './assets/position';
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
      },
      lines() {
        const lines = this.scene.links.map((link) => {
          const fromNode = this.findNodeWithID(link.from)
          const toNode = this.findNodeWithID(link.to)
          let x, y, cy, cx, ex, ey;
          x = this.scene.centerX + fromNode.x;
          y = this.scene.centerY + fromNode.y;
          [cx, cy] = this.getPortPosition('bottom', x, y);
          x = this.scene.centerX + toNode.x;
          y = this.scene.centerY + toNode.y;
          [ex, ey] = this.getPortPosition('top', x, y);
          return { 
            start: [cx, cy], 
            end: [ex, ey],
            id: link.id,
          };
        })
        if (this.draggingLink) {
          let x, y, cy, cx;
          const fromNode = this.findNodeWithID(this.draggingLink.from)
          x = this.scene.centerX + fromNode.x;
          y = this.scene.centerY + fromNode.y;
          [cx, cy] = this.getPortPosition('bottom', x, y);
          // push temp dragging link, mouse cursor postion = link end postion 
          lines.push({ 
            start: [cx, cy], 
            end: [this.draggingLink.mx, this.draggingLink.my],
          })
        }
        return lines;
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
                type: 'File',
                label: 'test1',
              },
              {
                id: 1,
                x: -700,
                y: -69,
                type: 'Preprocessing',
                label: 'test2',
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
          dragging: null,
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
      findNodeWithID(id) {
        return this.scene.nodes.find((item) => {
            return id === item.id
        })
      },
      getPortPosition(type, x, y) {
        if (type === 'top') {
          return [x + 120, y];
        }
        else if (type === 'bottom') {
          return [x + 120, y + 80];
        }
      },
      handleMove(e) {
        if (this.action.linking) {
          [this.mouse.x, this.mouse.y] = getMousePosition(this.$el, e);
          [this.draggingLink.mx, this.draggingLink.my] = [this.mouse.x, this.mouse.y];
        }
        if (this.action.dragging) {
          this.mouse.x = e.pageX || e.clientX + document.documentElement.scrollLeft
          this.mouse.y = e.pageY || e.clientY + document.documentElement.scrollTop
          let diffX = this.mouse.x - this.mouse.lastX;
          let diffY = this.mouse.y - this.mouse.lastY;
          this.mouse.lastX = this.mouse.x;
          this.mouse.lastY = this.mouse.y;
          this.moveSelectedNode(diffX, diffY);
        }
        if (this.action.scrolling) {
          [this.mouse.x, this.mouse.y] = getMousePosition(this.$el, e);
          let diffX = this.mouse.x - this.mouse.lastX;
          let diffY = this.mouse.y - this.mouse.lastY;
          this.mouse.lastX = this.mouse.x;
          this.mouse.lastY = this.mouse.y;
          this.scene.centerX += diffX;
          this.scene.centerY += diffY;
          // this.hasDragged = true
        }
      },
      handleUp() {
        this.action.linking = false;
        this.action.dragging = null;
        this.action.scrolling = false;
        this.draggingLink = null;
      },
      nodeSelected(id, e) {
        this.action.dragging = id;
        this.action.selected = id;
        this.$emit('nodeClick', id);
        this.mouse.lastX = e.pageX || e.clientX + document.documentElement.scrollLeft
        this.mouse.lastY = e.pageY || e.clientY + document.documentElement.scrollTop
      },
      moveSelectedNode(dx, dy) {
        let index = this.scene.nodes.findIndex((item) => {
          return item.id === this.action.dragging
        })
        let left = this.scene.nodes[index].x + dx / this.scene.scale;
        let top = this.scene.nodes[index].y + dy / this.scene.scale;
        this.$set(this.scene.nodes, index, Object.assign(this.scene.nodes[index], {
          x: left,
          y: top,
        }));
      },
      linkingStop(index) {
        // add new Link
        if (this.draggingLink && this.draggingLink.from !== index) {
          // check link existence
          const existed = this.scene.links.find((link) => {
            return link.from === this.draggingLink.from && link.to === index;
          })
          if (!existed) {
            let maxID = Math.max(0, ...this.scene.links.map((link) => {
              return link.id
            }))
            const newLink = {
              id: maxID + 1,
              from: this.draggingLink.from,
              to: index,
            };
            this.scene.links.push(newLink)
            this.$emit('linkAdded', newLink)
          }
        }
        this.draggingLink = null
      },
      linkingStart(index) {
        this.action.linking = true;
        let x, y, cy, cx;
        const fromNode = this.findNodeWithID(index)
        x = this.scene.centerX + fromNode.x;
        y = this.scene.centerY + fromNode.y;
        [cx, cy] = this.getPortPosition('bottom', x, y);
        this.draggingLink = {
          from: index,
          mx: cx,
          my: cy,
        };
      },
    },
    components: {
      flowChartComponent,
      flowChartLink
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