<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-card shadow="hover" header="输入数据源">
          <el-table :data="svc.inputList" border fit highlight-current-row style="width: 90%;">
            <el-table-column label="数据源名称" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="数据源格式" align="center" width="300px">
              <template slot-scope="scope">
                <descriptor :editable="false" :schema="scope.row.schema"/>
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
                <el-option label="共同键融合" value="key" :disabled="!hasCommonKey"></el-option>
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
  import {fusion, getCommonKey} from "@/utils/descriptor";
  export default {
    name: "EditableFusionRule",
    components: {
      Descriptor
    },
    mounted() {
      if (this.svc.fusionRule != null) {
        this.fusionRule = 'key';
        this.schema = fusion(this.svc.inputList.map(x => x.schema));
      }
      else {
        this.fusionRule = 'empty'
      }
    },
    data() {
      return {
        fusionRule: undefined,
        schema: {}
      }
    },
    computed: {
      hasCommonKey() {
        return getCommonKey(this.svc.inputList.map(x => x.schema)) != null;
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
        }
        else {
          this.svc.fusionRule = {
            keyName: getCommonKey(this.svc.inputList.map(x => x.schema)),
            dataSourceIdSet: this.svc.inputList.map(x => x.id)
          };
          this.schema = fusion(this.svc.inputList.map(x => x.schema));
          console.log(this.schema);
        }
      }
    }
  }
</script>

<style scoped>

</style>
