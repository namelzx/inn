<template>

  <el-row class="panel-group" :gutter="40">
    <router-link to="/user/user_list">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">用户</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="usercount" :duration="2000"></count-to>
        </div>
      </div>
    </el-col>
    </router-link>
    <router-link to="/order/index" >
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">今日订单</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="taskcount" :duration="100"></count-to>
        </div>
      </div>
    </el-col>
    </router-link>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">交易金额</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="fpay" :duration="3200"></count-to>
        </div>
      </div>
    </el-col>
    <router-link to="/topup/withdrawal">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <!-- <div class="card-panel-icon-wrapper icon-shoppingCard">
          <svg-icon icon-class="shoppingCard" class-name="card-panel-icon" />
        </div> -->
        <div class="card-panel-description" style="    float: inherit;
    text-align: center;">
          <div class="card-panel-text">提现申请</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="withdrawal" :duration="3600"></count-to>
        </div>
      </div>
    </el-col>
    </router-link>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import {fetchList} from '@/api/index'
export default {
  data(){
    return{
      usercount:0,
      taskcount:0,
      fpay:0,
      tpay:0,
      withdrawal:0,
    }
  },
  components: {
    CountTo
  },
  created() {
    this.getlist()
  },
  methods: {
    getlist(){
      fetchList().then(response=>{
        console.log(response)
       this.usercount=response.data.usercout
       this.taskcount=response.data.taskcount
       this.fpay=response.data.fpay
       this.tpay=response.data.tpay
       this.withdrawal=response.data.withdrawal

    })
  },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
