<template>
  <div>
    <div v-if="!isAvailable">
      <div class="unavailable">
        <span>This page is not available</span>
      </div>
    </div>
    <div v-if="isAvailable">
      <div class="info-block">
        <div class="course-name">
          <span>{{course.courseName}}</span>
        </div>
        <div class="hw-name">
          <span>{{course.jobName}}</span>
        </div>
        <div class="time-info">
          <div class="left div-block">
            <span>開課年份：{{course.courseYear}}</span>
          </div>
          <div class="right div-block">
            <span>截止日期：{{course.deadline}}</span>
          </div>
        </div>
      </div>
      <table>
        <tr>
          <th>姓名</th>
          <th>學號</th>
          <th class="slider-col">評分</th>
        </tr>
        <tr v-for="(parameter, index) in course.judgeList" :key="index">
          <td :key="parameter.name">{{parameter.name}}</td>
          <td :key="parameter.id">{{parameter.id}}</td>
          <td>
            <div class="slider-desktop">
              <el-slider
                v-model="parameter.score"
                show-input
                :max="10"
                :step="1"
                @input="$forceUpdate()"
              ></el-slider>
            </div>
            <div class="slider-mobile">
              <el-slider v-model="parameter.score" :max="10" :step="1" @input="$forceUpdate()"></el-slider>
            </div>
          </td>
        </tr>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmitJudgeClick">Submit</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  course_studentJudge_url,
  course_getStudent_url
} from "@/config/api.js";
import { post } from "@/utils/requests/post.js";
export default {
  name: "judgeManagement",
  created: function() {
    this.fetchData();
  },
  watch: {
    $route: "fetchData"
  },
  data: function() {
    return {
      courseID: "",
      studentIndex: "",
      course: {},
      isAvailable: false
    };
  },
  methods: {
    fetchData() {
      if (this.$route.name == "judgeManagement") {
        this.courseID = this.$route.params.courseID;
        this.studentIndex = this.$route.params.studentIndex;
        let form = {
          courseID: this.courseID,
          studentIndex: this.studentIndex
        };
        post(course_getStudent_url, form).then(response => {
          if (response.data.status == "success") {
            this.course = response.data.data.course;
            this.course["judgeList"] = [];
            let datetime = new Date();
            datetime.setTime(this.course.deadline * 1000);
            let Y = datetime.getFullYear() + "-";
            let M =
              (datetime.getMonth() + 1 < 10
                ? "0" + (datetime.getMonth() + 1)
                : datetime.getMonth() + 1) + "-";
            let D = datetime.getDate() + " ";
            let h = datetime.getHours() + ":";
            let m = datetime.getMinutes();
            if (Number(m) < 10) {
              m = "0" + m;
            }
            this.course["deadlineTemp"] = this.course.deadline;
            this.course.deadline = Y + M + D + h + m;
            if (this.course.deadlineTemp * 1000 < new Date().getTime()) {
              this.isAvailable = false;
            } else {
              this.isAvailable = true;
              Object.keys(this.course.score).forEach(key => {
                this.course["judgeID"] = key;
                Object.keys(this.course.score[key]).forEach(subKey => {
                  let object = {};
                  object["id"] = subKey;
                  object["name"] = this.course.score[key][subKey].name;
                  object["score"] = this.course.score[key][subKey].score;
                  if (this.course.score[key][subKey].index) {
                    object["index"] = this.course.score[key][subKey].index;
                  }
                  this.course["judgeList"].push(object);
                });
              });
              this.course["judgeList"].sort((a, b) => {
                if (a.index < b.index) {
                  return -1;
                } else {
                  return 1;
                }
              });
            }
          }
        });
      }
    },
    onSubmitJudgeClick() {
      let submitList = this.course.judgeList.filter(item => item.score != 0);
      let form = {
        deadline: this.course["deadlineTemp"],
        judgeID: this.course["judgeID"],
        courseID: this.courseID,
        submitList: JSON.stringify(submitList)
      };
      console.log(form);
      post(course_studentJudge_url, form)
        .then(response => {
          if (response.data.status == "success") {
            this.$message({
              message: "Submit success",
              type: "success"
            });
          }
        })
        .catch(error => {
          if (error.data.msg == "Out of deadline") {
            this.$message.error("Out of deadline");
            this.$router.go();
          } else {
            this.$message.error("Submit error please try again");
          }
        });
    }
  },
  components: {},
  computed: {}
};
</script>
<style lang="scss" scoped>
#app {
  min-width: 810px;
}
div {
  font-family: "Avenir", Helvetica, Arial, sans-serif, "微軟正黑體",
    "PingFangTC-Regular";
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.dark {
  background: #000000;
  background-color: #000000;
}
.grid-content {
  margin-top: 10%;
  border-radius: 4px;
  min-height: 36px;

  .loginForm {
    padding: 25px;

    .el-link {
      display: block;
    }
    .el-input {
      margin-bottom: 10px;
    }
    .loginButton {
      width: 100%;
      margin-top: 10px;
      margin-left: 0px;
    }

    .loginAlert {
      margin: 10px 0;
    }

    p {
      font-size: 24px;
      color: #ffffff;
    }
  }
}
.dialog-footer {
  text-align: center;
  margin: 30px 0 50px;
}
.alignCenter {
  text-align: center;
}
.info-block {
  margin: 50px 0 30px;
  text-align: center;
  .course-name {
    font-size: 3.5rem;
    font-weight: bold;
  }
  .hw-name {
    font-size: 2rem;
    font-weight: bold;
    color: #3c3c3c;
    margin-bottom: 20px;
  }
  .time-info {
    color: #808080;
    display: flex;
    flex-direction: row;
    justify-content: center;
    .div-block {
      &.right {
        text-align: left;
      }
      &.left {
        text-align: right;
      }
      width: 50%;
      margin: 0 15px;
    }
    @media screen and (max-width: 767px) {
      flex-direction: column;
      align-items: center;
      .div-block {
        width: auto;
      }
    }
    span {
      margin: 0 0px;
    }
  }
}
.unavailable {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    font-size: 5rem;
    @media screen and (max-width: 1023px) {
      font-size: 4rem;
    }
    @media screen and (max-width: 767px) {
      font-size: 3rem;
    }
    @media screen and (max-width: 600px) {
      font-size: 2rem;
    }
    @media screen and (max-width: 400px) {
      font-size: 1.5rem;
    }
  }
}

table {
  margin: 0 auto;
  min-width: 768px;
  text-align: center;
  .slider-mobile {
    display: none;
  }
  @media screen and (max-width: 767px) {
    min-width: initial;
    width: 100%;
    margin: 0;
    padding: 0 20px;
    box-sizing: border-box;
    .slider-col {
      width: 50%;
    }
    .slider-desktop {
      display: none;
    }
    .slider-mobile {
      display: inline;
      .el-slider {
        margin: 0 auto;
        width: 80%;
      }
    }
  }
  td,
  th {
    margin: 0 10px;
  }
}
</style>