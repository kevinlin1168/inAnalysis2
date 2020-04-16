<template>
  <div>
    <div v-if="type == 'File'">
        <!-- <el-button icon="el-icon-folder-opened" @click="onSelectFileClick"></el-button> -->
        <el-button icon="el-icon-upload" @click="onUploadFileClick" :disabled="isDisabled"></el-button>
        <el-button icon="el-icon-delete" @click="deleteNode" :disabled="isDisabled"></el-button>
    </div>  
    <div v-if="type != 'File'">
        <el-button icon="el-icon-edit" @click="onEditClick" :disabled="isDisabled" v-if="type != 'Predict' && type != 'Test'"></el-button>
        <el-button icon="el-icon-view" @click="onTestClick" :disabled="isDisabled" v-if="type == 'Test' && isComplete"></el-button>
        <el-button icon="el-icon-download" @click="onDownloadClick" :disabled="isDisabled" v-if="type == 'Predict' && isComplete"></el-button>
        <el-button icon="el-icon-delete" @click="deleteNode" :disabled="isDisabled"></el-button>
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
      },
      isDisabled: {
        type: Boolean
      },
      isComplete: {
        type: Boolean
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
      onDownloadClick() {
        this.$emit('onDownloadClick');
      },
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
      },
      onTestClick() {
        this.$emit('onTestClick');
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>