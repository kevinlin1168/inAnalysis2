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
    if (window.localStorage.getItem('token') != null) {
      let userString = decodeURIComponent(escape(window.atob(window.localStorage.getItem('token').split('.')[1])))
      let user = JSON.parse(userString)
      if((user.exp * 1000) < new Date().getTime())
        window.localStorage.setItem('isLogin', false)
    } else {
      window.localStorage.setItem('isLogin', false)
    }
    
  },
  data() {
    return {
      currentTime: new Date().getTime() 
    };
  },
  methods: {
    OperatingWebsite() {
      let lastTime = this.currentTime;
      let currentTime = new Date().getTime();
      let timeOut = 30 * 60 * 1000; //設定時間 30分鐘
      if ((currentTime - lastTime) > timeOut) {
        console.warn('timeOut')
        // 未操作頁面，跳轉登入頁面
        this.currentTime = new Date().getTime(); 
        localStorage.setItem('isLogin', false);
        this.$router.push('/');
      } else {
        this.currentTime = new Date().getTime(); 
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '~@/common/scss/base';
</style>