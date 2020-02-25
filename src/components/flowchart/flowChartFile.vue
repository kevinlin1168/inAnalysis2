<template>
  <el-select v-model="selectFile" placeholder="please select a file" @change="onSelectFileChange">
    <el-option
      v-for="item in fileList"
      :key="item.fileID"
      :label="item.fileName"
      :value="item.fileID"
    >
    </el-option>
  </el-select>
</template>

<script>
import { file_getFileList_url } from '@/config/api.js';
import { post } from '@/utils/requests/post.js'

export default {
  name: "flowChartFile",
  props: {
    fileList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  created: function() {
    let form = {
        projectID: this.projectID,
        token: window.localStorage.getItem('token')
    }
    post(file_getFileList_url, form).then((resp) => {
        if(resp.data.status == "success") {
            this.fileList = resp.data.data.fileList;
        } else {
            console.error('getFileListError', resp.data.msg)
        }
    });
  },
  data() {
    return {
      selectFile: ''
    }
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    onSelectFileChange() {
      this.$emit('onSelectFileChange', this.selectFile);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>