<template>
  <div>
    <el-card shadow="hover" header="服务创建" class="card">
      <el-form v-loading="loading" ref="service-form" :model="service"  label-width="100px">
        <el-form-item label="服务名称:" prop="name">
          <el-input v-model="service.name"/>
        </el-form-item>
        <el-form-item label="服务IP:">
          <el-input placeholder="请输入服务IP" v-model="service.ip">
            <template slot="prepend">Http://</template>
          </el-input>
        </el-form-item>
        <el-form-item label="端口号:">
          <el-input-number v-model="service.port"/>
        </el-form-item>
        <el-form-item label="服务路径:">
          <el-input placeholder="请输入服务路径" v-model="service.path"/>
        </el-form-item>
        <el-form-item label="服务方法:">
          <el-select v-model="service.method">
            <el-option label="GET" value="GET"/>
            <el-option label="POST" value="POST"/>
            <el-option label="PUT" value="PUT"/>
            <el-option label="DELETE" value="DELETE"/>
          </el-select>
        </el-form-item>
        <el-form-item v-for="(parameter, index) in service.parameters" :label="'参数'+index+':'" :key = index>
          <el-form :inline="true">
            <el-form-item label="参数名称">
              <el-input v-model="service.parameters[index].keyName"></el-input>
            </el-form-item>
            <el-form-item label="参数位置">
              <el-select v-model="service.parameters[index].in">
                <el-option label="PATH" value="PATH"/>
                <el-option label="QUERY" value="QUERY"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" icon="el-icon-minus" circle size="mini" @click="remove(index)"></el-button>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="输入格式:" prop="schema">
          <descriptor style="margin-top: 7px" :schema="{type: 'Object', children: []}" :editable="true"
                      @change="changeInput"/>
        </el-form-item>
        <el-form-item label="输出格式:" prop="schema">
          <descriptor style="margin-top: 7px" :schema="{type: 'Object', children: []}" :editable="true"
                      @change="changeOutput"/>
        </el-form-item>
        <el-form-item label="服务描述:">
          <el-input type="textarea" v-model="service.description"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">立即创建</el-button>
          <el-button @click="addParameter">新增参数</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import Descriptor from '@/components/Descriptor'
  import {createService} from "@/api/service";
  import {Message} from "element-ui";

  export default {
    name: "ServiceCreate",
    components: {
      Descriptor
    },
    data() {
      return {
        service: {
          name: '',
          description: '',
          ip: '',
          port: 8080,
          requestBody: {},
          response: {},
          parameters: [],
          path: '',
          method: ''
        },
        loading: false
      }
    },
    methods: {
      changeInput(data) {
        this.service.requestBody = data;
      },
      changeOutput(data) {
        this.service.response = data;
      },
      submit() {
        this.loading = true;
        createService(this.service)
          .then(response => {
            this.loading = false;
            Message({
              message: "服务创建成功",
              type: "success",
              duration: 2 * 1000
            });
            this.$router.push("/service/list");
          })
          .catch((error) => {
            this.loading = false;
          });
      },
      addParameter() {
        this.service.parameters.push({});
      },
      remove(index) {
        this.service.parameters.splice(index, 1);
      }
    }
  }
</script>

<style scoped>

</style>
