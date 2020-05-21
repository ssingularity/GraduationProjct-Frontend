<template>
  <el-row>
    <el-col :span="6" class="cur-card">
      <el-card shadow="hover" header="原始输入数据格式">
        <descriptor :editable="false" :schema="inputSchema"></descriptor>
      </el-card>
    </el-col>
    <el-col :span="11" class="cur-card">
      <el-card shadow="hover" header="转换规则设置">
        <el-button round @click="visible=true"><i class="el-icon-plus"/> 添加转换规则</el-button>
        <el-card style="margin-top: 20px" v-if="transformRuleList.length !== 0" header="当前规则列表">
          <transform-rule-list :transform-rule-list="transformRuleList"></transform-rule-list>
        </el-card>
      </el-card>
    </el-col>
    <el-col :span="6" class="cur-card">
      <el-card shadow="hover" header="服务输入数据格式">
        <descriptor :editable="false" :schema="svc.requestBody"></descriptor>
      </el-card>
    </el-col>

    <el-dialog :visible.sync="visible" :append-to-body="true" title="转换规则配置">
      <el-form style="margin-left: 40px" label-width="100px">
        <el-form-item label="规则:">
          <el-select v-model="transformRule.type" placeholder="请选择" style="width: 100%">
            <el-option label="映射" value="map"></el-option>
            <el-option label="过滤" value="select"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="初始值:">
          <el-select v-model="transformRule.multiSource" v-if="transformRule.type === 'select'" multiple
                     style="width: 100%">
            <el-option v-for="key in keys" :key="key" :label="key" :value="key"></el-option>
          </el-select>
          <el-select v-model="transformRule.singleSource" v-if="transformRule.type === 'map'" style="width: 100%">
            <el-option v-for="key in keys" :key="key" :label="key" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标值:" v-if="transformRule.type === 'map'">
          <el-input v-model="transformRule.target"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
          <el-button>取 消</el-button>
          <el-button type="primary" @click="addTransformRule">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
  import Descriptor from '@/components/Descriptor'
  import {fusion, getKeys} from "@/utils/descriptor";
  import TransformRuleList from "@/components/TransformRule/TransformRuleList";

  export default {
    name: "EditableTransformRule",
    computed: {
      inputSchema() {
        return this.getInputChannel();
      },
      keys() {
        return getKeys(this.inputSchema);
      }
    },
    data() {
      return {
        visible: false,
        transformRuleList: this.svc.transformRuleList == null ? [] : this.svc.transformRuleList,
        transformRule: {
          type: undefined,
          multiSource: [],
          singleSource: undefined,
          target: undefined
        }
      }
    },
    methods: {
      addTransformRule() {
        let tmp = {
          type: this.transformRule.type
        };
        if (this.transformRule.type === 'select') {
          tmp.expectedKeys = this.transformRule.multiSource.map(x => {
            return {targetKey: x}
          });
        } else {
          tmp.mapRule = {
            source: {
              targetKey: this.transformRule.singleSource
            },
            target: {
              targetKey: this.transformRule.target
            }
          }
        }
        this.transformRuleList.push(tmp);
        this.svc.transformRuleList = this.transformRuleList;
        this.resetTransformRule();
        this.visible = false;
      },
      resetTransformRule() {
        this.transformRule = {
          type: undefined,
          multiSource: [],
          singleSource: undefined,
          target: undefined
        }
      },
      getInputChannel() {
        if (this.svc.inputList.length > 1) {
          return fusion(this.svc.inputList.map(x => x.schema));
        } else {
          let input = this.svc.inputList[0];
          if (input.type === 'Service') {
            return input.response;
          } else {
            return input.schema;
          }
        }
      }
    },
    components: {
      Descriptor,
      TransformRuleList
    },
    props: {
      svc: Object
    }
  }
</script>

<style scoped lang="scss">
  .cur-card {
    margin-left: 10px;
  }
</style>
