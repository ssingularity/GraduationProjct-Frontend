<template>
  <el-card shadow="hover" header="数据源列表" class="card">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="数据源名称" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="队列名称" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{scope.row.topic}}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据源描述" align="center" width="300px">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{scope.row.owner}}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据格式" align="center" width="400px">
        <template slot-scope="scope">
          <descriptor :editable="false" :schema="scope.row.schema"></descriptor>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="small">订阅</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  import Descriptor from '@/components/Descriptor'
  import {getAllDataSource} from "@/api/datasource";
  export default {
    name: "DataSourceList",
    components: {
      Descriptor
    },
    data() {
      return {
        list: null,
        listLoading: true
      }
    },
    created() {
      getAllDataSource()
        .then(data => {
          this.list = data.data;
          this.listLoading = false;
        })
        .catch(error => {
          this.listLoading = false;
        })
    }
  }
</script>

<style scoped>

</style>
