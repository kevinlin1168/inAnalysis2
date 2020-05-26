
<template>

  <div class="flowChartContainer" 
    @mousemove="handleMove"
    @mouseup="handleUp">
    <div class="left menu-container">
      <el-menu class="left vertical-menu" @open="leftHandleOpen" @close="leftHandleClose" :collapse="isLeftCollapse">
        <div>
          <button plain=true class="left menu-btn el-icon-d-arrow-left" @click="isLeftCollapse = !isLeftCollapse"></button>
        </div>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-cpu"></i>
            <span slot="title">Component</span>
          </template>
          <el-menu-item 
                v-for="(item, index) in nodeTypeList"
                :index="'1-'+index"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                @click="onAddNodeClick(item.value)"
                v-model="selectNodeType"
                >
              {{item.value}}
              </el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-help"></i>
            <span slot="title">Action</span>
          </template>
        <el-upload
                ref = "importRPA"
                action="no use"
                class="upload"
                :http-request="importRPAFile"
                :limit= "1"
                :on-exceed = "handleExceed"
                :multiple = "false"
                :auto-upload= "true"
                :show-file-list="false">
          <el-menu-item
          :disabled="scene.status == 'processing'"
          index="2-1">
          Import
          </el-menu-item>
        </el-upload>
         <el-menu-item
          @click="onContainerExport"
          :disabled="scene.status == 'processing'"
          index="2-2">
          Export
          </el-menu-item>
           <el-menu-item
           @click="onContainerLoad"
          :disabled="scene.status == 'processing'"
          index="2-3">
          Reset
          </el-menu-item>
           <el-menu-item
           @click="onSaveRPAClick"
          :disabled="scene.status == 'processing'"
          index="2-4">
          Save
          </el-menu-item>
           <el-menu-item
           @click="onRPARun"
          :disabled="scene.status == 'processing'"
          index="2-5">
          Run
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="right menu-container">
      <el-menu class="right vertical-menu" @open="righHandleOpen" @close="rightHandleClose" :collapse="!isShowPopup">
        <div class="right-menu-block">
          <div>
              <button plain=true class="right menu-btn el-icon-close" @click="onEditCancelClick"></button>
          </div>
          <div>
            <template v-if="selectedNode.type == 'Preprocessing'">
              <preprocessingComponent
              :reset='isShowPopup'
              :normalizeOptionList='preprocessingConfig.normalizeOptionList'
              :outlierOptionList='preprocessingConfig.outlierOptionList'
              :characterProcessingOptionList='preprocessingConfig.characterProcessingOptionList'
              :fileID='selectedNode.attribute.fileID'
              :isHasStringType='selectedNode.attribute.isHasStringType'
              :columnList='selectedNode.attribute.columnList'
              :selectAllMissingValue='selectedNode.attribute.selectAllMissingValue'
              :isShowPreview='false'>
              </preprocessingComponent>
            </template>
            <template v-else-if="selectedNode.type == 'Model'">
              <trainModelComponent
              :algorithmList='trainModelConfig.algorithmList'
              :correlationAlgorithmList='trainModelConfig.correlationAlgorithmList'
              :parameterList='selectedNode.attribute.parameterList'
              :columnList='selectedNode.attribute.columnList'
              :algoInputList='selectedNode.attribute.algoInputList'
              :algoOutputList='selectedNode.attribute.algoOutputList'
              :reset='isShowPopup'
              @onSelectAlgorithmChange="onSelectAlgorithmChange"></trainModelComponent>
            </template>
            <template v-else-if="selectedNode.type == 'Filter'">
              <el-form :model="filterForm" ref="filterForm" :rules="filterRules">
                <el-form-item label="Filter Type" prop="filterType">
                  <el-select v-model="filterForm.filterType" placeholder="please select filter type">
                    <el-option class="option" v-for="(item, index) in selectedNode.attribute.metricList" :label="item" :value="item" :key="index"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item  v-for="(item, index) in filterForm.filterValueList" :key="index" :label="'Logic ' + index">
                  <el-col :span="3" :offset="1">
                    <el-input v-model="item.lowerBound" placeholder="lower bound"></el-input>
                  </el-col>
                  <el-col :span="2" :offset="1">
                    <el-select v-model="item.logiclower" placeholder="logic">
                      <el-option class="option" :lable="''" :value="''"></el-option>
                      <el-option class="option" v-for="(item, index) in lowerBoundLogicType" :label="item.label" :value="item.value" :key="index"></el-option>
                    </el-select>
                  </el-col>
                  <el-col class="line" :span="3" :offset="1">metric value</el-col>
                  <el-col :span="2" :offset="1">
                    <el-select v-model="item.logicupper" placeholder="logic">
                      <el-option class="option" :lable="''" :value="''"></el-option>
                      <el-option class="option" v-for="(item, index) in upperBoundLogicType" :label="item.label" :value="item.value" :key="index"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="3" :offset="1">
                    <el-input v-model="item.upperBound" placeholder="upper bound"></el-input>
                  </el-col>
                  <el-col :span="1" :offset="1">
                    <el-button @click.prevent="removeLogic(item)">Delete</el-button>
                  </el-col>
                </el-form-item>
                <el-form-item label="True" prop="portType">
                  <el-select v-model="filterForm.portType" placeholder="please select port">
                      <el-option class="option" v-for="(item, index) in potyTypeOption" :label="item" :value="item" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </template>
          </div>
          <!-- <div slot="footer" class="dialog-footer"> -->
            <div>
              <el-button @click="addLogic" v-if="selectedNode.type == 'Filter'">Add Logic</el-button>
              <el-button @click="onEditCancelClick">Cancel</el-button>
              <el-button type="primary" @click="onEditConfirmClick">Confirm</el-button>
          </div>
        </div>
      </el-menu>
    </div>
    <svg width="100%">
    <!-- :heght="`${height}vh`" -->
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
      :isDisabled="scene.status == 'processing' || isDisabled"
      @nodeSelected="nodeSelected(node.id, $event)"
      @linkingStart="linkingStart(node.id, $event)"
      @linkingStop="linkingStop(node.id, $event)"
      @onTestClick="onTestClick"
      @onDeleteNodeClick="nodeDelete"
      @onEditClick="onEditClick"
      @onUploadFileClick="onUploadFileClick"
      @onSelectFileClick="onSelectFileClick"
      @onDownloadClick="onDownloadClick">
    </flowChartComponent>
    <div class="el-controller">
      <!-- <div class="el-select-block">
        <el-select v-model="selectNodeType" placeholder="Please select a node" :disabled="scene.status == 'processing'">
          <el-option
            v-for="item in nodeTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button icon="el-icon-plus" @click="onAddNodeClick" :disabled="scene.status == 'processing'"></el-button>
      </div> -->
      <!-- <div class="el-button-block">
        <el-upload
                ref = "importRPA"
                action="no use"
                class="upload"
                :http-request="importRPAFile"
                :limit= "1"
                :on-exceed = "handleExceed"
                :multiple = "false"
                :auto-upload= "true"
                :show-file-list="false">
          <el-button :disabled="scene.status == 'processing'">Import</el-button>
        </el-upload>
        <el-button @click="onContainerExport" :disabled="scene.status == 'processing'">Export</el-button>
        <el-button @click="onContainerLoad" :disabled="scene.status == 'processing'">Reset</el-button>
        <el-button @click="onSaveRPAClick" :disabled="scene.status == 'processing'">Save</el-button>
        <el-button @click="onRPARun" :disabled="scene.status == 'processing'">Run</el-button>
      </div> -->
    </div>


    <!--default popup-->
    <!-- <el-dialog :title='selectedNode.type' :visible.sync="isShowPopup" width="80%">
      <div>
        <template v-if="selectedNode.type == 'Model'">
          <trainModelComponent
          :algorithmList='trainModelConfig.algorithmList'
          :correlationAlgorithmList='trainModelConfig.correlationAlgorithmList'
          :parameterList='selectedNode.attribute.parameterList'
          :columnList='selectedNode.attribute.columnList'
          :algoInputList='selectedNode.attribute.algoInputList'
          :algoOutputList='selectedNode.attribute.algoOutputList'
          :reset='isShowPopup'
          @onSelectAlgorithmChange="onSelectAlgorithmChange"></trainModelComponent>
        </template>
        <template v-else-if="selectedNode.type == 'Filter'">
          <el-form :model="filterForm" ref="filterForm" :rules="filterRules">
            <el-form-item label="Filter Type" prop="filterType">
              <el-select v-model="filterForm.filterType" placeholder="please select filter type">
                <el-option class="option" v-for="(item, index) in selectedNode.attribute.metricList" :label="item" :value="item" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item  v-for="(item, index) in filterForm.filterValueList" :key="index" :label="'Logic ' + index">
              <el-col :span="3" :offset="1">
                <el-input v-model="item.lowerBound" placeholder="lower bound"></el-input>
              </el-col>
              <el-col :span="2" :offset="1">
                <el-select v-model="item.logiclower" placeholder="logic">
                  <el-option class="option" :lable="''" :value="''"></el-option>
                  <el-option class="option" v-for="(item, index) in lowerBoundLogicType" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
              </el-col>
              <el-col class="line" :span="3" :offset="1">metric value</el-col>
              <el-col :span="2" :offset="1">
                <el-select v-model="item.logicupper" placeholder="logic">
                  <el-option class="option" :lable="''" :value="''"></el-option>
                  <el-option class="option" v-for="(item, index) in upperBoundLogicType" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
              </el-col>
              <el-col :span="3" :offset="1">
                <el-input v-model="item.upperBound" placeholder="upper bound"></el-input>
              </el-col>
              <el-col :span="1" :offset="1">
                <el-button @click.prevent="removeLogic(item)">Delete</el-button>
              </el-col>
            </el-form-item>
            <el-form-item label="True" prop="portType">
              <el-select v-model="filterForm.portType" placeholder="please select port">
                  <el-option class="option" v-for="(item, index) in potyTypeOption" :label="item" :value="item" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button @click="addLogic" v-if="selectedNode.type == 'Filter'">Add Logic</el-button>
          <el-button @click="onEditCancelClick">Cancel</el-button>
          <el-button type="primary" @click="onEditConfirmClick">Confirm</el-button>
      </div>
    </el-dialog> -->

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

    <!-- save RPA popup-->
    <el-dialog :title='"Save RPA"' :visible.sync="isShowSaveRPApopup" :before-close="onSaveRPACancel">
        <el-form :model="RPAForm" :rules="RPARule" ref="RPAForm">
            <el-form-item label="RPA Name" :label-width="labelWidth" prop="RPAName">
                <el-input v-model="RPAForm.RPAName" placeholder="Please input RPA Name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="RPA Description" :label-width="labelWidth" prop="RPADescription">
                <el-input v-model="RPAForm.RPADescription" placeholder="Please input RPA description"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="onSaveRPACancel">Cancel</el-button>
            <el-button type="primary" @click="onSaveRPAConfirm">Confirm</el-button>
        </div>
    </el-dialog>

    <!-- test model popup-->
    <el-dialog class="filePreview" :title='"Test"' :visible.sync="isShowTestPopup" :show-close='false' width="665px">
      <div class="textBlock" v-if="isShowTestImg && (textPreview !== '' || tablePreview !== '')">
          <div class="title"> Text Preview</div>
          <div class="textPreview">{{textPreview}}</div>
          <div v-for="table in tablePreview" :key="table.tableTitle">
              <div class="subTitle">{{table.tableTitle}}</div>
              <el-table
                  :data="table.tableData"
                  style="width: 100%">
                  <el-table-column
                      :prop="prop"
                      :label="label"
                      width="120"
                      v-for="{ prop, label } in table.tablecolConfigs" :key="prop">
                  </el-table-column>
                  
              </el-table>
          </div>
      </div>
      <div class="imgBlock" v-if="isShowTestImg">
          <div class="title">Chart Preview</div>
          <el-carousel trigger="click" height="400px" width= "625px" :autoplay="false">
              <el-carousel-item v-for="item in modelImgList" :key="item">
                  <div v-html="item">
                  </div>
              </el-carousel-item>
          </el-carousel>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="onTestClose">Close</el-button>
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
import { logicType } from './assets/logicType';
import { file_upload_url, analytic_getPreprocessAlgo_url, file_getColumn_url, file_getFileList_url, analytic_getAnalyticAlgoParam_url, analytic_getAnalyticsAlgoByProject_url, analytic_getCorrelationAlgo_url, model_deleteModelByUID_url, file_download_url } from '@/config/api.js';
import { exportRPA, runRPA, saveRPA, loadRPA, importRPA } from '../services/RPAService'
import { post } from '@/utils/requests/post.js';
import { deleteFile } from '../util/deleteFile';
import { nodeType } from './model/nodeType';

