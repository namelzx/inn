<template>
  <div class="app-container">
    <div class="filter-container">
      
      <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="输入任务名" v-model="listQuery.title">
      </el-input>
    
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.id" placeholder="服务区域">
        <el-option v-for="item in  calendararaeOptions" :key="item.id" :label="item.city_name" :value="item.id">
        </el-option>
      </el-select>
        <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.status" placeholder="审核状态">
        <el-option v-for="item in  calendarStatusOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
     
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
     
      
    </div>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="id" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="工作名称">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span> -->
            <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="地区">
        <template slot-scope="scope">
          <!-- <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
          <el-tag>{{scope.row.type}}</el-tag> -->
          <span>{{scope.row.area}}</span>
        </template>
      </el-table-column>
        <el-table-column min-width="150px" align="center" label="工作地址">
        <template slot-scope="scope">
          <!-- <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
          <el-tag>{{scope.row.type}}</el-tag> -->
          <span>{{scope.row.work}}</span>
        </template>
      </el-table-column>
      
      <el-table-column class-name="status-col" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag  v-if="scope.row.status!='1'" type="danger">未领取</el-tag>
          <el-tag  v-if="scope.row.status=='1'">已领取</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
     
            
         
       
         <el-button  size="mini" type="danger" @click="handleDelete(scope.row,scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


  </div>
</template>

<script>
import { getTaskitem,statusUser, createSkills, Delete, update,statusSk } from '@/api/task'
import {AreaList} from '@/api/area'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import '@/assets/icon/iconfont.css'
const calendarTypeOptions = [
  { key: '1', display_name: '本地' },
  { key: '2', display_name: '暂住' },
]


const calendarStatusOptions = [
  { key: '1', display_name: '已领取' },
  { key: '2', display_name: '未领取' },
  
]
// 服务区域
const calendararaeOptions=[

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
const calendArreaKeyValue = calendararaeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.city_name
  return acc
}, {})

export default {
  name: 'index',
  directives: {
    waves
  },
  data() {
    return {
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
        title:undefined,
        sort: '+id',
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      calendarStatusOptions,
      calendararaeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        skills_name: '',
        timestamp: new Date(),
        describe: '',
        icon: '',
        status: 'published'
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
    },
    areaFilter(id){
      return calendArreaKeyValue[id]
    }
    
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getTaskitem(this.listQuery).then(response => {
        // console.log(response);
     
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
      AreaList(this.listQuery).then(response => {
       
        this.calendararaeOptions=response.data.data
        //  console.log(  this.calendararaeOptions);
        // this.list = response.data.data
        // this.total = response.data.total
        // this.listLoading = false
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createSkills(this.temp).then(response => {
          this.temp.id = response.data.data.data
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
       
      this.temp.timestamp = new Date(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
       
        updateSkills(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row,id) {
      console.log(row);
      Delete(id).then(response=>{
       this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
         
        const index = this.list.indexOf(row)
   
       this.list.splice(index, 1)
      
      })
    
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
