<template>
  <div>
    <div class="unavailable">
        <el-image :src="deadlineImage"></el-image>
        <span>Missing Deadline.Website is down.</span>
    </div>
  </div>
</template>
<script>
import deadlineImage from '@/assets/images.jpg';
export default {
  name: "missingDeadline",
  created: function() {
  },
  watch: {
  },
  data: function() {
    return {
        deadlineImage: deadlineImage,
    };
  },
  methods: {
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
  flex-direction: column;
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