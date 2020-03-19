<template>
  <div>
    <div v-if="type == 'File'">
        <!-- <el-button icon="el-icon-folder-opened" @click="onSelectFileClick"></el-button> -->
        <el-button v-if='!fileName' icon="el-icon-upload" @click="onUploadFileClick"></el-button>
        <el-button icon="el-icon-delete" @click="deleteNode"></el-button>
    </div>  
    <div v-if="type != 'File'">
        <el-button icon="el-icon-edit" @click="onEditClick"></el-button>
        <el-button icon="el-icon-delete" @click="deleteNode"></el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: "flowChartCommon",
  props: {
      type: {
        type: String
      },
      fileName: {
        type: String
      }
  },
  created: function() {
  },
  data() {
    return {
      isShowPopup: false
    }
  },
  mounted() {
  },
  computed: {
  },
  methods: {
      deleteNode() {
        this.$emit('deleteNode');
      },
      onEditClick() {
        this.$emit('onEditClick');
      },
      onUploadFileClick() {
        this.$emit('onUploadFileClick');
      },
      onSelectFileClick() {
        this.$emit('onSelectFileClick');
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>