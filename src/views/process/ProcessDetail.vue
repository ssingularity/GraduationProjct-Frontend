<template>
  <el-card shadow="hover" header="工艺流程详情" class="card">
    <el-form :model="process" label-width="120px" v-loading="formLoading">
      <el-form-item label="流程名称:" prop="name">
        <span>{{process.name}}</span>
      </el-form-item>
      <el-form-item label="流程描述:">
        <span>{{process.description}}</span>
      </el-form-item>
      <el-form-item label="流程可状态:">
        <el-tag v-if="process.status === 'STOPPED'" type='danger'>已停止</el-tag>
        <el-tag v-else type='success'>运行中</el-tag>
      </el-form-item>
      <el-form-item label="流程可视化:">
        <div ref="details-echart" style="width: 100%; height: 400px"/>
      </el-form-item>
      <el-form-item label="流式数据日志:">
        <el-col :span="11">
          <el-card shadow="hover" header="数据源输出数据日志">
            <el-table :data="dataSourceLogs" highlight-current-row style="width: 100%;" height="500">
              <el-table-column label="数据源名称" align="center" width="100px">
                <template slot-scope="scope">
                  <span>{{scope.row.dataSourceName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="时间戳" align="center" width="100px">
                <template slot-scope="scope">
                  <span>{{scope.row.timestamp}}</span>
                </template>
              </el-table-column>
              <el-table-column label="数据内容" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.content}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :offset="1" :span="12">
          <el-card shadow="hover" header="服务输入数据日志">
            <el-table :data="serviceLogs" highlight-current-row style="width: 100%;" height="500">
              <el-table-column label="服务名称" align="center" width="100px">
                <template slot-scope="scope">
                  <span>{{scope.row.serviceName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="时间戳" align="center" width="100px">
                <template slot-scope="scope">
                  <span>{{scope.row.timestamp}}</span>
                </template>
              </el-table-column>
              <el-table-column label="当前运行中队列" align="center" width="90px">
                <template slot-scope="scope">
                  <el-tag type="success">{{scope.row.executingQueueSize}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="当前待运行队列" align="center" width="90px">
                <template slot-scope="scope">
                  <el-tag>{{scope.row.waitingQueueSize}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="数据内容" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.content}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
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
  import websocket from "@/utils/websocket";
  import {deepCopy} from "@/utils/json";

  export default {
    name: "ProcessDetail",
    mounted() {
      this.formLoading = true;
      this.initEcharts();
      this.sock = websocket(this.dealMsg, this.$route.params.processId);
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
    destroyed() {
      this.sock.close();
      this.echarts.destroy();
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
        links: [],
        sock: undefined,
        dataSourceLogs: [],
        serviceLogs: []
      }
    },
    components: {
      TransformRuleList
    },
    methods: {
      initEcharts() {
        this.option = deepCopy(option);
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
      },
      dealMsg(e) {
        const logObj = JSON.parse(e.data);
        if (logObj.processId === this.$route.params.processId) {
          if (logObj.type === 'DataSource') {
            this.dataSourceLogs.push(logObj);
          }
          else {
            this.serviceLogs.push(logObj);
          }
        }
      }
    },
  }
</script>

<style scoped>

</style>
