<template>
  <el-card shadow="hover" header="服务详情" class="card">
    <el-form :model="service" label-width="100px" v-loading="formLoading">
      <el-form-item label="服务名称:" prop="name">
        <span>{{service.name}}</span>
      </el-form-item>
      <el-form-item label="服务IP:">
        <span>{{service.ip}}</span>
      </el-form-item>
      <el-form-item label="端口号:">
        <span>{{service.port}}</span>
      </el-form-item>
      <el-form-item label="服务路径:">
        <span>{{service.path}}</span>
      </el-form-item>
      <el-form-item label="服务方法:">
        <span>{{service.method}}</span>
      </el-form-item>
      <el-form-item v-for="(parameter, index) in service.parameters" :label="'参数'+index+':'" :key=index>
        <el-form :inline="true">
          <el-form-item label="参数名称">
            <span>{{parameter.keyName}}</span>
          </el-form-item>
          <el-form-item label="参数位置">
            <span>{{parameter.in}}</span>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="输入格式:">
        <descriptor style="margin-top: 7px" :schema="service.requestBody" :editable="false"/>
      </el-form-item>
      <el-form-item label="输出格式:">
        <descriptor style="margin-top: 7px" :schema="service.response" :editable="false"/>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {getServiceById} from "@/api/service";
  import Descriptor from "@/components/Descriptor"

  export default {
    name: "ServiceDetail",
    components: {
      Descriptor
    },
    created() {
      getServiceById(this.$route.params.serviceId)
        .then(response => {
          this.service = response.data;
          this.formLoading = false;
        })
        .catch((error) => {
          this.formLoading = false;
        })
    },
    data() {
      return {
        service: undefined,
        formLoading: true
      }
    }
  }
</script>

<style scoped>

</style>
