<template>
  <div id="app" class="fillcontain" @mouseover="OperatingWebsite()">
    <transition mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  created: function() {
    window.localStorage.setItem('isLogin', false)
  },
  data() {
    return {
      currentTime: new Date().getTime() 
    };
  },
  methods: {
    OperatingWebsite() {
      let currentTime = this.currentTime;
      let lastTime = new Date().getTime();
      let timeOut = 1 * 60 * 1000; //設定時間 10分鐘
      if (lastTime - currentTime > timeOut) {
        // 未操作頁面，跳轉登入頁面
        this.currentTime = new Date().getTime(); 
        this.$router.push('/');
      } else {
        this.currentTime = new Date().getTime(); 
      }

      // const truthPathQuery = this.$route.query.type;
      // const truthPath = this.$Base64.decode(truthPathQuery); //點選登入的時候跳轉這個地址
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '~@/common/scss/base';
</style>