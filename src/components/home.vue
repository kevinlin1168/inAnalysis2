<template>
  <div>
    <el-row class="cardContainer">
      <el-card shadow="hover" class="clickable" @click.native="OnProjectCardClick">
        <div class="cardHeader">Project Sum</div>
        <div class="cardMain">
          <div class="number">{{projectSum}}</div>
        </div>
      </el-card>
      <el-card shadow="hover" class="clickable" @click.native="OnApiCardClick">
        <div class="cardHeader">Api Sum</div>
        <div class="cardMain">
          <div class="number">{{apiSum}}</div>
        </div>
      </el-card>
    </el-row>
    <el-row class="cardContainer">
      <el-card shadow="never">
        <div class="cardHeader">Model Sum</div>
        <div class="cardMain">
          <div class="number">{{modelSum}}</div>
        </div>
      </el-card>
      <el-card shadow="never">
        <div class="cardHeader">File Sum</div>
        <div class="cardMain">
          <div class="number">{{fileSum}}</div>
        </div>
      </el-card>
    </el-row>
  </div>
</template>
<script>
import { user_getUserInfo_url } from "@/config/api.js";
import { post } from "@/utils/requests/post.js";
export default {
  name: "home",
  created: function() {
    this.fetchData();
  },
  watch: {
    $route: "fetchData"
  },
  data: function() {
    return {
      fileSum: 0,
      modelSum: 0,
      projectSum: 0,
      apiSum: 0,
      loading: {}
    };
  },
  methods: {
    fetchData() {
      if (this.$route.name == "home") {
        this.fullScreenLoading();
        this.token = window.localStorage.getItem("token");
        this.userID = JSON.parse(window.localStorage.getItem("user")).userID;
        let userForm = {
          userID: this.userID,
          token: this.token
        };
        post(user_getUserInfo_url, userForm).then(
          response => {
            if (response.data.status == "success") {
              this.projectSum = response.data.data.projectSum;
              this.fileSum = response.data.data.fileSum;
              this.modelSum = response.data.data.modelSum;
            }
            this.loadingClose();
          },
          () => {
            console.error("getProjectListError");
          }
        );
      }
    },
    OnProjectCardClick() {
      this.$router.push("/project");
    },
    OnApiCardClick() {
      console.warn("ApiCard Click");
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