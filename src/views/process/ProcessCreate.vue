<template>
  <el-card shadow="hover" header="流程创建" class="card">
    <el-form v-loading="loading" ref="service-form" :model="process" label-width="100px">
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
        <el-col :offset="8">
          <el-button @click="openDataSourceDrawer">添加数据源</el-button>
          <el-button @click="openServiceDrawer">添加服务</el-button>
          <el-button type="primary">创建</el-button>
        </el-col>
      </el-form-item>
    </el-form>

    <el-drawer :visible.sync="datasource.drawer" v-loading="datasource.drawerLoading" direction="rtl" title="数据源列表" :with-header="false">
      <el-collapse v-model="datasource.activeNames" style="margin-left: 20px">
        <el-collapse-item title="我创建的数据源" name="1">
          <el-row>
            <el-col v-for="ds in datasource.ownList" :key="ds.name" offset="1" span="10">
              <el-card shadow="hover" class="cardList">
                <div @mouseover="$event.target.style.cursor='pointer'">
                  <b>{{ ds.name }}</b>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="我被授权的数据源" name="2">
          <el-row>
            <el-col v-for="ds in datasource.authorizedList" :key="ds.name" offset="1" span="10">
              <el-card shadow="hover" class="cardList">
                <div @mouseover="$event.target.style.cursor='pointer'">
                  <b>{{ ds.name }}</b>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-drawer>

    <el-drawer :visible.sync="service.drawer" v-loading="service.drawerLoading" direction="rtl" title="服务列表" :with-header="false">
      <el-collapse v-model="service.activeNames" style="margin-left: 20px">
        <el-collapse-item title="服务列表" name="1">
          <el-row>
            <el-col v-for="svc in service.list" :key="svc.name" offset="1" span="10">
              <el-card shadow="hover" class="cardList">
                <div @mouseover="$event.target.style.cursor='pointer'">
                  <b>{{ svc.name }}</b>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-drawer>
  </el-card>
</template>

<script>
  import option from './option'

  export default {
    name: "ProcessCreate",
    mounted() {
      this.initEcharts();
    },
    data() {
      return {
        datasource: {
          drawer: false,
          drawerLoading: false,
          activeNames: [],
          ownList: [{name: 'test'}],
          authorizedList: [{name: 'test'}]
        },
        service: {
          drawer: false,
          drawerLoading: false,
          activeNames: [],
          list: [{name: 'test'}],
        },
        process: {
          name: '',
          description: '',
          topology: {}
        },
        myChart: null,
        loading: false,

      }
    },
    methods: {
      initEcharts() {
        this.myChart = this.$echarts.init(this.$refs["echart"], 'vintage');
        this.myChart.setOption(option);
      },
      openDataSourceDrawer() {
        this.datasource.drawer = true;
      },
      openServiceDrawer() {
        this.service.drawer = true;
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
