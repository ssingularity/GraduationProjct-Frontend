<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" class="card">
    <el-tab-pane label="我的发布" name="first">
      <el-card>

      </el-card>
    </el-tab-pane>
    <el-tab-pane label="我的订阅" name="second">
      <el-card>

      </el-card>
    </el-tab-pane>
    <el-tab-pane label="待审核" name="third">
      <el-card>

      </el-card>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  export default {
    name: "DataSourceSubscription",
    data() {
      return {
        activeName: "first"
      }
    },
    methods: {
      handleClick(tab) {
        console.log(tab);
      }
    }
  }
</script>

<style scoped>

</style>
