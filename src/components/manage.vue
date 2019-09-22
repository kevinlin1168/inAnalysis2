<template>
  <el-container style="height: 100%">
    <el-alert
      title="This is BETA version. Your account could be deleted after release."
      type="warning"
    ></el-alert>
    <el-header class="header">
      <div class="leftBlock">
        <el-link :underline="false" @click="onHomeClick">
          <i class="fas fa-hand-spock icon-left"></i> <span> InAnalysis</span>
        </el-link>
        <el-link class="button" @click="onProjectMangementClick">
          <i class="fas fa-sitemap icon-right"></i> <span>Management</span>
        </el-link>
        <el-link class="button">
          <i class="fas fa-map-signs icon-right"></i><span> Management</span>
        </el-link>
      </div>
      <div class="rightBlock">
        <el-link class="button">
          <i class="fas fa-file-alt icon-right"></i><span>Document</span>
        </el-link>
        <el-link class="button">
          <i class="fas fa-user icon-right"></i><span>
          {{userName}}</span>
        </el-link>
        <el-link class="button" @click="onSignOutClick">
          <i class="fas fa-sign-out-alt icon-right"></i><span>Sign Out</span>
        </el-link>
      </div>
    </el-header>
    <el-container>
      <el-main class="main">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
      <el-footer class="footer">
        <div>Copyright © InAnalysis | Designed by Wel-Chieh Liao</div>
      </el-footer>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: "manage",
  data: function() {
    return {
      userName: JSON.parse(window.localStorage.getItem("user")).userName
    };
  },
  methods: {
    onProjectMangementClick() {
      this.$router.push("/project");
    },
    onSignOutClick() {
      window.localStorage.setItem("isLogin", false);
      this.$router.push("/");
    },
    onHomeClick() {
      this.$router.push("/home");
    }
  },
  components: {},
  computed: {}
};
</script>
<style lang="scss" scoped>
.el-alert{
    min-height: 40px;
}
.header {
  font-size: 12px;
  background-color: #e7e7e7;
  display: flex;
  align-items: center;
  color: gray;
.header-wrapper{
    width:100%;
 display: flex;
  align-items: center;
}
  .icon-left {
    margin-left: 5px;
  }

  .icon-right {
    margin-right: 5px;
  }

  .leftBlock {
    height: 50%;
    display: flex;
    align-items: center;

    .button {
      align-items: center;
          margin-left: 20px;
    }

    .el-link {
      font-size: 16px;
      @media screen and (max-width:767px){
      .el-link--inner{
          >span{
              display: none;
          }
      }
      }
    }
  }

  .rightBlock {
    height: 50%;
    display: flex;
    margin-left: auto;
    align-items: center;
    justify-content: flex-end;
    .button {
      align-items: center;
      display: block;
      +.button{
          margin-left: 20px;
      }
    }

    .el-link {
      font-size: 16px;
         @media screen and (max-width:767px){
      .el-link--inner{
          >span{
              display: none;
          }
      }
      }
    }
  }
}

.aside {
  background-color: #e7e7e7;
  width: 20%;
  height: 100%;

  .menu {
    background-color: #e7e7e7;

    .submenu {
      background-color: white;
    }
  }
}

.main {
  width: 100%;
  height: 100%;
}

.footer {
  font-size: 16px;
  background-color: #e7e7e7;
  display: flex;
  align-items: center;
  color: gray;
  align-items: center;
  justify-content: flex-end;
}
</style>