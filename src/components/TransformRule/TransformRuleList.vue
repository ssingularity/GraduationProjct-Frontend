<template>
  <el-table :data="transformRuleList" border fit highlight-current-row style="width: 100%;">
    <el-table-column label="规则名称" align="center" width="80px">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.type === 'map'">
          {{getTypeName(scope.row.type)}}
        </el-tag>
        <el-tag v-else type="success">
          {{getTypeName(scope.row.type)}}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="规则" align="center">
      <template slot-scope="scope">
        <span v-if="scope.row.type === 'select'">
          <el-tag type="success" v-for="key in scope.row.expectedKeys" :key="key.targetKey" style="margin-left: 10px">
            {{key.targetKey}}
          </el-tag>
        </span>
        <span v-else>
          <el-tag>{{scope.row.mapRule.source.targetKey}}</el-tag>
          <i class="el-icon-d-arrow-right" style="margin-left: 5px;margin-right: 5px"></i>
          <el-tag>{{scope.row.mapRule.target.targetKey}}</el-tag>
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    name: "TransformRuleList",
    props: {
      transformRuleList: Array
    },
    methods: {
      getTypeName(type) {
        if (type === 'map') {
          return '映射';
        } else {
          return '过滤';
        }
      }
    }
  }
</script>

<style scoped>

</style>
