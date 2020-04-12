<template>
  <div class="RPAList_block">
    <el-row class="cardContainer">
        <el-col>
            <el-card shadow="hover" class="clickable RPAList" @click.native="OnProjectCardClick">
             <div class="card-inner">
               <div class="card-left-part">
                 <el-image :src="testingImg" class="rpa-image"></el-image>
               </div>
               <div class="card-right-part">
                 <div class="right-top">
                   <p class="rpa-name">RPA_NAME</p>
                   <button>Export</button>
                 </div>
                 <div class="right-middle">
                   <span class="project-type">計畫類別</span>
                   <span class="data-type">資料類別</span>
                 </div>
                 <div class="right-bottom">
                   <p class="description">
                      臣亮言：先帝創業未半，而中道崩殂。今天下三分，益州
                      疲弊，此誠危急存亡之秋也。然侍衛之臣，不懈於內；忠志之
                      士，忘身於外者，蓋追先帝之殊遇，欲報之於陛下也。
                   </p>
                 </div>
               </div>
             </div>
            </el-card>
            <el-card shadow="hover" class="clickable RPAList" @click.native="OnProjectCardClick">
             <div class="card-inner">
               <div class="card-left-part">
                 <el-image :src="testingImg" class="rpa-image"></el-image>
               </div>
               <div class="card-right-part">
                 <div class="right-top">
                   <p class="rpa-name">RPA_NAME</p>
                   <button>Export</button>
                 </div>
                 <div class="right-middle">
                   <span class="project-type">計畫類別</span>
                   <span class="data-type">資料類別</span>
                 </div>
                 <div class="right-bottom">
                   <p class="description">
                      臣亮言：先帝創業未半，而中道崩殂。今天下三分，益州
                      疲弊，此誠危急存亡之秋也。然侍衛之臣，不懈於內；忠志之
                      士，忘身於外者，蓋追先帝之殊遇，欲報之於陛下也。
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
import { RPA_getRPA_url, project_getProjectInfo_url } from "@/config/api.js";
import { post } from "@/utils/requests/post.js";
import testingImg from "@/assets/test-img.jpg";
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
        testingImg: testingImg,
        token: ''
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
                  console.log(rpaList[index]);
              }
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
			.rpa-name { 

			}

			button { 
        margin-left: auto;
			}
		}

		.right-middle { 

      span + span {
        margin-left: 10px;
      }
			.project-type { 

			}

			.data-type { 

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