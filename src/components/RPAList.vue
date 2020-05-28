<template>
  <div class="RPAList_block">
    <div> 
      Project Type:  
      <el-checkbox-group v-model="selectedProject" @change="fliterRPA">
        <el-checkbox-button v-for="item in projectList" :label="item" :key="item">{{item}}</el-checkbox-button>
      </el-checkbox-group>
    </div>
    <div> 
      Data Type:  
      <el-checkbox-group v-model="selectedData" @change="fliterRPA">
        <el-checkbox-button v-for="item in dataList" :label="item" :key="item">{{item}}</el-checkbox-button>
      </el-checkbox-group>
    </div>
    <div style="margin-top: 15px;">
      <el-input placeholder="please input keyword" v-model="searchWord">
        <el-button slot="append" icon="el-icon-search" @click="searchRPA"></el-button>
      </el-input>
    </div>
    
    <el-row class="cardContainer">
        <el-col>
            <el-card shadow="hover" class="clickable RPAList" v-for="item in displayList" :key="item.RPAID">
             <div class="card-inner">
               <div class="card-left-part">
                 <el-image :src="testingImg" class="rpa-image"></el-image>
               </div>
               <div class="card-right-part">
                 <div class="right-top">
                   <p class="rpa-name">{{item.RPAName}}</p>
                   <el-button type="text" @click="onExportRPAClick(item.projectID)">Export</el-button>
                 </div>
                 <div class="right-middle">
                   <span class="project-type">Project Type: {{item.projectType}}</span>
                   <span class="data-type">Data Type: {{item.dataType}}</span>
                   <span class="user-name">By: {{item.userName}}</span>
                 </div>
                 <div class="right-bottom">
                   <p class="description">
                      {{item.RPADescription}}
                   </p>
                 </div>
               </div>
             </div>
            </el-card>
        </el-col>
    </el-row>
  </div>
</template>
<script>
import { RPA_getRPA_url, project_getProjectInfo_url, system_getDataProject_url, RPA_searchRPA_url  } from "@/config/api.js";
import { exportRPA } from './services/RPAService'
import { post } from "@/utils/requests/post.js";
import organization from "@/assets/organization.png";
export default {
  name: "RPAList",
  created: function() {
    this.fetchData();
  },
  watch: {
    $route: "fetchData"
  },
  data: function() {
    return {
        RPAList: [],
        displayList: [],
        projectList: [],
        dataList: [],
        selectedProject: [],
        selectedData: [],
        testingImg: organization,
        token: '',
        searchWord: ''
    };
  },
  methods: {
    fetchData() {
      if (this.$route.name == "RPAList") {
        this.fullScreenLoading();
        this.token = window.localStorage.getItem("token");
        let userForm = {
          token: this.token
        };
        post(RPA_getRPA_url, userForm).then(
          response => {
            if (response.data.status == "success") {
              this.RPAList = response.data.data.rpaList;
              for(let index in this.RPAList) {
                this.getProjectInfo(index);
              }
              this.displayList = this.RPAList;
            }
            this.loadingClose();
          },
          () => {
            console.error("getRPAListError");
          }
        );
        post(system_getDataProject_url, userForm).then((resp) => {
          if(resp.data.status == 'success') {
            let dataObject = resp.data.data;
            this.dataList = Object.keys(dataObject);
            this.selectedData = this.dataList;
            let projectList = [];
            this.dataList.forEach((key) => {
              dataObject[key].forEach((item) => {
                projectList.push(item);
              })
            })
            this.projectList = this.unique(projectList);
            this.selectedProject = this.projectList;
          }
        })
      }
    },
    getProjectInfo(index) {
        let projectFrom = {
          projectID: this.RPAList[index]['projectID'],
          token: this.token
        }
        post(project_getProjectInfo_url, projectFrom).then(resp => {
            if (resp.data.status == "success") {
              this.$set(this.RPAList[index], 'projectType', resp.data.data.project.projectType);
              this.$set(this.RPAList[index], 'dataType', resp.data.data.project.dataType);
            }
        })
    },
    onExportRPAClick(projectID) {
      exportRPA(JSON.parse(window.localStorage.getItem('user')).userID, projectID, window.localStorage.getItem('token'))
    },
    fullScreenLoading() {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    loadingClose() {
      this.loading.close();
    },
    unique(arr) {
      if (!Array.isArray(arr)) {
          console.log('type error!')
          return
      }
      var array =[];
      for(var i = 0; i < arr.length; i++) {
              if( !array.includes( arr[i]) ) {
                      array.push(arr[i]);
                }
      }
      return array
    },
    fliterRPA() {
      this.displayList = this.RPAList.filter((RPA) => {
        if (this.selectedProject.includes(RPA.projectType) && this.selectedData.includes(RPA.dataType)) {
          return RPA
        }
      })
    },
    searchRPA() {
      this.fullScreenLoading();
      this.token = window.localStorage.getItem("token");
      let userForm = {
        token: this.token,
        keyword: this.searchWord
      };
      post(RPA_searchRPA_url, userForm).then(
        response => {
          if (response.data.status == "success") {
            this.RPAList = response.data.data.rpaList;
            for(let index in this.RPAList) {
              this.getProjectInfo(index);
            }
            this.displayList = this.RPAList;
          }
          this.loadingClose();
        },
        () => {
          console.error("getRPAListError");
        }
      );
    }
  },
  components: {},
  computed: {}
};
</script>
<style lang="scss" scoped>
.head {
  font-size: 16px;
}
.cardContainer {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  @media only screen and (max-width:599px){
      flex-direction: column;
      align-items: center;
  }
  .el-card{
      width:360px;
  @media only screen and (max-width:599px){
      +.el-card{
          margin-left: 0px;
          margin-top:20px;
      }
  }
    @media only screen and (max-width:400px){
        width:100%;
      }
  }
  .clickable {
    cursor: pointer;
  }
  .clickable :hover {
    cursor: pointer;
    background-color: #fef6ed;
  }

  .cardHeader {
    border-bottom-style: solid;
    font-size: 32px;
    border-width: 1px;
    color: #606266;
  }

  .cardMain {
    position: relative;
    height: 200px;
@media only screen and (max-width:599px){
    height: 100px;
  }
    .number {
      font-weight: bold;
      font-size: 56px;
      position: absolute;
      bottom: 10px;
      right: 10px;
      color: #606266;
      @media only screen and (max-width:599px){
      bottom: 0px;
      right: 0px;
  }
    }
  }
}
.cardContainer {
  .el-card.RPAList {
    width: 100%;
    + .RPAList {
      margin-top: 20px;
    }
  }
  .card-inner { 
    display:flex;
    flex-direction: row;

	.card-left-part { 
    margin: 20px;
    width:170px;
		.rpa-image { 
      display: block;
      width:100%;
		}
	}

	.card-right-part { 
    display: flex;
    width: calc(100% - 170px);
    flex-direction: column;
		.right-top { 
      display: flex;
      flex-direction: row;
      margin-bottom: 15px;
			.rpa-name { 
        color: #000000;
        font-weight: bold;
        font-size:24px;
        margin:0;
			}

			button { 
        margin-left: auto;
			}
		}

		.right-middle { 
      margin-bottom:15px;
      color: #666666;
      span + span {
        margin-left: 10px;
      }
			button {
        max-height: 40px;
      }
		}

		.right-bottom { 
			.description { 

			}
		}
	}
}
}
</style>