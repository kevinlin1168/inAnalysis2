<template>
  <div>
    
    <el-row class="cardContainer">
        <el-col :span="24">
            <el-card shadow="hover" class="clickable" @click.native="OnProjectCardClick">
                <div class="cardHeader">Project Sum</div>
                <div class="cardMain">
                <div class="number"></div>
                </div>
            </el-card>
        </el-col>
    </el-row>
  </div>
</template>
<script>
import { RPA_getRPA_url, project_getProjectInfo_url } from "@/config/api.js";
import { post } from "@/utils/requests/post.js";
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
        token: '',
        RPAList: []
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
              let rpaList = response.data.data.rpaList;
              for(let index in rpaList) {
                  let projectFrom = {
                    projectID: rpaList[index]['projectID'],
                    token: this.token
                  }
                  post(project_getProjectInfo_url, projectFrom).then(resp => {
                        if (resp.data.status == "success") {
                            Object.assign(rpaList[index], resp.data.data.project);
                        }
                    })
              }
              this.RPAList = rpaList;
              console.log(this.RPAList);
            }
            this.loadingClose();
          },
          () => {
            console.error("getRPAListError");
          }
        );
      }
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
      +.el-card{
          margin-left:20px;
      }
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
</style>