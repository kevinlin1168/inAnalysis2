<template>
  <div class="flowChartContainer" 
    @mousemove="handleMove"
    @mouseup="handleUp">
    <svg width="100%" :height="`${height}vh`">
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
      @linkingStop="linkingStop(node.id)"
      @onDeleteNodeClick="nodeDelete"
      @onEditClick="onEditClick"
      @onUploadFileClick="onUploadFileClick"
      @onSelectFileClick="onSelectFileClick">
    </flowChartComponent>
    <div>
      <el-select v-model="selectNodeType" placeholder="Please select a node">
        <el-option
          v-for="item in nodeTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button icon="el-icon-plus" @click="onAddNodeClick"></el-button>
    </div>

    <!--default popup-->
    <el-dialog :title='selectedNode.type' :visible.sync="isShowPopup" width="80%">
      <div>
        <template v-if="selectedNode.type == 'Preprocessing'">
          <preprocessingComponent
          :normalizeOptionList='preprocessingConfig.normalizeOptionList'
          :outlierOptionList='preprocessingConfig.outlierOptionList'
          :characterProcessingOptionList='preprocessingConfig.characterProcessingOptionList'
          :fileID='selectedNode.attribute.fileID'
          :isHasStringType='selectedNode.attribute.isHasStringType'
          :columnList='selectedNode.attribute.columnList'
          :selectAllMissingValue='selectedNode.attribute.selectAllMissingValue'>
          </preprocessingComponent>
        </template>
        <template v-else-if="selectedNode.type == 'Model'">
          <trainModelComponent></trainModelComponent>
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button @click="onEditCancelClick">Cancel</el-button>
          <el-button type="primary" @click="onEditConfirmClick">Confirm</el-button>
      </div>
    </el-dialog>

    <!-- add file pop up -->
    <el-dialog :title='"Upload File"' :visible.sync="isShowUploadFilePopup" width="400px" :before-close="onUploadSelectFileCloce">
        <el-upload
                ref = "upload"
                class = "upload-demo"
                action="no use"
                :http-request="uploadSelectionFile"
                :limit= "1"
                :on-exceed = "handleExceed"
                :multiple = "false"
                :auto-upload= "false"
                :on-change = 'uploadFileChange'
                :on-remove = 'uploadFileRemove'
                :drag = 'isShowUploadBlock'>
            <i class="el-icon-upload" v-if="isShowUploadBlock"></i>
            <div class="el-upload__text" v-if="isShowUploadBlock">Drag file to upload or <em>Click to upload</em></div>
        </el-upload>
        <div slot="footer" class="dialog-footer" v-if="!isShowUploadBlock">
            <el-button style="margin-left: 10px;" size="small" type="success" @click="onSubmitClick">Submit</el-button>
        </div>
    </el-dialog>

    <!--select file popup-->
    <el-dialog :title='"Select File"' :visible.sync="isShowSelectFilePopup">
      <flowChartFile :fileList='fileList' @onSelectFileChange='onSelectFileChange'></flowChartFile>
      <div slot="footer" class="dialog-footer">
          <el-button @click="onSelectFileCancelClick">Cancel</el-button>
          <el-button type="primary" @click="onSelectFileConfirmClick">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import flowChartComponent from './flowChartComponent';
import flowChartLink from './flowChartLink';
import flowChartFile from './flowChartFile';
import preprocessingComponent from '../preprocessingComponent';
import trainModelComponent from '../trainModelComponent';
import { getMousePosition } from './assets/position';
import { file_upload_url, analytic_getPreprocessAlgo_url, file_getColumn_url, file_getFileList_url } from '@/config/api.js';
import { post } from '@/utils/requests/post.js'

