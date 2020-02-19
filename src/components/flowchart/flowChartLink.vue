<template>
  <div class="flowChartContainer">
    <svg width="100%">
    </svg>
  </div>
</template>

<script>
export default {
    name: "flowChartLink",
    created: function() {
    },
    watch: {
    },
    data() {
        return {}
    },
    methods:{
        
    }

}
</script>

<style lang="scss" scoped>
    .flowChartContainer {
        margin: 0;
        background: #ddd;
        position: relative;
        overflow: hidden;
        svg {
            cursor: grab;
        }
    }
</style>