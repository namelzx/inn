<template>
<div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="输入用户名" v-model="listQuery.username">
      </el-input>
        <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.status" placeholder="审核状态">
        <el-option v-for="item in  calendarStatusOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <!-- <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showReviewer">{{$t('table.reviewer')}}</el-checkbox> -->
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column width="100px" align="center" label="用户名">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span> -->
            <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column max-width="100px" align="center" label="联系方式">
        <template slot-scope="scope">
          <!-- <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
          <el-tag>{{scope.row.type}}</el-tag> -->
         <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>

  <el-table-column max-width="100px" align="center" label="提现前金额">
        <template slot-scope="scope" >

          <span >{{scope.row.thisprice}}</span>
        </template>
      </el-table-column>
      <el-table-column max-width="100px" align="center" label="当前账户余额">
        <template slot-scope="scope" >

          <span >{{scope.row.userMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column max-width="100px"  align="center" label="提现金额">
        <template slot-scope="scope">
             <span >{{scope.row.total_price}}</span>
        </template>
      </el-table-column>


      <el-table-column class-name="status-col" align="center" label="状态" max-width="100px">
        <template slot-scope="scope">
          <el-tag  v-if="scope.row.status=='0'" type="danger">未审核</el-tag>
          <el-tag  v-if="scope.row.status=='1'">已审核</el-tag>
            <el-tag type="warning" v-if="scope.row.status=='4'">已拒绝</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center"  v-if="permissions==1" label="操作" max-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">

          <el-button  size="mini"  v-if="scope.row.status=='0'"  type="success" @click="handleModifyStatus(scope.row,1)">通过
          </el-button>
            <el-button  size="mini"  v-if="scope.row.status!='0'"  type="info" disabled @click="handleModifyStatus(scope.row,0)">完成
          </el-button>
              <el-button  size="mini"  v-if="scope.row.status=='0'"    type="warning" @click="handleRefused(scope.row)">拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
<el-dialog title="拒绝理由" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :visible.sync="dialogFormVisible">
  <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="temp.content">
        </el-input>
       </el-form>
          <div slot="footer" class="dialog-footer">
         <el-button  type="primary" @click="updateData">确定</el-button>
       </div>
</el-dialog>

<el-dialog
  title="大图"
  :visible.sync="dialogVisible"
  width="100%"
  :before-close="handleClose">
    <img width="100%" :src="diaimg">
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
import { tupuplist,withsuccess} from '@/api/topup'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { getToken } from '@/utils/auth' // getToken from cookie

const calendarTypeOptions = [
  { key: '1', display_name: '本地' },
  { key: '2', display_name: '暂住' },

]


const calendarStatusOptions = [
  { key: '1', display_name: '通过' },
  { key: '0', display_name: '待审核' },
  { key: '2', display_name: '拒绝通过' },

]
// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const calendarStatusKeyValue = calendarStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'user_audit',
  directives: {
    waves
  },
  data() {
    return {
      permissions:0,
      diaimg:"",
      tableKey: 0,
      list: null,
         dialogVisible: false,
         dialogContent:false,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        username: undefined,
        type: undefined,
        sort: '+id'
      },
      image_prefix:process.env.IMAGE_PREFIX,
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      calendarStatusOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      utemp:null,
      temp: {
        id: undefined,
        content:'',
        status: '',
        user_id:'',
        title:'',
      },
      sdata:{
          id:null,
          status:null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: '已审核',
        2: '未审核',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {

      return calendarTypeKeyValue[type]
    },
      statusFilter(status) {

      return calendarStatusKeyValue[status]
    }
  },
  created() {
     var dd= getToken();


   if(dd=="editor"){
    this.permissions=0;

   }else{
      this.permissions=1;

   }
    this.getList()
  },
  methods: {
     handleopen(val) {
        this.diaimg=val
        this.dialogVisible=true
        console.log(this.diaimg);
    },
     handleClose(done) {

        this.$confirm('确认关闭？')
          .then(_ => {
            done();

          })
          .catch(_ => {});
      },
    getList() {
      this.listLoading = true
      tupuplist(this.listQuery).then(response => {
        console.log(response.data);
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    // 修改审核状态
    handleModifyStatus(row, status) {
      const sdata=row
        sdata.type=3
        withsuccess(sdata).then(response => {
          console.log(response)
          const data=response.data;
           if(data.code==200){
              this.$message({
                message:data.msg,
                type: 'success'
              })
         row.status =status
           }else{
        this.$message({
                message:data.msg,
                type: 'warning'
              })
           }
         })

    // console.log(row.status)
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },

     handleCreate(row) {
       this.utemp=row;

      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

    },
    handleRefused(row){
    this.dialogFormVisible = true
    this.utemp=row;
     row.status=4

    },
    dialogClick(row){
      console.log(row);
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createData(this.temp).then(response => {

          this.temp.id = response.data.data
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
            })
        })
        this.list.unshift(this.temp)
        this.dialogFormVisible = false
        }
      })
    },
    // 修改
    handleUpdate(row,status) {
      this.temp = Object.assign({}, row) // copy obj
       this.temp.status = status
      this.dialogContent=true

      row.status=status
    },
    updateData(row) {
      const tempData = Object.assign({}, this.utemp)
      tempData.type=2
      tempData.content=this.temp.content
      console.log(tempData);
           withsuccess(tempData).then(response => {
             console.log(response);
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          this.dialogFormVisible=false
         })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
