<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" class="card">
    <el-tab-pane label="我的发布" name="mine">
      <el-table v-loading="listLoading" :data="myDataSource" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="数据源名称" align="center" width="120px">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="队列名称" align="center" width="200px">
          <template slot-scope="scope">
            <span>{{scope.row.topic}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据源描述" align="center" width="300px">
          <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据格式" align="center">
          <template slot-scope="scope">
            <descriptor :editable="false" :schema="scope.row.schema"></descriptor>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="我的订阅" name="subscription">
      <el-table v-loading="listLoading" :data="mySubscription" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="数据源名称" align="center" width="120px">
          <template slot-scope="scope">
            <span>{{scope.row.resourceName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="队列名称" align="center" width="250px">
          <template slot-scope="scope">
            <span>{{scope.row.resourceTopic}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据源描述" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.resourceDescription}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据源创建者" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.resourceOwner}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订阅状态" align="center" width="250px">
          <template slot-scope="scope">
            <span><el-tag :type="tagState(scope.row.status)">{{tagName(scope.row.status)}}</el-tag></span>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="待审核" name="check">
      <el-table v-loading="listLoading" :data="subscriptionToSolve" border fit highlight-current-row
                style="width: 100%;">
        <el-table-column label="数据源名称" align="center" width="120px">
          <template slot-scope="scope">
            <span>{{scope.row.resourceName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="队列名称" align="center" width="250px">
          <template slot-scope="scope">
            <span>{{scope.row.resourceTopic}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据源描述" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.resourceDescription}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订阅者名称" align="center" width="120px">
          <template slot-scope="scope">
            <span>{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250px">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="doModifyStatus(scope.row.id, 'APPROVED')">通过
            </el-button>
            <el-button type="danger" size="small" @click="doModifyStatus(scope.row.id, 'REJECTED')">拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import {getMyDataSource, getMySubscription, getSubscriptionToSolve, modifyStatus} from "@/api/datasource";
  import Descriptor from '@/components/Descriptor'
  import {Message} from "element-ui";

  export default {
    name: "DataSourceSubscription",
    components: {
      Descriptor
    },
    data() {
      return {
        activeName: "mine",
        myDataSource: undefined,
        mySubscription: undefined,
        subscriptionToSolve: undefined,
        listLoading: true
      }
    },
    created() {
      getMyDataSource()
        .then(response => {
          this.myDataSource = response.data;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        })
    },
    methods: {
      handleClick(tab) {
        this.listLoading = true;
        if (tab.name === "mine") {
          getMyDataSource()
            .then(response => {
              this.myDataSource = response.data;
              this.listLoading = false;
            })
            .catch(() => {
              this.listLoading = false;
            })
        } else if (tab.name === "subscription") {
          getMySubscription()
            .then(response => {
              this.mySubscription = response.data;
              this.listLoading = false;
            })
            .catch(() => {
              this.listLoading = false;
            })
        } else {
          getSubscriptionToSolve()
            .then(response => {
              this.subscriptionToSolve = response.data;
              this.listLoading = false;
            })
            .catch(() => {
              this.listLoading = false;
            })
        }
      },
      tagName(type) {
        switch (type) {
          case 'PENDING': {
            return '待审核';
          }
          case 'APPROVED': {
            return '已授权';
          }
          case 'REJECTED': {
            return '审核不通过';
          }
        }
      },
      tagState(type) {
        switch (type) {
          case 'PENDING': {
            return '';
          }
          case 'APPROVED': {
            return 'success';
          }
          case 'REJECTED': {
            return 'danger';
          }
        }
      },
      doModifyStatus(id, status) {
        modifyStatus(id, status)
          .then(response => {
            this.listLoading = true;
            Message({
              message: '审核成功',
              type: 'success',
              duration: 2 * 1000
            });
            getSubscriptionToSolve()
              .then(response => {
                this.subscriptionToSolve = response.data;
                this.listLoading = false;
              })
              .catch(() => {
                this.listLoading = false;
              })
          })
          .catch()
      }
    }
  }
</script>

<style scoped>

</style>
