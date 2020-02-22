<template>
  <div class="flowChartComponent" :style="nodeStyle" 
    v-bind:class="{selected: options.selected === id}"
    @mousedown="handleMousedown">
    <div class="node-port node-input"
      @mousedown="inputMouseDown"
      @mouseup="inputMouseUp">
    </div>
    <div class="node-main">
      <button type="button" class="close" onclick="" aria-label="Close">
        <i class="glyphicon glyphicon-remove"></i>
      </button>
      <div class="node-type"> {{type}} </div>
      <div class="node-label">
        <template v-if="type == 'File'">
            <flowChartFile :projectID='projectID'></flowChartFile>
        </template>
        <template v-if="type != 'File'">
            <flowChartCommmon></flowChartCommmon>
        </template>
      </div>
    </div>
    <div class="node-port node-output" 
      @mousedown="outputMouseDown">
    </div>
    <div v-show="show.delete" class="node-delete">&times;</div>
  </div>
</template>

<script>
import { file_getFileList_url } from '@/config/api.js';
import { post } from '@/utils/requests/post.js';
import flowChartFile from './flowChartFile';
import flowChartCommmon from './flowChartCommon';

export default {
  name: "flowChartComponent",
  props: {
    projectID : {
      type: String,
      default: '619178b6-f4cb-11e9-9169-9c5c8ebbb826'
    },
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
    let form = {
        projectID: this.projectID,
        token: window.localStorage.getItem('token')
    }
    post(file_getFileList_url, form).then((resp) => {
        if(resp.data.status == "success") {
            this.fileList = resp.data.data.fileList;
        } else {
            console.error('getFileListError', resp.data.msg)
        }
    });
  },
  data() {
    return {
      show: {
        delete: false,
      },
      fileList: [],
      selectFile: {}
    }
  },
  mounted() {
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
    handleMousedown(e) {
      const target = e.target || e.srcElement;
      console.log(target);
      if (target.className.indexOf('node-input') < 0 && target.className.indexOf('node-output') < 0) {
        this.$emit('nodeSelected', e);
      }
      e.preventDefault();
    },
    inputMouseDown(e) {
      e.preventDefault();
    },
    inputMouseUp(e) {
      this.$emit('linkingStop')
      e.preventDefault();
    },
    outputMouseDown(e) {
      this.$emit('linkingStart')
      e.preventDefault();
    },
  },
  components: {
    flowChartFile,
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
    .node-delete {
      position: absolute;
      right: -6px;
      top: -6px;
      font-size: 12px;
      width: 12px;
      height: 12px;
      color: $themeColor;
      cursor: pointer;
      background: white;
      border: 1px solid $themeColor;
      border-radius: 100px;
      text-align: center;
      &:hover{
        background: $themeColor;
        color: white;
      }
    }
  }
  .selected {
    box-shadow: 0 0 0 2px $themeColor;
  }
</style>