export default {
    name: "flowChartContainer",
    created: function() {
      this.fetchData();
      this.lowerBoundLogicType = logicType.filter((logic) => {return logic.type.indexOf('lower') !== -1});
      this.upperBoundLogicType = logicType.filter((logic) => {return logic.type.indexOf('upper') !== -1});
    },
    destroyed: function() {
      console.log('destroyed')
      // this.clearNewNode();
    },
    watch: {
      '$route': 'fetchData'
    },
    mounted() {
      if(this.$route.name == 'RPA') {
        window.onbeforeunload = function (e) {
          // this.clearNewNode();
          console.log(e)
          e = e || window.event;
        
          // 兼容IE8和Firefox 4之前的版本
          if (e) {
            e.returnValue = '';
          }
        
          // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
          
          return '';
        }
        // window.addEventListener('unload', e => this.clearNewNode(e))
      }
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
          [cx, cy] = this.getPortPosition(link.fromType, x, y);
          x = this.scene.centerX + toNode.x;
          y = this.scene.centerY + toNode.y;
          [ex, ey] = this.getPortPosition(link.toType, x, y);
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
          [cx, cy] = this.getPortPosition(this.draggingLink.fromType, x, y);
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
            ],
            links: [
            ]
          }
        },
      },
      nodeTypeList: {
        type: Array,
        default() {
          return nodeType
        }
      },     
      // height: {
      //   type: Number,
      //   default: 75,
      // }
    },
    data() {
      return {
        isDisabled: false,
        isLeftCollapse: true,
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
        trainModelConfig: {
          algorithmList: [],
          correlationAlgorithmList: []
        },
        fileList: [],
        projectID: '',
        addTimes: 0,
        loading: {},
        RPAForm: {
          RPAName: '',
          RPADescription: ''
        },
        labelWidth: '160px',
        RPARule: {
          RPAName: [
              { required: true, message: 'Please input RPA name', trigger: 'blur' }
          ],
          RPADescription: [
              { required: true, message: 'Please input RPA Description', trigger: 'blur' }
          ]
        },
        textPreview: '',
        modelImgList: [],
        tablePreview: [],
        isShowSaveRPApopup: false,
        isShowTestImg: false,
        isShowTestPopup: false,
        filterForm: {
          portType: '',
          filterType: '',
          filterValueList: [{
            upperBound: '',
            lowerBound: '',
            logicupper: '',
            logiclower: ''
          }]
        },
        filterRules: {
          portType: [
            { required: true, message: 'please select port type', trigger: 'blur' }
          ],
          filterType: [
            { required: true, message: 'please select filter type', trigger: 'blur' }
          ]
        },
        potyTypeOption: [
          'left port',
          'right port'
        ],
        lowerBoundLogicType: [],
        upperBoundLogicType: []
      };
    },
    methods:{
      leftHandleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      leftHandleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      fetchData() {
        if(this.$route.name == 'RPA') {
          this.onContainerLoad();
          this.projectID = JSON.parse(window.localStorage.getItem('project')).projectID;
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
          let algoform = {
            projectID: this.projectID,
            token: window.localStorage.getItem('token')
          }
          post(analytic_getAnalyticsAlgoByProject_url, algoform).then((resp) => {
              if(resp.data.status == 'success') {
                  this.trainModelConfig.algorithmList = resp.data.data;
                  post(analytic_getCorrelationAlgo_url, algoform).then((resp) => {
                      if(resp.data.status == 'success') {
                          this.trainModelConfig.correlationAlgorithmList = resp.data.data;
                      }
                  }).catch((error) => {
                      console.error('getCorrelationAlgoError', error);
                  })
              }
          }).catch((error) => {
              console.error('getAnalyticsAlgoByProjectError', error);
          })
        }
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
        else if (type === 'top-left') {
          return [x + 60, y];
        }
        else if (type === 'top-right') {
          return [x + 180, y];
        }
        else if (type === 'bottom') {
          return [x + 120, y + 80];
        } else if (type === 'bottom-left') {
          return [x + 60, y + 80];
        } else if (type === 'bottom-right') {
          return [x + 180, y + 80];
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
      setupComponent(from, index, fromPort = undefined) {
        let fromNode = this.findNodeWithID(from);
        let inputNode = this.findNodeWithID(index);
        if((fromNode.type == 'File' || fromNode.type == 'Preprocessing') && inputNode.type == 'Preprocessing') {
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
            }
          }).catch(()=> {
          });
          return true;
        } else if ((fromNode.type == 'File' || fromNode.type == 'Preprocessing') && inputNode.type == 'Model') {
          this.scene.nodes[this.findNodeIndexWithID(index)].attribute['fileID'] = this.scene.nodes[this.findNodeIndexWithID(from)].attribute['fileID'];
          this.scene.nodes[this.findNodeIndexWithID(index)].attribute['newFileID'] = this.scene.nodes[this.findNodeIndexWithID(from)].attribute['fileID'];
          let fileColumnForm = {
            fileID: this.scene.nodes[this.findNodeIndexWithID(index)].attribute['fileID'],
            token: window.localStorage.getItem('token')
          }
          post(file_getColumn_url, fileColumnForm).then((resp) => {
            if(resp.data.status == 'success') {
              let columnList = resp.data.data.cols;
              this.scene.nodes[this.findNodeIndexWithID(index)].attribute['columnList'] = columnList;
              this.scene.nodes[this.findNodeIndexWithID(index)].attribute['columnListTemp'] =  columnList.map(a => ({...a}));
              let algoInputList = [];
              let algoOutputList = [];
              algoInputList.forEach((item) => {
                  item['selection'] = [];
              })
              algoOutputList.forEach((item) => {
                  item['selection'] = [];
              })
              this.scene.nodes[this.findNodeIndexWithID(index)].attribute['algoInputList'] = algoInputList;
              this.scene.nodes[this.findNodeIndexWithID(index)].attribute['algoOutputList'] = algoOutputList;
            } else {
                console.warn('getColumn Error', resp.data.msg)
                return false;
            }
          }).catch((error) => {
            console.warn('getColumn Error', error)
            return false
          })
          return true;
        } else if((fromNode.type == 'File' || fromNode.type == 'Preprocessing') && (inputNode.type == 'Test' || inputNode.type == 'Predict')) {
          if(fromNode.type == 'File') {
            this.scene.nodes[this.findNodeIndexWithID(index)].attribute['newFileID'] = this.scene.nodes[this.findNodeIndexWithID(from)].attribute['fileID'];
          }
          return true;
        } else if((fromNode.type == 'Model') && (inputNode.type == 'Test' || inputNode.type == 'Predict' || inputNode.type == 'Filter')) {
          if(inputNode.type == 'Filter') {
            if(fromNode.attribute.selectAlgorithm != '' && fromNode.attribute.selectAlgorithm != undefined) {
              let links = this.scene.links.filter((item) => {
                return item.from === this.selectedNode.id
              });
              links.forEach((link) => {
                let linkedNode = this.findNodeWithID(link.to);
                if(linkedNode.type == 'Filter') {
                  let project = JSON.parse(window.localStorage.getItem('project'));
                  let form = {
                      dataType: project.dataType,
                      projectType: project.projectType,
                      algoName: fromNode.attribute.selectAlgorithm,
                      token: window.localStorage.getItem('token')
                  }
                  post(analytic_getAnalyticAlgoParam_url, form).then((resp) => {
                    if(resp.data.status == 'success') {
                      this.$set(this.scene.nodes[this.findNodeIndexWithID(link.to)].attribute, 'metricList', resp.data.data.metric);
                    }
                  });
                }
              })
            }
            this.scene.nodes[this.findNodeIndexWithID(index)].attribute['fileID'] = this.scene.nodes[this.findNodeIndexWithID(from)].attribute['fileID'];
          }
          return true;
        } else if(fromNode.type == 'Filter') {
          this.scene.nodes[this.findNodeIndexWithID(index)].attribute['fileID'] = this.scene.nodes[this.findNodeIndexWithID(from)].attribute['fileID'];
          //還是在亂寫
          console.log(fromPort)
          if(fromPort == 'bottom-left') {
            console.log(this.scene.nodes[this.findNodeIndexWithID(from)].attribute.left != undefined)
            if(this.scene.nodes[this.findNodeIndexWithID(from)].attribute.left != undefined) {
              this.scene.nodes[this.findNodeIndexWithID(from)].attribute.left['id'] = index;
            } else {
              console.log('here')
              this.scene.nodes[this.findNodeIndexWithID(from)].attribute['left'] = {id: index};
            }
          } else if(fromPort == 'bottom-right') {
            if(this.scene.nodes[this.findNodeIndexWithID(from)].attribute.right != undefined) {
              this.scene.nodes[this.findNodeIndexWithID(from)].attribute.right['id'] = index;
            } else {
              this.scene.nodes[this.findNodeIndexWithID(from)].attribute['right'] = {id: index};
            }
          }
          console.log(this.scene.nodes[this.findNodeIndexWithID(from)])
          return true;
        } else {
          this.$message({
              type: 'error',
              message: 'Link component error.'
            });
          return false
        }
      },
      verifyLinks(index, type, fromIndex) {
        const onlyOneInputCheck = this.scene.links.filter((link) => {
            return link.to === index;
          });
          //TODO must save which port had link
          let nodeType = this.scene.nodes[this.findNodeIndexWithID(index)].type;
          let isMultiInput = (nodeType == 'Test' || nodeType == 'Predict');
          let onlyOneInputFlag = onlyOneInputCheck.length >= 1 ? true : false;
          if(isMultiInput) {
            if(onlyOneInputCheck) {
              for(let index=0; index < onlyOneInputCheck.length; index++) {
                if(onlyOneInputCheck[index].toType == type) {
                  this.$message({
                    type: 'error',
                    message: 'You can not link the same port.'
                  });
                  return false
                }
                if(this.scene.nodes[this.findNodeIndexWithID(fromIndex)].type == this.scene.nodes[this.findNodeIndexWithID(onlyOneInputCheck[index].from)].type) {
                  this.$message({
                    type: 'error',
                    message: 'You can not input the same type of component.'
                  });
                  return false
                }
              }
              if(onlyOneInputCheck.length > 1) {
                this.$message({
                  type: 'error',
                  message: 'Your input more than limit.'
                });
                return false
              }
            }
          } else {
            if(onlyOneInputFlag) {
              this.$message({
                type: 'error',
                message: 'You can only input one component.'
              });
              return false
            }
          }
          return true
      },
      linkingStop(index, type) {
        // add new Link
        if (this.draggingLink && this.draggingLink.from !== index) {
          // check link existence
          const existed = this.scene.links.find((link) => {
            return link.from === this.draggingLink.from && link.to === index;
          });
          let verifyLink = this.verifyLinks(index, type, this.draggingLink.from)
          let verify = this.verifyComponent(this.draggingLink.from, index);
          if ((!(existed) && verifyLink && verify)) {
            let isSuccess = this.setupComponent(this.draggingLink.from, index, this.draggingLink.fromType);
            if(isSuccess) {
              let maxID = Math.max(0, ...this.scene.links.map((link) => {
                return link.id
              }))
              const newLink = {
                id: maxID + 1,
                from: this.draggingLink.from,
                fromType: this.draggingLink.fromType,
                to: index,
                toType: type
              };
              this.scene.links.push(newLink)
              this.$emit('linkAdded', newLink)
              let updateLinks = this.scene.links.filter((item) => {
                return item.from === index
              });
              //clear file id
              while(updateLinks.length != 0) {
                let tempList = [];
                updateLinks.forEach((link) => {
                  this.setupComponent(link.from, link.to);
                  this.$set(this.scene.nodes[this.findNodeIndexWithID(link.to)], 'isComplete', false);
                  let temp = this.scene.links.filter((item) => {
                    return item.from === link.to
                  });
                  tempList = tempList.concat(temp);
                });
                updateLinks = tempList;
              } 
            }
          }
        }
        this.draggingLink = null
      },
      linkingStart(index, type) {
        this.action.linking = true;
        let x, y, cy, cx;
        const fromNode = this.findNodeWithID(index)
        x = this.scene.centerX + fromNode.x;
        y = this.scene.centerY + fromNode.y;
        [cx, cy] = this.getPortPosition(type, x, y);
        this.draggingLink = {
          from: index,
          fromType: type,
          mx: cx,
          my: cy,
        };
      },
      nodeDelete(id) {
        //get delete node attribute
        let deleteNode = this.findNodeWithID(id);
        if(deleteNode.type == 'File' && (deleteNode.attribute.fileID != '' && deleteNode.attribute.fileID != undefined)) {
          deleteFile(deleteNode.attribute.fileID).then((resp) => {
            if(resp.data.status == "success") {
              this.$message({
                  type: 'success',
                  message: 'Delete successfully!'
              });
            }
          })
        } else if(deleteNode.type == 'Preprocessing' && (deleteNode.attribute.newFileID != '' && deleteNode.attribute.newFileID != undefined)) {
          deleteFile(deleteNode.attribute.newFileID).then((resp) => {
            if(resp.data.status == "success") {
              this.$message({
                  type: 'success',
                  message: 'Delete successfully!'
              });
            }
          })
        } else if(deleteNode.type == 'Model' && (deleteNode.attribute.modelID != '' && deleteNode.attribute.modelID != undefined)) {
          let form = {
            modelUID: deleteNode.attribute.modelID,
            token: window.localStorage.getItem('token')
          }
          post(model_deleteModelByUID_url, form).then((resp) => {
              if(resp.data.status == "success") {
                  this.$message({
                      type: 'success',
                      message: 'Delete successfully!'
                  });
              }
          })
        } else if(deleteNode.type == 'Predict' && (deleteNode.attribute.predictFileID != '' && deleteNode.attribute.predictFileID != undefined)) {
          deleteFile(deleteNode.attribute.predictFileID).then((resp) => {
            if(resp.data.status == "success") {
              this.$message({
                  type: 'success',
                  message: 'Delete successfully!'
              });
            }
          });
        }
        //delete link attribute
        let deletedLinks = this.scene.links.filter((item) => {
          return item.from === id 
        });
        //clear file id
        while(deletedLinks.length != 0) {
          let tempList = [];
          deletedLinks.forEach((link) => {
            // this.$set(this.scene.nodes[this.findNodeIndexWithID(link.to)].attribute, 'fileID',"");
            this.$set(this.scene.nodes[this.findNodeIndexWithID(link.to)], 'isComplete', false);
            let temp = this.scene.links.filter((item) => {
              return item.from === link.to
            });
            tempList = tempList.concat(temp);
          });
          deletedLinks = tempList;
        }
        //delete link
        // deletedLinks = this.scene.links.filter((item) => {
        //   return item.from === id 
        // });
        // while(deletedLinks.length != 0) {
        //   let tempList = [];
        //   deletedLinks.forEach((link) => {
        //     let temp = this.scene.links.filter((item) => {
        //       return item.from === link.to
        //     });
        //     tempList = tempList.concat(temp);

        //     this.scene.links = this.scene.links.filter((item) => {
        //       return item.from !== link.to
        //     });
        //   });
        //   deletedLinks = tempList;
        // }
        this.scene.nodes = this.scene.nodes.filter((node) => {
          return node.id !== id;
        })
        this.scene.links = this.scene.links.filter((link) => {
          return link.from !== id && link.to !== id
        })
        // this.$emit('nodeDelete', id)
      },
      linkDelete(id) {
        const deletedLink = this.scene.links.find((item) => {
          return item.id === id;
        });
        if (deletedLink) {
          this.scene.links = this.scene.links.filter((item) => {
              return item.id !== id;
          }); 
          this.$set(this.scene.nodes[this.findNodeIndexWithID(deletedLink.to)].attribute, 'fileID',"")
          // this.$emit('linkBreak', deletedLink);
        }
      },
      onAddNodeClick(selectedNodeType) {
        let maxID = Math.max(0, ...this.scene.nodes.map((node) => {
          return node.id
        }))
        this.addTimes++;
        let selectNode = this.nodeTypeList.filter((item) => {return item.value == selectedNodeType});
        let newNode = {
          id: maxID+1,
          x: -700 + 20 * this.addTimes,
          y: -69 + 10 * this.addTimes,
          type: selectedNodeType,
          label: selectNode[0].label,
          isComplete: false, 
          attribute: {}
        }
        this.scene.nodes.push(newNode);
      },
      onDownloadClick(id) {
        let node = this.findNodeWithID(id);
        let fileForm = {
          fileID: node.attribute.predictFileID,
          fileName: 'default.csv',
          token: window.localStorage.getItem('token')
        }
        console.log('onDownloadClick', node);
        this.fullScreenLoading();
        post(file_download_url, fileForm, {responseType: 'blob'}).then((resp) => {
          this.loadingClose();
          let blob = new Blob([resp.data], {type:resp.headers['content-type']});
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileForm.fileName;
          link.click();
          this.loadingClose();
        }).catch((error) => {
          this.loadingClose();
          console.error(error);
        })
      },
      onTestClick(id) {
        this.selectedNode = this.findNodeWithID(id);
        this.isShowTestImg = false;
        this.fullScreenLoading();
        this.modelImgList = [];
        this.tablePreview = [];
        let bokehVersion = '1.3.4';
        let link = document.createElement('link')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('href', 'https://cdn.pydata.org/bokeh/release/bokeh-' + bokehVersion + '.min.css')
        link.setAttribute('type', 'text/css')
        document.head.appendChild(link)
        // 在header插入js
        let script = document.createElement('script')
        script.setAttribute('src', 'https://cdn.pydata.org/bokeh/release/bokeh-' + bokehVersion + '.min.js')
        script.async = 'async'
        document.head.appendChild(script)
        // cdn的js載入完畢再请求bokeh參數
        let _this = this;
        script.onload = () => {
            let link1 = document.createElement('link')
            link1.setAttribute('rel', 'stylesheet')
            link1.setAttribute('href', 'https://cdn.pydata.org/bokeh/release/bokeh-widgets-' + bokehVersion + '.min.css')
            link1.setAttribute('type', 'text/css')
            document.head.appendChild(link1)
            let script1 = document.createElement('script')
            script1.setAttribute('src', 'https://cdn.pydata.org/bokeh/release/bokeh-widgets-' + bokehVersion + '.min.js')
            script1.async = 'async'
            document.head.appendChild(script1)
            script1.onload = () => {
              _this.textPreview = _this.selectedNode.attribute.testResp.text;
              Object.keys(_this.selectedNode.attribute.testResp.form).forEach((key) => {
                  let object = {
                      tableTitle: key,
                      tablecolConfigs: [],
                      tableData: []
                  }
                  _this.selectedNode.attribute.testResp.form[key].title.forEach((value) => {
                      let colConfig = { prop: value, label: value };
                      object.tablecolConfigs.push(colConfig);
                  })
                  _this.selectedNode.attribute.testResp.form[key].value.forEach((value) => {
                      let valueObject = {};                                        
                      _this.selectedNode.attribute.testResp.form[key].title.forEach((title, index) => {
                          valueObject[title] = value[index];
                      })
                      object.tableData.push(valueObject);
                  })
                  _this.tablePreview.push(object);
              })
              let figObject = _this.selectedNode.attribute.testResp.fig;
              let imgKeyList = Object.keys(figObject);
              imgKeyList.forEach((key) => {
                  _this.modelImgList.push(figObject[key].div);
                  let bokehRunScript = document.createElement('SCRIPT');
                  bokehRunScript.setAttribute('type', 'text/javascript');
                  let t = document.createTextNode(figObject[key].script);
                  bokehRunScript.appendChild(t);
                  document.body.appendChild(bokehRunScript);
              })
              this.loadingClose();
              this.isShowTestImg = true;
              this.isShowTestPopup = true;
          }             
        }
      },
      onTestClose() {
        this.isShowTestPopup = false;
      },
      onEditClick(id) {
        this.selectedNode = this.findNodeWithID(id);
        if((this.selectedNode.type == 'Preprocessing' || this.selectedNode.type == 'Model') && (this.selectedNode.attribute.fileID == undefined || this.selectedNode.attribute.fileID == "")) {
          let message = '';
          if(this.selectedNode.type == 'Preprocessing') {
            message = 'Please link with a file component first.';
          } else if(this.selectedNode.type == 'Model') {
            message = 'Please link with a file or preprocessing component first.';
          }
          this.$message({
            type: 'error',
            message: message
          });
        } else {
          this.isShowPopup = true;
          this.isDisabled = !this.isDisabled;
        }
        // console.log(this.findNodeIndexWithID(id));
        // console.log(this.scene.nodes[this.findNodeIndexWithID(id)])
      },
      onEditCancelClick() {
        let node = this.findNodeWithID(this.selectedNode.id)
        if(node.type == 'Preprocessing') {
          let columnListTemp = this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['columnListTemp'].map(a => Object.assign({}, a));
          this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute, 'columnList',columnListTemp)
          // this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['columnList'] = columnListTemp.map(a => ({...a}));
          console.log(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute);
        } else if (node.type == 'Model') {
          let columnListTemp = this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['columnListTemp'].map(a => Object.assign({}, a));
          this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute, 'columnList',columnListTemp)
          let algoInputList = [];
          let algoOutputList = [];
          algoInputList.forEach((item) => {
              item['selection'] = [];
          })
          algoOutputList.forEach((item) => {
              item['selection'] = [];
          })
          this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute, 'selectAlgorithm', '');
          this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['algoInputList'] = algoInputList;
          this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['algoOutputList'] = algoOutputList;
        }
        this.isShowPopup = false;
        this.isDisabled = !this.isDisabled;
      },
      doFilePreprocessing(fileID, columnList) {
        let action = [];
        let isAlert = false;
        let alertColumnName = '';
        columnList.forEach((item) => {
            if(item.classifiable == "1" && ((item.selectMissingValue) || !(item.selectOutliersAlgo == '' || item.selectOutliersAlgo == undefined) || !(item.selectNormalizeAlgorithm == '' || item.selectNormalizeAlgorithm == undefined) || !(item.selectCharterProcessing == undefined || item.selectCharterProcessing == ''))) {
                isAlert = true;
                alertColumnName = alertColumnName.concat(item.name, ' ');
            }
            let actionItem = {
                'col': item.name,
                "missingFiltering": (item.selectMissingValue) ? '1' : '0' ,
                "outlierFiltering": (item.selectOutliersAlgo == '' || item.selectOutliersAlgo == undefined) ? '0': item.selectOutliersAlgo,
                "normalize": (item.selectNormalizeAlgorithm == '' || item.selectNormalizeAlgorithm == undefined) ? '0': item.selectNormalizeAlgorithm,
                "stringCleaning": (item.selectCharterProcessing == undefined || item.selectCharterProcessing == '') ? Array('0'): item.selectCharterProcessing
            }
            action.push(actionItem);
        })
        if(isAlert) {
            this.$confirm('You are trying to modify a classifiable column ' + alertColumnName + '. Continue?', 'Really?', {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute, 'action', JSON.stringify(action));
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Preprocess cancel'
                });          
            });
        } else {
            this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute, 'action', JSON.stringify(action));
        }
      },
      doModelTrain(algoInputList, algoOutputList, parameterList, selectAlgorithm) {
        let isError = false;
        let errorMassage = '';
        algoInputList.forEach((inputItem) => {
            // check length
            if(inputItem.amount == "single") {
                if(inputItem.selection.length > 1) {
                    isError = true;
                    errorMassage += ' Select more than one Label';
                }
            }
            if(inputItem.selection.length == 0) {
                isError = true;
                errorMassage += ' Do not select label';
            }
            if(this.checkLabelType(inputItem)) {
                isError = true;
                errorMassage += ' Input type error';
            }
        })

        algoOutputList.forEach((outputItem) => {
            if(this.checkLabelType(outputItem)) {
                isError = true;
                errorMassage += ' Output type error';
            }
        })
        if(isError == true) {
            this.$message.error(errorMassage);
        } else {
            let params = {}
            parameterList.forEach((param) => {
                if(param.type == 'bool') {
                    params[param.name] = param.value ? 1 : 0;
                } else {
                    params[param.name] = param.value;
                }  
            })
            let input = {};
            algoInputList.forEach((item) => {
                input[item.name] = [];
                item.selection.forEach((select) => {
                    input[item.name].push(select.name)
                })
            })
            let output = {};
            algoOutputList.forEach((item) => {
                output[item.name] = item.selection[0].name;
            })
            this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute, 'algoName', selectAlgorithm);
            this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute, 'param', JSON.stringify(params));
            this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute, 'input', JSON.stringify(input));
            this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute, 'output', JSON.stringify(output));
        }
      },
      checkLabelType(item) {
          let isError = false;
          
          item.selection.forEach((select) => {
              if(item.type == 'classifiable') {
                  if(select.classifiable !== 1) {
                      isError = true;
                  }
              }else if(item.type == 'float') {
                  if (select.type != 'float' && select.type!= 'int'){
                      isError = true;
                  }
              }else {
                  // string && path
                  if (select.type != item.type) {
                      isError = true;
                  }
              }
          })
          return isError;
      },
      onEditConfirmClick() {
        let node = this.findNodeWithID(this.selectedNode.id)
        this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)], 'isComplete', true);
        if(node.type == 'Preprocessing') {
          this.doFilePreprocessing(node.attribute.fileID, node.attribute.columnList);
          this.isShowPopup = false;
          this.isDisabled = !this.isDisabled;
        } else if (node.type == 'Model') {
          this.doModelTrain(node.attribute.algoInputList, node.attribute.algoOutputList, node.attribute.parameterList, node.attribute.selectAlgorithm);
          this.isShowPopup = false;
          this.isDisabled = !this.isDisabled;
          let links = this.scene.links.filter((item) => {
            return item.from === this.selectedNode.id
          });
          links.forEach((link) => {
            let linkedNode = this.findNodeWithID(link.to);
            if(linkedNode.type == 'Filter') {
              let project = JSON.parse(window.localStorage.getItem('project'));
              let form = {
                  dataType: project.dataType,
                  projectType: project.projectType,
                  algoName: node.attribute.selectAlgorithm,
                  token: window.localStorage.getItem('token')
              }
              post(analytic_getAnalyticAlgoParam_url, form).then((resp) => {
                if(resp.data.status == 'success') {
                  this.$set(this.scene.nodes[this.findNodeIndexWithID(link.to)].attribute, 'metricList', resp.data.data.metric);
                }
              });
            }
          })
        } else if (node.type == 'Filter') {
          this.$refs['filterForm'].validate((valid) => {
            if(valid) {
              if(this.checkLogic(this.filterForm.filterValueList)) {
                this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['metric'] = this.filterForm.filterType;
                this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['metricValue'] = this.transformLogic(this.filterForm.filterValueList);
                //我在亂寫
                if(this.filterForm.portType == 'left port') {
                  if(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute.left) {
                    this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute.left['status'] = true;
                  } else {
                    this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['left'] = {status: true};
                  }
                  if(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute.right) {
                    this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute.right['status'] = false;
                  } else {
                    this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['right'] = {status: false};
                  }
                } else {
                  if(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute.left) {
                    this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute.left['status'] = false;
                  } else {
                    this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['left'] = {status: false};
                  }
                  if(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute.right) {
                    this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute.right['status'] = true;
                  } else {
                    this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['right'] = {status: true};
                  }
                }
                console.log('filter', this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)])
                this.$refs['filterForm'].resetFields();
                this.isShowPopup = false;
                this.isDisabled = !this.isDisabled;

              } else {
                this.$message.error('Logic error. Please check your logic.')
              }
            } else {
              console.log('error', valid)
            }
          });
        }
      },
      uploadFile(params) {
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
              this.loadingClose();
              this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)], 'isComplete', true);
              this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute, 'fileID', response.data.data.fileUid);
              this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute, 'fileName', fileObj.name);
              //delete link attribute
              let uploadLinks = this.scene.links.filter((item) => {
                return item.from === this.selectedNode.id
              });
              console.log('uploadLinks', uploadLinks);
              //clear file id
              while(uploadLinks.length != 0) {
                let tempList = [];
                uploadLinks.forEach((link) => {
                  this.setupComponent(link.from, link.to);
                  this.$set(this.scene.nodes[this.findNodeIndexWithID(link.to)], 'isComplete', false);
                  let temp = this.scene.links.filter((item) => {
                    return item.from === link.to
                  });
                  tempList = tempList.concat(temp);
                });
                uploadLinks = tempList;
              } 
            }
        }).catch((error) => {
            this.loadingClose();
            this.$message.error('Upload file error please try again.');
            console.error(error);
        });

        this.$refs.upload.clearFiles();
        this.isShowUploadBlock = true;
        this.isShowUploadFilePopup = false;
      },
      uploadSelectionFile(params) {
        if(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute.fileID != '' && this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute.fileID != undefined) {
          deleteFile(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute.fileID).then((resp) => {
            if(resp.data.status == "success") {
              this.uploadFile(params);
            }
          }).catch((error) => {
            console.log('error', error);
            this.uploadFile(params);
          })
        } else {
          this.uploadFile(params);
        }
      },
      importRPAFile(params) {
        this.fullScreenLoading();
        importRPA(params.file, JSON.parse(window.localStorage.getItem('user')).userID, this.projectID, window.localStorage.getItem('token')).then(() => {
          this.loadingClose();
          this.onContainerLoad();
        }).catch((error) => {
          this.loadingClose();
          this.$message.error('Import RPA error please try again.');
          console.error(error);
        })

        this.$refs.importRPA.clearFiles();
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
        this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute, 'fileID', this.tempSelectedFile);
        let file = this.fileList.filter((item) => {
          return item.fileID == this.tempSelectedFile;
        });
        this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute, 'fileName', file[0].fileName + '.' + file[0].fileType);
        let links = this.scene.links.filter((link) => {
          return link.from === this.selectedNode.id
        })
        links.forEach((link) => {
          this.setupComponent(link.from, link.to);
        })
        this.isShowSelectFilePopup = false;
        console.log(this.scene.nodes);
        //TODO how to deal with flow
      },
      onSelectFileChange(selectedFile) {
        this.tempSelectedFile = selectedFile;
      },
      onSelectAlgorithmChange(algo) {
        this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute, 'selectAlgorithm', algo);
        // this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['selectAlgorithm'] = algo;
        this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['active'] = 1
        let project = JSON.parse(window.localStorage.getItem('project'));
        let form = {
            dataType: project.dataType,
            projectType: project.projectType,
            algoName: algo,
            token: window.localStorage.getItem('token')
        }
        post(analytic_getAnalyticAlgoParam_url, form).then((resp) => {
            if(resp.data.status == 'success') {
              this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute, 'parameterList', resp.data.data.param);
              this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute, 'algoInputList', resp.data.data.input);
              this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute, 'algoOutputList', resp.data.data.output);
              this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['parameterList'].forEach((item) => {
                  if(item.default !== "" || item.default !== undefined) {
                      if(item.type == 'bool') {
                          item.value = (item.default == '1' ? true : false)
                      } else if (item.type == 'float' || item.type == 'int') {
                          item.value = Number(item.default);
                          if(item.type == 'float') {
                              // TODO can modify 1000 to config;
                              item['step'] = (item.upperBound - item.lowerBound) / 1000;
                          }
                      } else {
                          item.value = item.default;
                      }
                  }
              })
              this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['algoInputList'].forEach((item) => {
                  item['selection'] = [];
              })
              this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['algoOutputList'].forEach((item) => {
                  item['selection'] = [];
              })
              this.$set(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute, 'columnList', this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)].attribute['columnListTemp'].slice());
              console.log(this.scene.nodes[this.findNodeIndexWithID(this.selectedNode.id)])
            }
        }).catch((error) => {
            console.error('getAnalyticAlgoParam Error', error)
        });
      },
      onSaveRPACancel() {
        this.isShowSaveRPApopup = false;
        this.RPAForm = {
          RPAName: '',
          RPADescription: ''
        }
      },
      onSaveRPAClick() {
        this.isShowSaveRPApopup = true;
      },
      onSaveRPAConfirm() {
        this.$refs['RPAForm'].validate((valid) => {
          if(valid) {
            this.onContainerSave(this.RPAForm.RPAName, this.RPAForm.RPADescription).then(() => {
              this.RPAForm = {
                RPAName: '',
                RPADescription: ''
              }
              this.isShowSaveRPApopup = false;
            })
          }
        })
      },
      onContainerSave(name='', description='') {
        return new Promise((resolve, reject) => {
          let nodeTemp =  this.scene.nodes.map(a => ({...a}));
          saveRPA(JSON.parse(window.localStorage.getItem('user')).userID, JSON.parse(window.localStorage.getItem('project')).projectID, window.localStorage.getItem('token'), name, description, JSON.stringify(this.scene)).then(() => {
            resolve();
          }).catch((error) => {
            reject(error);
            this.scene.nodes = nodeTemp.map(a => ({...a}));
            console.error('onContainerSaveError', error);
          })
        })
      },
      onContainerLoad() {
        // this.clearNewNode();
        loadRPA(JSON.parse(window.localStorage.getItem('user')).userID, JSON.parse(window.localStorage.getItem('project')).projectID, window.localStorage.getItem('token')).then((resp) => {
          if(resp.data.data == "") {
            this.scene = {
              centerX: 1024,
              centerY: 140,
              scale: 1,
              project: JSON.stringify(window.localStorage.getItem('project')),
              nodes: [
              ],
              links: [
              ]
            }
          } else {
            let response = JSON.parse(resp.data.data);
            this.scene = response;
          }
        }).catch((error) => {
          console.error('onContainerloadError', error);
        })
      },
      onContainerExport() {
        this.onContainerSave().then(() => {
          exportRPA(JSON.parse(window.localStorage.getItem('user')).userID, JSON.parse(window.localStorage.getItem('project')).projectID, window.localStorage.getItem('token'))
        })
      },
      fullScreenLoading() {
        this.loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
      },
      loadingClose() {
          this.loading.close();
      },
      onRPARun() {
        let isError = false;
        this.scene.nodes.forEach((node) => {
          node.isRoot = true;
          if(node.isComplete == false && (node.type != 'Test' && node.type != 'Predict')) {
            isError = true;
          }
          if(node.type == 'Test' || node.type == 'Predict') {
            // node.attribute.newFileID = '';
            node.isComplete = false;
            node.attribute.modelID = '';
          }
          this.scene.links.forEach((link) => {
            if(link.to == node.id) {
              node.isRoot = false;
            }
          })
        })
        if(!isError) {
          this.onContainerSave().then(() => {
            runRPA(JSON.parse(window.localStorage.getItem('user')).userID, this.projectID, window.localStorage.getItem('token')).then(() => {
              this.onContainerLoad();
            }).catch((error) => {
              console.error('error', error)
            })
          })
        } else {
          this.$message.error('Node do not setup');
        }
      },
      addLogic() {
        this.filterForm.filterValueList.push({
          upperBound: '',
          lowerBound: '',
          logicupper: '',
          logiclower: ''
        })
      },
      removeLogic(item) {
        let index = this.filterForm.filterValueList.indexOf(item)
        if (index !== -1) {
          this.filterForm.filterValueList.splice(index, 1)
        }
      },
      checkLogic(logicList) {
        let status = true;
        logicList.forEach((logic) => {
          if(logic.logicupper == '' && logic.logiclower == '') {
            status = false;
          } else if (logic.logicupper != '' && logic.upperBound == '') {
            status = false;
          } else if (logic.logiclower != '' && logic.lowerBound == '') {
            status = false;
          }
        })
        return status;
      },
      transformLogic(logicList) {
        //轉乘python fuction 用 TODO
        let execString = '';
        logicList.forEach((logic) => {
          let tempString = ''
          if(logic.logicupper != '' && logic.logiclower != '') {
            tempString = logic.lowerBound  + ' '  + logic.logiclower + ' x' + ' and ' + 'x ' + logic.logicupper + ' ' + logic.upperBound
          } else if (logic.logicupper != '') {
            tempString = 'x ' + logic.logicupper + ' ' + logic.upperBound
          } else if (logic.logiclower != '') {
            tempString = logic.lowerBound  + ' '  + logic.logiclower + ' x'
          }
          if(execString != '') {
            execString += ' or ' + '(' + tempString + ')';
          } else {
            execString += '(' + tempString + ')';
          }
        })
        return execString;
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

<style lang="scss">
.flowChartContainer {
  position: relative;
  .menu-container {
    position: absolute;
    height: 100%;
    z-index: 10;
    top: 0px;
    &.left {
      left: 0px;
    }
    &.right {
      right: 0px;
    }

  }
}
  .el-upload {
      display: block;
      width: 100%;
    }
  .vertical-menu.el-menu {
    height: 100%;
    border: none;
    max-height: 705px;
    overflow-y: auto;
    background-color: white;
    &.right {
      width: 0;
      .right-menu-block {
          padding-left: 20px;
          .el-steps {
            display: none;
          }
          .el-form {
            .el-form-item {
              .line.el-col-3 {
                width:40px;
                line-height: normal;
              }
              .el-col-2 {
                width: 90px;
              }
              .el-col-3 {
                width: 115px;
              }
              .el-col-offset-1 {
                margin-left: 15px;
                .el-button {
                  padding: 12px 5px;
                }
              }
            }
          }
      }
      &.el-menu--collapse{
        .right-menu-block {
          display: none;
        }
      }
      &:not(.el-menu--collapse) {
      width: 700px;
      .preProcessing {
        .el-col {
          &.el-col-4 {
            width: 21%
          }
          &.el-col-5 {
            width: 26.3%
          }
          &.el-col-1 {
            width: 5.26%
          }
        }
      }
      .selectBlockWrapper {
        display: none;
      }
      .selectFeature {
        width: 100%;
        margin-left: 0px;
      }
      .selectLabelBlock {
        align-items: flex-start;
        .inputBlock {
          width: 47%;
          margin-left: 0px;
        }
        .outputBlock {
          width: 47%;
          margin-left: auto;
        }
      }
      .parameter {
        .el-tooltip {
          margin-left: 0px;
        }
      }
    }
    }
    &:not(.el-menu--collapse) {
      width: 200px;
    }
    &.el-menu--collapse {
       .menu-btn {
        transform: rotate(180deg);
        &.left {
          margin-right: 15px;
        }
      }
    }
    .menu-btn {
      &.right {
        padding-left: 0px;
        padding-right: 0px;
      }
      &.left {
        margin: 5px 10px 5px auto;
      }
      display: block;
      border: none;
      color: #909399;
      background-color: transparent;
      transition: transform .3s;
    }
    .el-menu-item{
      text-align: left;
      color: #606266;
      &.is-active {
        color: #606266;
      }
    }
  }
  .el-menu--vertical {
    .el-menu-item{
      text-align: left;
      color: #606266;
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      &.is-active {
        color: #606266;
      }
    }
  }
    .flowChartContainer {
      // height: 100%;
      margin: 0;
      background: #ddd;
      position: relative;
      overflow: hidden;
      svg {
        min-height: 705px;
        cursor: grab;
      }
      .el-controller{
        display: flex;
        // .el-button-block{
        //   margin-left: auto;
        // }
        .el-button {
          margin-left: 10px;
        }
      }
    }

    .filePreview {
        .textBlock {
            .title {
                font-size: 18px;
            }
            .subTitle {
                font-size: 14px;
            }
            .textPreview {
                margin-top: 10px;
                white-space: pre-wrap;
            }
        }
        .imgBlock{
            width: 625px;
            .title {
                // text-align: center;
                font-size: 18px;
            }
        }
    }
</style>