<template>

  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="搜索名称" v-model="listQuery.username">
      </el-input>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="类型">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="id" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="课程标题">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span> -->
            <span>{{scope.row.training_name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" label="logo">
        <template slot-scope="scope">
          <!-- <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
          <el-tag>{{scope.row.type}}</el-tag> -->
           <img width="100px" :src="scope.row.logo" class="avatar">
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" label="讲课老师">
        <template slot-scope="scope">
             <span>{{scope.row.teacher}}</span>
        </template>
      </el-table-column>

             <el-table-column width="110px" align="center" label="课程开始时间">
        <template slot-scope="scope">
        <span>{{scope.row.start_time}}</span>
        </template>
      </el-table-column>
         <el-table-column width="110px" align="center" label="签到码">
        <template slot-scope="scope">
     <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
         <el-table-column width="110px" align="center" label="可报名人数">
        <template slot-scope="scope">
       <span>{{scope.row.willnum}}</span>
        </template>
      </el-table-column>
        <!-- <el-table-column width="110px" align="center" label="状态">
        <template slot-scope="scope">
        <span v-if="scope.row.status!='1'" >默认展示</span>
          <span v-if="scope.row.status=='1'" >首页展示</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="操作" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">

             <router-link :to="'/training/training_offline/'+scope.row.id">
        <el-button  size="mini" width="none" type="info" >已报名</el-button>
          </router-link>
          <router-link v-if="scope.row.type==1" :to="'/training/edit/'+scope.row.id">

               <el-button  size="mini" type="primary" >编辑</el-button>
          </router-link>
             <router-link v-if="scope.row.type==2" :to="'/training/onedit/'+scope.row.id">

               <el-button  size="mini" type="primary" >编辑</el-button>
          </router-link>

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
import { trainingList,Delete} from '@/api/training'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const calendarTypeOptions = [
  { key: '1', display_name: '线下' },
  { key: '2', display_name: '线上' },

]
const calendarStatusOptions = [
  { key: '1', display_name: '已审核' },
  { key: '0', display_name: '未审核' },

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
  name: 'package',
  directives: {
    waves
  },
  data() {
    return {
      dialogImageUrl: '',
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
      },
      image_prefix:process.env.IMAGE_PREFIX,
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      calendarStatusOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        training_name: '',//课程名称
        apply_time: undefined, // 报名时间
        deadline:undefined,//课程截止时间
        start_time:undefined,//课程开始时间
        code:0,//签到码
        describe:'',//描述
        logo:'',//logo
        willnum:'',//报名人数
        teacher:'',//讲课老师
        exp:'',//可获得经验
        sales: 0,
        present_price: 0,
        original_price:0,
        images: '',
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

      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      trainingList(this.listQuery).then(response => {
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
        this.sdata.status=status
        this.sdata.id=row.id

        Editstatus(this.sdata).then(response => {
            console.log(response)
         })

      this.$message({
        message: '操作成功',
        type: 'success'
      })

      row.status =status
    // console.log(row.status)
    },
    handleDelete(row,id){
    Delete(id).then(response=>{
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)

        this.list.splice(index,1)
        })
    },
    resetTemp() {
      this.temp = {
        labor_name: '',
        present_price: 0,
        original_price:0,
        images: '',
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


      updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp);
          update(this.temp).then(response => {
          this.temp.id = response.data.data
          this.$notify({
            title: '成功',
            message: '更新成功',
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

    handleRemove(file, fileList) {

    },
    handlePictureCardPreview(file) {
    this.dialogImageUrl = file.url;
    this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList){
         this.temp.images=response.path;
         console.log(this.temp);
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
<style>
 .cell img{
   width: 100px;
 }
 .fixed-width .el-button--mini{
   width: none !important;
 }

</style>
