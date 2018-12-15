<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="订单号" v-model="listQuery.out_trade_no">
      </el-input>


        <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.status" placeholder="订单状态">
        <el-option v-for="item in  calendarStatusOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">

      <el-table-column width="150px" align="center" label="任务标题">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span> -->
            <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="订单号">
        <template slot-scope="scope">
          <span>
            {{scope.row.out_trade_no}}
          </span>
        </template>
      </el-table-column>

        <el-table-column min-width="100px" align="center" label="订单总额">
        <template slot-scope="scope">
          <span>
            {{scope.row.total_price}}
          </span>
        </template>
      </el-table-column>
       <el-table-column min-width="100px" align="center" label="发布人">
        <template slot-scope="scope">
          <span>
            {{scope.row.releasename}}
          </span>
        </template>
      </el-table-column>
        <el-table-column min-width="100px" align="center" label="领取人">
        <template slot-scope="scope">
          <span>
            {{scope.row.username}}
          </span>
        </template>
      </el-table-column>

       <el-table-column width="150px" align="center" label="下单时间">
        <template slot-scope="scope">
             <span>{{scope.row.create_time | formatTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
       <el-table-column width="110px" align="center" label="订单状态">
        <template slot-scope="scope">
              <el-tag  v-if="scope.row.order_status=='0'" type="danger">已申请</el-tag>
          <el-tag  v-if="scope.row.order_status=='1'" type="warning">已接受</el-tag>
          <el-tag  v-if="scope.row.order_status=='2'" >待完成</el-tag>
            <el-tag  v-if="scope.row.order_status=='3'" type="success">已结算</el-tag>
              <el-tag  v-if="scope.row.order_status=='4'" type="success">已完成</el-tag>
              <el-tag  v-if="scope.row.order_status=='7'" type="danger">已取消</el-tag>
                <el-tag   v-if="scope.row.order_status=='-1'" type="warning" >等待接受</el-tag>
        </template>
      </el-table-column>
          <el-table-column width="110px" align="center" label="付款状态">
        <template slot-scope="scope">
              <el-tag  v-if="scope.row.pay_status=='0'" type="danger">未支付</el-tag>
          <el-tag  v-if="scope.row.pay_status=='1'" type="warning">已支付</el-tag>
          <el-tag  v-if="scope.row.pay_status=='2'" >申请退款</el-tag>
            <el-tag  v-if="scope.row.pay_status=='3'" type="success">退款成功</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>


          <el-button  size="mini"  v-if="scope.row.status!='1'"  type="success" @click="handleModifyStatus(scope.row,1)">下架
          </el-button>
            <el-button  size="mini"  v-if="scope.row.status=='1'"  type="danger" @click="handleModifyStatus(scope.row,0)">上架
          </el-button>
        <el-button  size="mini" type="danger" @click="handleDelete(scope.row,scope.row.id)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getOrderitem } from "@/api/order";
import waves from "@/directive/waves"; // 水波纹指令
import { parseTime } from "@/utils";
import Vue from "vue";

const calendarTypeOptions = [
  { key: "0", display_name: "所有" },
  { key: "1", display_name: "本地" },
  { key: "2", display_name: "暂住" }
];
const calendarStatusOptions = [
  { key: "-1", display_name: "所有" },
  { key: "0", display_name: "已申请" },
  { key: "1", display_name: "已付款" },
  { key: "2", display_name: "已录用" },
  { key: "3", display_name: "已结算" },
  { key: "4", display_name: "已完成" },
  { key: "7", display_name: "已取消" }
];
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

const calendarStatusKeyValue = calendarStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "index",
  directives: {
    waves
  },
  data() {
    return {
      fileList3: [{ name: "", url: "" }],
      dialogImageUrl: "",
      dialogVisible: false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        username: undefined,
        type: undefined,
        sort: "+id"
      },
      image_prefix: process.env.IMAGE_PREFIX,
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      calendarStatusOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        labor_name: "",
        sales: 0,
        present_price: 0,
        original_price: 0,
        images: "",
        status: "published"
      },
      editimges: {
        name: "imges",
        url: ""
      },
      sdata: {
        id: null,
        status: null
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        labor_name: [
          { required: true, message: "商品需要填写", trigger: "change" }
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        present_price: [
          { required: true, message: "价格需要填写", trigger: "blur" }
        ],
        original_price: [
          { required: true, message: "价格需要填写", trigger: "blur" }
        ]
      },
      downloadLoading: false
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "已上架",
        2: "未上架",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
    statusFilter(status) {
      return calendarStatusKeyValue[status];
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getOrderitem(this.listQuery).then(response => {
        console.log(response);
        this.list = response.data.data;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    // 修改审核状态
    handleModifyStatus(row, status) {
      this.sdata.status = status;
      this.sdata.id = row.id;

      Editstatus(this.sdata).then(response => {
        console.log(response);
      });

      this.$message({
        message: "操作成功",
        type: "success"
      });

      row.status = status;
      // console.log(row.status)
    },
    handleDelete(row, id) {
      Delete(id).then(response => {
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
          duration: 2000
        });

        const index = this.list.indexOf(row);
        console.log(index);
        this.list.splice(index, 1);
      });
    },
    resetTemp() {
      this.temp = {
        labor_name: "",
        present_price: 0,
        original_price: 0,
        images: ""
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.images = [];
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createData(this.temp).then(response => {
            this.temp.id = response.data.data;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
          this.list.unshift(this.temp);
          this.dialogFormVisible = false;
        }
      });
    },

    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          console.log(this.temp);
          update(this.temp).then(response => {
            this.temp.id = response.data.data;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
          this.list.unshift(this.temp);
          this.dialogFormVisible = false;
        }
      });
    },
    // 修改
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      // Vue.set(this.fileList3,'name','1')
      // Vue.set(this.fileList3,'url',this.temp.images)
      this.fileList3[0].url = this.image_prefix + this.temp.images;
      this.fileList3[0].name = "123";

      this.temp.timestamp = new Date(this.temp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    handleRemove(file, fileList) {},
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      this.temp.images = response.path;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
<style>
.cell img {
  width: 200px;
}
</style>

