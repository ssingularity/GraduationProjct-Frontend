<template>
  <el-card shadow="hover" header="服务详情" class="card">
    <el-form :model="process" label-width="100px" v-loading="formLoading">
      <el-form-item label="流程名称:" prop="name">
        <span>{{process.name}}</span>
      </el-form-item>
      <el-form-item label="流程描述:">
        <span>{{process.description}}</span>
      </el-form-item>
      <el-form-item label="流程可视化:">
        <div ref="details-echart" style="width: 100%; height: 400px"/>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" width="50%" top="2vh" title="配置详情">
      <el-form>
        <el-form-item label="融合规则:" style="text-align: center">
          <el-tag type="warning" v-if="svc.fusionRule != null">键值融合</el-tag>
          <el-tag type="warning" v-else>空融合</el-tag>
        </el-form-item>
        <el-form-item label="转换规则:" v-if="svc.transformRuleList != null && svc.transformRuleList.length !== 0">
          <transform-rule-list :transform-rule-list="svc.transformRuleList"></transform-rule-list>
        </el-form-item>
        <el-form-item label="背压阈值:" style="text-align: center">
          <el-tag type="info">{{svc.threshold}}</el-tag>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
  import option from "./option";
  import {getProcess} from "@/api/process";
  import TransformRuleList from "@/components/TransformRule/TransformRuleList";

  export default {
    name: "ProcessDetail",
    mounted() {
      this.formLoading = true;
      this.initEcharts();
      getProcess(this.$route.params.processId)
        .then(response => {
          this.process = response.data;
          this.showEcharts(this.process.topology);
          this.formLoading = false;
        })
        .catch(() => {
          this.formLoading = false;
        })
    },
    data() {
      return {
        process: {},
        formLoading: false,
        myChart: undefined,
        option: undefined,
        dialogVisible: false,
        svc: {},
        data: [],
        links: []
      }
    },
    components: {
      TransformRuleList
    },
    methods: {
      initEcharts() {
        this.option = option;
        this.myChart = this.$echarts.init(this.$refs["details-echart"], 'vintage');
        this.myChart.setOption(this.option);
        this.myChart.on('click', (params) => {
          if (params.dataType === 'node' && params.data.category === 'service') {
            this.svc = params.data;
            this.dialogVisible = true;
          }
        });
      },
      showEcharts(topology) {
        if (topology.type === 'DataSource') {
          topology.category = 'datasource';
        } else {
          topology.category = 'service';
        }
        this.data.push(topology);
        console.log(topology.inputList);
        topology.inputList.forEach(x => {
          this.showEcharts(x);
          this.links.push({
            source: x.id,
            target: topology.id,
            lineStyle: {
              curveness: 0.2
            }
          })
        });
        this.option.series[0].data = this.data;
        this.option.series[0].links = this.links;
        this.myChart.setOption(this.option);
      }
    },
  }
</script>

<style scoped>

</style>
