<template>
  <div>
    <div v-if="type == 'File'">
        <el-button icon="el-icon-folder-opened"></el-button>
        <el-button icon="el-icon-upload"></el-button>
        <el-button icon="el-icon-delete" @click="deleteNode"></el-button>
    </div>  
    <div v-if="type != 'File'">
        <el-button icon="el-icon-edit"></el-button>
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
      }
  },
  created: function() {
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  computed: {
  },
  methods: {
      deleteNode() {
        this.$emit('deleteNode');
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>