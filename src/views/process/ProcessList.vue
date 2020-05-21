<template>
  <el-card>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="流程名称" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程状态" align="center" width="100px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 'STOPPED'" type='danger'>已停止</el-tag>
          <el-tag v-else type='success'>运行中</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="流程描述" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="300px">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.status === 'RUNNING'" size="small">修改</el-button>
          <el-button type="primary" size="small" @click="showDetail(scope.row.id)">详情</el-button>
          <el-button :disabled="scope.row.status === 'RUNNING'" type="success" size="small" @click="start(scope.row.id)">
            启动
          </el-button>
          <el-button :disabled="scope.row.status === 'STOPPED'" type="danger" size="small" @click="stop(scope.row.id)">
            停止
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  import {getMyProcess, startProcess, stopProcess} from "@/api/process";
  import {Message} from "element-ui";

  export default {
    name: "ProcessList",
    created() {
      this.listLoading = true;
      getMyProcess()
        .then(response => {
          this.list = response.data;
          this.listLoading = false;
        })
        .catch(error => {
          this.listLoading = false;
        })
    },
    data() {
      return {
        listLoading: false,
        list: [{
          name: 'test'
        }]
      }
    },
    methods: {
      start(id) {
        this.listLoading = true;
        startProcess(id)
          .then(response => {
            Message({
              message: "流程启动成功",
              type: "success",
              duration: 2 * 1000
            });
            return Promise.resolve(getMyProcess())
          })
          .then(response => {
            this.list = response.data;
            this.listLoading = false;
          })
          .catch(error => {
            Message({
              message: "流程启动失败",
              type: "error",
              duration: 2 * 1000
            });
            this.listLoading = false;
          })
      },
      stop(id) {
        this.listLoading = true;
        stopProcess(id)
          .then(response => {
            Message({
              message: "流程停止成功",
              type: "success",
              duration: 2 * 1000
            });
            return Promise.resolve(getMyProcess())
          })
          .then(response => {
            this.list = response.data;
            this.listLoading = false;
          })
          .catch(error => {
            Message({
              message: "流程停止失败",
              type: "error",
              duration: 2 * 1000
            });
            this.listLoading = false;
          })
      },
      showDetail(id) {
        this.$router.push(`/process/${id}`);
      }
    }
  }
</script>

<style scoped>

</style>