export default {
    name: "flowChartContainer",
    created: function() {
      this.fetchData();
    },
    watch: {
      '$route': 'fetchData'
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
                attribute: {}
              },
              {
                id: 1,
                x: -700,
                y: -69,
                type: 'Preprocessing',
                label: 'test2',
                attribute: {}
              },
            ],
            links: [
            ]
          }
        },
      },
      nodeTypeList: {
        type: Array,
        default() {
          return [
            {
              label: 'File',
              value: 'File'
            },{
              label: 'Preprocessing',
              value: 'Preprocessing'
            },{
              label: 'Model',
              value: 'Model'
            },{
              label: 'NewFile',
              value: 'NewFile'
            },{
              label: 'Test',
              value: 'Test'
            }
          ]
        }
      },     
      height: {
        type: Number,
        default: 95,
      },
      projectID : {
        type: String,
        default: '619178b6-f4cb-11e9-9169-9c5c8ebbb826'
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
        selectedNode: {},
        selectNodeType: 'File',
        isShowPopup: false,
        isShowUploadFilePopup: false,
        isShowUploadBlock: true,
        isShowSelectFilePopup: false,
        tempSelectedFile: '',
        preprocessingConfig: {
          normalizeOptionList: [],
          outlierOptionList: [],
          characterProcessingOptionList: []
        },
        fileList: []
      };
    },
    methods:{
      fetchData() {
        let form = {
          token: window.localStorage.getItem('token')
        }
        this.preprocessingConfig.normalizeOptionList = [{
            friendlyname: 'Not to process',
            algoname: ''
        }];
        this.preprocessingConfig.outlierOptionList = [{
            friendlyname: 'Not to process',
            algoname: ''
        }];
        this.preprocessingConfig.characterProcessingOptionList = [{
            friendlyname: 'Not to process',
            algoname: ''
        }];
        post(analytic_getPreprocessAlgo_url, form).then((resp) => {
          if(resp.data.status == 'success') {
            resp.data.data.normalize.forEach((item) => {
                this.preprocessingConfig.normalizeOptionList.push(item);
            });
            resp.data.data.outlierFiltering.forEach((item) => {
                this.preprocessingConfig.outlierOptionList.push(item);
            });
            resp.data.data.stringCleaning.forEach((item) => {
                this.preprocessingConfig.characterProcessingOptionList.push(item);
            });
            console.log(this.preprocessingConfig)
            // this.isReady = true;
          } else {
              console.error(resp);
          }
        }); 
      },
      findNodeWithID(id) {
        return this.scene.nodes.find((item) => {
            return id === item.id
        })
      },
      findNodeIndexWithID(id) {
        return this.scene.nodes.findIndex((item) => {
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
      verifyComponent(from, index) {
        let fromNode = this.findNodeWithID(from);
        let inputNode = this.findNodeWithID(index);
        if(fromNode.type == 'File' && fromNode.attribute.fileID == undefined) {
          this.$message.error('Please select or upload a file first.');
          return false;
        }

        return true;
      },
      setupComponent(from, index) {
        let fromNode = this.findNodeWithID(from);
        let inputNode = this.findNodeWithID(index);
        if(fromNode.type == 'File' && inputNode.type == 'Preprocessing') {
          this.scene.nodes[this.findNodeIndexWithID(index)].attribute['fileID'] = this.scene.nodes[this.findNodeIndexWithID(from)].attribute['fileID'];
          let fileColumnForm = {
            fileID: this.scene.nodes[this.findNodeIndexWithID(index)].attribute['fileID'],
            token: window.localStorage.getItem('token')
          }
          let isHasStringType = false;
          post(file_getColumn_url, fileColumnForm).then((resp) => {
            if(resp.data.status == 'success') {
              let columnList = resp.data.data.cols;
              for(let column of columnList) {
                if(column.type == 'string') {
                  isHasStringType = true;
                }
                column.selectMissingValue = false;
                column.selectOutliersAlgo = '';
                column.selectNormalizeAlgorithm = '';
              }
              this.scene.nodes[this.findNodeIndexWithID(index)].attribute['columnList'] = columnList;
              this.scene.nodes[this.findNodeIndexWithID(index)].attribute['columnListTemp'] =  columnList.map(a => ({...a}));
              this.scene.nodes[this.findNodeIndexWithID(index)].attribute['isHasStringType'] = isHasStringType;
              this.scene.nodes[this.findNodeIndexWithID(index)].attribute['selectAllMissingValue'] = false;
              console.log(this.scene.nodes[this.findNodeIndexWithID(index)]);
            }
          });
        }
      },
      linkingStop(index) {
        // add new Link
        if (this.draggingLink && this.draggingLink.from !== index) {
          // check link existence
          const existed = this.scene.links.find((link) => {
            return link.from === this.draggingLink.from && link.to === index;
          });
          const onlyOneInputCheck = this.scene.links.find((link) => {
            return link.to === index;
          });
          if(onlyOneInputCheck) {
            this.$message({
              type: 'error',
              message: 'You can only input one component.'
            });
          }
          let verify = this.verifyComponent(this.draggingLink.from, index);
          if (!(existed || onlyOneInputCheck) && verify) {
            this.setupComponent(this.draggingLink.from, index);
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
      nodeDelete(id) {
        this.scene.nodes = this.scene.nodes.filter((node) => {
          return node.id !== id;
        })
        this.scene.links = this.scene.links.filter((link) => {
          return link.from !== id && link.to !== id
        })
        // this.$emit('nodeDelete', id)
      },
      onAddNodeClick() {
        let maxID = Math.max(0, ...this.scene.nodes.map((node) => {
          return node.id
        }))

        let newNode = {
          id: maxID+1,
          x: -700,
          y: -69,
          type: this.selectNodeType,
          label: 'test1',
          attribute: {}
        }
        this.scene.nodes.push(newNode);
      },
      onEditClick(id) {
        this.selectedNode = this.findNodeWithID(id);
        if(this.selectedNode.type == 'Preprocessing' && this.selectedNode.attribute.fileID == undefined) {
          this.$message({
            type: 'error',
            message: 'Please link with a file component first.'
          });
        } else {
          this.isShowPopup = true;
        }
        // console.log(this.findNodeIndexWithID(id));
        // console.log(this.scene.nodes[this.findNodeIndexWithID(id)])
      },
      onEditCancelClick() {
        let fromNode = this.findNodeWithID(this.selectedNode.id)
        if(fromNode.type == 'Preprocessing') {
          let columnListTemp = this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['columnListTemp'].map(a => Object.assign({}, a));
          console.log('Object', this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['columnListTemp']);
          console.log('Copy', columnListTemp);
          this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['columnList'] = [];
          this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['columnList'] = columnListTemp;
          // this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['columnList'] = columnListTemp.map(a => ({...a}));
          console.log(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute);
        }
        this.isShowPopup = false;
      },
      onEditConfirmClick() {
        this.isShowPopup = false;
      },
      uploadSelectionFile(params) {
        let fileObj = params.file;
        let form = new FormData();
        form.append("file", fileObj);
        form.append("type", JSON.parse(window.localStorage.getItem('project')).dataType);
        form.append("userID", JSON.parse(window.localStorage.getItem('user')).userID);
        form.append("projectID", this.projectID)
        form.append("token", window.localStorage.getItem('token'))
        this.fullScreenLoading();
        post(file_upload_url, form).then((response) => {
            if (response.data.status == "success") {
                this.loadingClose()
                this.fetchData();
            }
        }).catch((error) => {
            this.loadingClose();
            console.error(error);
        });

        this.$refs.upload.clearFiles();
        this.isShowUploadBlock = true;
        this.isShowUploadFilePopup = false;
      },
      uploadFileRemove() {
          this.isShowUploadBlock = true;
      },
      onSubmitClick() {
          this.$refs.upload.submit();
      },
      handleExceed() {
        this.$message({
          type: 'error',
          message: 'You can only upload one file at a time'
        });
      },
      onUploadFileClick(id) {
        this.isShowUploadFilePopup = true;
        this.selectedNode = this.findNodeWithID(id);
      },
      uploadFileChange(file, fileList) {
        if(fileList.length === 1) {
          this.isShowUploadBlock = false;
        }
      },
      onUploadSelectFileCloce() {
        this.$refs.upload.clearFiles();
        this.isShowUploadBlock = true;
        this.isShowUploadFilePopup = false;
      },
      onSelectFileClick(id) {
        this.selectedNode = this.findNodeWithID(id);
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
        this.isShowSelectFilePopup = true;
      },
      onSelectFileCancelClick() {
        this.isShowSelectFilePopup = false;
      },
      onSelectFileConfirmClick() {
        this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['fileID'] = this.tempSelectedFile;
        let file = this.fileList.filter((item) => {
          return item.fileID == this.tempSelectedFile;
        });
        this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['fileName'] = file[0].fileName + '.' + file[0].fileType;
        this.isShowSelectFilePopup = false;
        console.log(this.scene.nodes)
      },
      onSelectFileChange(selectedFile) {
        console.log(selectedFile)
        this.tempSelectedFile = selectedFile;
      }
    },
    components: {
      flowChartComponent,
      flowChartLink,
      preprocessingComponent,
      trainModelComponent,
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