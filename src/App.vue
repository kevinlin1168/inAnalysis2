<template>
  <div id="app" class="fillcontain" @click="OperatingWebsite()">
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
      let timeOut = 60 * 60 * 1000; //設定時間 60分鐘
      console.warn(lastTime - currentTime > timeOut)
      if (lastTime - currentTime > timeOut) {
        this.currentTime = new Date().getTime(); 
      } else {
        // 未操作頁面，跳轉登入頁面
        this.currentTime = new Date().getTime(); 
        sessionStorage.setItem('isLogin', false);
        this.$router.push('/');
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '~@/common/scss/base';
</style>