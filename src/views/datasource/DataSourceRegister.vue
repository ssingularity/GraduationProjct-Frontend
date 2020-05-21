<template>
  <div>
    <el-card shadow="hover" header="数据源注册" class="card">
      <el-form ref="datasource-form" :model="datasource" :rules="rules" label-width="100px">
        <el-form-item label="数据源名称:" prop="name">
          <el-input v-model="datasource.name"/>
        </el-form-item>
        <el-form-item label="队列名:" prop="topic">
          <el-input v-model="datasource.topic"/>
        </el-form-item>
        <el-form-item label="数据源描述:">
          <el-input type="textarea" v-model="datasource.description"/>
        </el-form-item>
        <el-form-item label="数据格式:" prop="schema">
          <descriptor style="margin-top: 7px" :schema="{type: 'Object', children: []}" :editable="true" @change="change"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import Descriptor from "@/components/Descriptor"
  import {Message} from "element-ui";
  import {registerDataSource} from "@/api/datasource";

  export default {
    name: "DataSourceRegister",
    components: {
      Descriptor
    },
    data() {
      let checkSchema = (rule, value, callback) => {
        value = this.datasource.schema;
        if (value == null || value.children == null || value.children.size == 0) {
          return callback(new Error('数据格式能为空'));
        } else {
          return callback();
        }
      };
      return {
        datasource: {
          name: '',
          topic: '',
          description: '',
          schema: {}
        },
        rules: {
          name: [
            {required: true, message: '请输入数据源名称', trigger: 'blur'},
          ],
          topic: [
            {required: true, message: '请输入队列名', trigger: 'blur'},
          ],
          schema: [
            {validator: checkSchema, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submit() {
        this.$refs["datasource-form"].validate((valid) => {
          if (valid) {
            registerDataSource(this.datasource)
              .then(data => {
                Message({
                  message: "数据源注册成功",
                  type: "success",
                  duration: 2 * 1000
                });
                this.$refs["datasource-form"].resetFields();
                this.$router.push("/datasource/list")
              });
          } else {
            Message({
              message: "数据源格式错误",
              type: "error",
              duration: 2 * 1000
            });
          }
        })
      },
      change(data) {
        this.datasource.schema = data;
      }
    }
  }
</script>

<style scoped>

</style>
