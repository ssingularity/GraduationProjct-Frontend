<template>
  <el-card v-loading="loading" shadow="hover" header="流程创建" class="card">
    <el-form ref="process-form" :model="process" label-width="100px" :rules="rules">
      <el-form-item label="流程名称:" prop="name">
        <el-input v-model="process.name"/>
      </el-form-item>
      <el-form-item label="流程描述:">
        <el-input type="textarea" v-model="process.description"/>
      </el-form-item>
      <el-form-item label="流程可视化:">
        <div ref="echart" style="width: 100%; height: 400px"/>
      </el-form-item>
      <el-divider/>
      <el-form-item>
        <el-col :offset="7">
          <el-button @click="openDataSourceDrawer">添加数据源</el-button>
          <el-button @click="openServiceDrawer">添加服务</el-button>
          <el-button type='danger' @click="clearAll">清除全部</el-button>
          <el-button type="primary" @click="createProcess">创建</el-button>
        </el-col>
      </el-form-item>
    </el-form>

    <el-drawer :visible.sync="datasource.drawer" v-loading="datasource.drawerLoading" direction="rtl" title="数据源列表"
               :with-header="false">
      <el-collapse v-model="datasource.activeNames" style="margin-left: 20px">
        <el-collapse-item title="我创建的数据源" name="1">
          <el-row>
            <el-col v-for="ds in datasource.ownList" :key="ds.name" :offset="1" :span="10">
              <el-card shadow="hover" class="cardList">
                <div @mouseover="$event.target.style.cursor='pointer'" @click="selectDataSource(ds)">
                  <b>{{ ds.name }}</b>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="我被授权的数据源" name="2">
          <el-row>
            <el-col v-for="ds in datasource.authorizedList" :key="ds.name" :offset="1" :span="10">
              <el-card shadow="hover" class="cardList">
                <div @mouseover="$event.target.style.cursor='pointer'" @click="selectDataSource(ds)">
                  <b>{{ ds.name }}</b>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-drawer>

    <el-drawer :visible.sync="service.drawer" v-loading="service.drawerLoading" direction="rtl" title="服务列表"
               :with-header="false">
      <el-collapse v-model="service.activeNames" style="margin-left: 20px">
        <el-collapse-item title="服务列表" name="1">
          <el-row>
            <el-col v-for="svc in service.list" :key="svc.name" :offset="1" :span="10">
              <el-card shadow="hover" class="cardList">
                <div @mouseover="$event.target.style.cursor='pointer'" @click="selectService(svc)">
                  <b>{{ svc.name }}</b>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-drawer>

    <el-dialog :visible.sync="service.dialogVisible">
      <el-form>
        <el-form-item label="输入源:">
          <el-checkbox-group v-if="selectedList.length !== 0" v-model="service.curServiceInputList">
            <el-checkbox v-for="item in selectedList" :key="item.name" :label="item.name"/>
          </el-checkbox-group>
          <span v-else>暂无输入源</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doSelectService">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="svcEdit.dialogVisible" width="90%" top="2vh">
      <el-steps :active="active" finish-status="success">
        <el-step title="数据融合"></el-step>
        <el-step title="数据转换"></el-step>
        <el-step title="背压阈值设置"></el-step>
      </el-steps>
      <editable-fusion-rule v-if="active==0" :svc="svcEdit.svc"></editable-fusion-rule>
      <editable-transform-rule v-if="active==1" :svc="svcEdit.svc"></editable-transform-rule>
      <el-form v-if="active==2" style="margin-top: 50px">
        <el-form-item style="text-align: center">
          <el-input-number v-model="svcEdit.svc.threshold"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button style="margin-top: 12px;" @click="active--" :disabled="active==0">上一步</el-button>
        <el-button style="margin-top: 12px;" @click="active++" :disabled="active==2">下一步</el-button>
        <el-button style="margin-top: 12px;" type="primary" :disabled="active!=2" @click="svcEdit.dialogVisible=false">完成</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
  import option from './option'
  import {getMyAuthorizedDataSource, getMyDataSource} from "@/api/datasource";
  import {getServiceList} from "@/api/service";
  import {findInstanceByName} from "@/utils/array";
  import {createProcess} from "@/api/process";
  import {Message} from "element-ui";
  import EditableFusionRule from "@/components/FusionRule/EditableFusionRule";
  import EditableTransformRule from "@/components/TransformRule/EditableTransformRule";
  import {deepCopy} from "@/utils/json";

  export default {
    name: "ProcessCreate",
    components: {
      EditableFusionRule,
      EditableTransformRule
    },
    created() {
      this.loading = true;
      Promise.all([getMyDataSource(), getMyAuthorizedDataSource(), getServiceList()])
        .then(array => {
          this.datasource.ownList = array[0].data;
          this.datasource.ownList.forEach(ds => {
            this.name2Id[ds.name] = ds.id;
            this.name2Instance[ds.name] = ds;
          });

          this.datasource.authorizedList = array[1].data;
          this.datasource.authorizedList.forEach(ds => {
            this.name2Id[ds.name] = ds.id;
            this.name2Instance[ds.name] = ds;
          });

          this.service.list = array[2].data;
          this.service.list.forEach(svc => {
            this.name2Id[svc.name] = svc.id;
            this.name2Instance[svc.name] = svc;
          });

          this.loading = false;
        })
        .catch(
          () => {
            this.loading = false;
          }
        );
    },
    mounted() {
      this.initEcharts();
    },
    data() {
      return {
        datasource: {
          drawer: false,
          activeNames: [],
          ownList: [],
          authorizedList: []
        },
        service: {
          drawer: false,
          activeNames: [],
          list: [{name: 'test'}],
          dialogVisible: false,
          curServiceInputList: [],
          curService: {}
        },
        process: {
          name: '',
          description: '',
          topology: {}
        },
        svcEdit: {
          dialogVisible: false,
          svc: {
            inputList: [],
            threshold: 5000
          }
        },
        myChart: null,
        loading: false,
        selectedList: [],
        dataSourceIndex: [0.5, 0.5],
        serviceIndex: [1.5, 2],
        linkList: [],
        name2Id: {},
        name2Instance: {},
        option: {},
        transformRuleList: [],
        active: 0,
        rules: {
          name: [
            {required: true, message: '请输入流程名称', trigger: 'blur'},
          ]
        }
      }
    },
    methods: {
      initEcharts() {
        this.option = deepCopy(option);
        this.myChart = this.$echarts.init(this.$refs["echart"], 'vintage');
        this.myChart.setOption(this.option);
        this.myChart.on('click', (params) => {
          if (params.dataType === 'node' && params.data.category === 'service') {
            this.svcEdit.svc = this.name2Instance[params.data.name];
            if (this.svcEdit.svc.inputList.length > 1) {
              this.active = 0;
            } else {
              this.active = 1;
            }
            this.svcEdit.dialogVisible = true;
          }
        });
      },
      openDataSourceDrawer() {
        this.datasource.drawer = true;
      },
      openServiceDrawer() {
        this.service.drawer = true;
      },
      selectDataSource(ds) {
        this.datasource.drawer = false;
        ds.type = 'DataSource';
        ds.category = 'datasource';
        ds.value = [];
        ds.value[0] = this.dataSourceIndex[0];
        ds.value[1] = this.dataSourceIndex[1];
        this.dataSourceIndex[1] += 2;
        this.selectedList.push(ds);
        this.option.series[0].data = this.selectedList;
        this.myChart.setOption(this.option);
      },
      selectService(svc) {
        this.service.drawer = false;
        this.service.curService = svc;
        this.service.dialogVisible = true;
      },
      doSelectService() {
        let svc = this.service.curService;
        svc.type = 'Service';
        svc.category = 'service';
        svc.value = [];
        svc.value[0] = this.serviceIndex[0];
        svc.value[1] = this.serviceIndex[1];
        this.selectedList.push(svc);
        this.option.series[0].data = this.selectedList;

        this.service.curServiceInputList.forEach(x => {
          let link = {
            source: this.name2Id[x],
            target: this.name2Id[this.service.curService.name],
            lineStyle: {
              curveness: 0.2
            }
          };
          this.linkList.push(link);
        });
        this.option.series[0].links = this.linkList;
        this.myChart.setOption(this.option);

        svc.inputList = this.service.curServiceInputList.map(x => {
          return findInstanceByName(this.selectedList, x);
        });
        this.process.topology = svc;

        this.serviceIndex[0] += 1;
        this.service.curServiceInputList = [];
        this.service.dialogVisible = false;
      },
      clearAll() {
        this.process.topology = {};
        this.selectedList = [];
        this.linkList = [];
        this.dataSourceIndex = [0.5, 0.5];
        this.serviceIndex = [1.5, 2];
        this.option.series[0].link = [];
        this.option.series[0].data = [];
        this.myChart.setOption(this.option);
      },
      createProcess() {
        this.$refs["process-form"].validate((valid) => {
          if (valid) {
            console.log(this.process);
            createProcess(this.process)
              .then(response => {
                this.loading = false;
                Message({
                  message: "流程创建成功",
                  type: "success",
                  duration: 2 * 1000
                });
                this.$router.push("/process/list")
              })
              .catch(error => {
                this.loading = false;
              })
          } else {
            Message({
              message: "流程格式错误",
              type: "error",
              duration: 2 * 1000
            });
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .cardList {
    text-align: center;
    width: 100%;
    display: inline-block;
  }
</style>
