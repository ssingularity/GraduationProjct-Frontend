<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-card shadow="hover" header="输入列表">
          <el-table :data="svc.inputList" border fit highlight-current-row style="width: 90%;">
            <el-table-column label="名称" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="输入格式" align="center" width="300px">
              <template slot-scope="scope">
                <descriptor v-if="scope.row.type === 'DataSource'" :editable="false" :schema="scope.row.schema"/>
                <descriptor v-else :editable="false" :schema="scope.row.response"/>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :offset="1" :span="6">
        <el-card shadow="hover" header="融合规则设置">
          <el-form>
            <el-form-item label="融合规则">
              <el-select v-model="fusionRule" placeholder="请选择" @change="onSelect">
                <el-option label="空融合" value="empty"></el-option>
                <el-option label="共同键融合" value="key" :disabled="!canFusion()"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :offset="1" :span="8">
        <el-card shadow="hover" header="融合后的数据格式">
          <descriptor :editable="false" :schema="schema"></descriptor>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Descriptor from '@/components/Descriptor'
  import {fusionInputList, getCommonKeyFromInputList} from "@/utils/descriptor";

  export default {
    name: "EditableFusionRule",
    components: {
      Descriptor
    },
    mounted() {
      if (this.svc.fusionRule != null) {
        this.fusionRule = 'key';
        this.schema = fusionInputList(this.svc.inputList);
      } else {
        this.fusionRule = 'empty'
      }
    },
    destroyed() {
      this.fusionRule = undefined;
      this.schema = {};
    },
    data() {
      return {
        fusionRule: undefined,
        schema: {}
      }
    },
    props: {
      svc: Object
    },
    methods: {
      onSelect(value) {
        if (value === 'empty') {
          this.svc.fusionRule = null;
          this.schema = {};
        } else {
          this.svc.fusionRule = {
            keyName: getCommonKeyFromInputList(this.svc.inputList),
            dataSourceIdSet: this.svc.inputList.map(x => x.id)
          };
          this.schema = fusionInputList(this.svc.inputList);
        }
      },
      canFusion() {
        console.log(getCommonKeyFromInputList(this.svc.inputList));
        return this.svc.inputList.length > 1 && getCommonKeyFromInputList(this.svc.inputList) !== null;
      }
    }
  }
</script>

<style scoped>

</style>
