<template>
  <el-card>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="服务名称" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务描述" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务IP" align="center" width="200px">
        <template slot-scope="scope">
          <el-tag>{{scope.row.ip}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="服务端口" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.port}}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务路径" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{scope.row.path}}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务方法" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.method}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="200px">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="showDetail(scope.row.id)">详情</el-button>
          <el-button type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  import Descriptor from '@/components/Descriptor'
  import {getServiceList} from "@/api/service";

  export default {
    name: "ServiceList",
    components: {
      Descriptor
    },
    created() {
      getServiceList()
        .then(response => {
          this.listLoading = false;
          this.list = response.data;
        })
        .catch((error) => {
          this.listLoading = false;
        })
    },
    data() {
      return {
        listLoading: true,
        formLoading: false,
        list: [],
        visible: false,
        service: {}
      }
    },
    methods: {
      showDetail(id) {
        this.$router.push(`/service/${id}`)
      }
    }
  }
</script>

<style scoped>

</style>
