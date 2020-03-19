<template>
  <div class="flowChartComponent" :style="nodeStyle" 
    v-bind:class="{selected: options.selected === id}"
    @mousedown="handleMousedown">
    <div class="node-port node-input" v-if="type != 'Test'"
      @mousedown="inputMouseDown"
      @mouseup="inputMouseUp($event, 'top')">
    </div>
    <div class="node-left node-input" v-if="type == 'Test'"
      @mousedown="inputMouseDown"
      @mouseup="inputMouseUp($event, 'top-left')">
    </div>
    <div class="node-right node-input" v-if="type == 'Test'"
      @mousedown="inputMouseDown"
      @mouseup="inputMouseUp($event, 'top-right')">
    </div>
    <div class="node-main">
      <button type="button" class="close" onclick="" aria-label="Close">
        <i class="glyphicon glyphicon-remove"></i>
      </button>
      <div class="node-type" v-if="type == 'File'"> 
        <template v-if="attribute.fileName">{{attribute.fileName}}</template> 
        <template v-else>{{type}}</template>
      </div>
      <div class="node-type" v-else> {{type}} </div>
      <div class="node-label">
        <template>
            <flowChartCommmon :type='type' 
            :fileName= 'attribute.fileName'
            @deleteNode='onDeleteNodeClick'
            @onEditClick='onEditClick'
            @onSelectFileClick='onSelectFileClick'
            @onUploadFileClick='onUploadFileClick'></flowChartCommmon>
        </template>
      </div>
    </div>
    <div class="node-port node-output" 
      @mousedown="outputMouseDown($event, 'bottom')">
    </div>
  </div>
</template>

<script>
import flowChartCommmon from './flowChartCommon';

export default {
  name: "flowChartComponent",
  props: {
    id: {
      type: Number,
      default: 1000,
      validator(val) {
        return typeof val === 'number'
      }
    },
    x: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === 'number'
      }
    },    
    y: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === 'number'
      }
    },
    type: {
      type: String,
      default: 'Default'
    },
    label: {
      type: String,
      default: 'input name'
    },
    attribute: {
      type: Object
    },
    options: {
      type: Object,
      default() {
        return {
          centerX: 1024,
          scale: 1,
          centerY: 140,
        }
      }
    }
  },
  created: function() {
    
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  watch: {
    attribute: {
      immediate: true,
      handler(newValue) {
        console.log(newValue)
        this.$forceUpdate();
      }
    }
  },
  computed: {
    nodeStyle() {
      return {
        top: this.options.centerY + this.y * this.options.scale + 'px', // remove: this.options.offsetTop + 
        left: this.options.centerX + this.x * this.options.scale + 'px', // remove: this.options.offsetLeft + 
        transform: `scale(${this.options.scale})`,
      }
    }
  },
  methods: {
    onDeleteNodeClick() {
        this.$emit('onDeleteNodeClick', this.id);
    },
    handleMousedown(e) {
      const target = e.target || e.srcElement;
      if (target.className.indexOf('node-input') < 0 && target.className.indexOf('node-output') < 0) {
        this.$emit('nodeSelected', e);
      }
      e.preventDefault();
    },
    inputMouseDown(e) {
      e.preventDefault();
    },
    inputMouseUp(e, type) {
      this.$emit('linkingStop', type);
      e.preventDefault();
    },
    outputMouseDown(e, type) {
      this.$emit('linkingStart', type);
      e.preventDefault();
    },
    onEditClick() {
      this.$emit('onEditClick', this.id);
    },
    onSelectFileClick() {
      this.$emit('onSelectFileClick', this.id);
    },
    onUploadFileClick() {
      this.$emit('onUploadFileClick', this.id);
    }
  },
  components: {
    flowChartCommmon
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  $themeColor: rgb(255, 136, 85);
  $portSize: 12;
  .flowChartComponent {
    margin: 0;
    width: 240px;
    height: 80px;
    position: absolute;
    box-sizing: border-box;
    border: none;
    background: white;
    z-index: 1;
    opacity: .9;
    cursor: move;
    transform-origin: top left;
    .node-main {
      text-align: center;
      .node-type {
        background: $themeColor;
        color: white;
        font-size: 13px;
        padding: 6px;
      }
      .node-label {
          //TODO fix
        margin-top: 5px;
        font-size: 13px;
      }
    }
    .node-port {
      position: absolute;
      width: #{$portSize}px;
      height: #{$portSize}px;
      left: 50%;
      transform: translate(-50%);
      border: 1px solid #ccc;
      border-radius: 100px;
      background: white;
      &:hover {
        background: $themeColor;
        border: 1px solid $themeColor;
      }
    }
    .node-input {
      top: #{-2+$portSize/-2}px;
    }
    .node-output {
      bottom: #{-2+$portSize/-2}px;
    }
    .node-left {
      position: absolute;
      width: #{$portSize}px;
      height: #{$portSize}px;
      left: 25%;
      transform: translate(-50%);
      border: 1px solid #ccc;
      border-radius: 100px;
      background: white;
      &:hover {
        background: $themeColor;
        border: 1px solid $themeColor;
      }
    }
    .node-right {
      position: absolute;
      width: #{$portSize}px;
      height: #{$portSize}px;
      left: 75%;
      transform: translate(-50%);
      border: 1px solid #ccc;
      border-radius: 100px;
      background: white;
      &:hover {
        background: $themeColor;
        border: 1px solid $themeColor;
      }
    }
  }
  .selected {
    box-shadow: 0 0 0 2px $themeColor;
  }
</style>