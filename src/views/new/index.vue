<template>
  <div class="app-container">
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="id" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="标题">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span> -->
            <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
        <el-table-column min-width="110px"  align="center" label="公司名称">
        <template slot-scope="scope">
            <span  >{{scope.row.qyname}}</span >
        </template>
      </el-table-column>
        <el-table-column width="110px"  align="center" label="联系方式">
        <template slot-scope="scope">
            <span  >{{scope.row.tel}}</span >
        </template>
      </el-table-column>

      <el-table-column width="110px"  align="center" label="价格描述">
        <template slot-scope="scope">
            <span  >{{scope.row.price}}</span >
        </template>
      </el-table-column>
      <el-table-column min-width="150px"  align="center" label="所在区域">
        <template slot-scope="scope">
          <!-- <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
          <el-tag>{{scope.row.type}}</el-tag> -->
          <span>{{scope.row.area}}</span>
        </template>
      </el-table-column>
        <el-table-column width="110px"  align="center" label="标签">
        <template slot-scope="scope">
            <span  >{{scope.row.label}}</span >

        </template>
      </el-table-column>



       <el-table-column min-width="110px"  align="center" label="展示开始时间">
        <template slot-scope="scope">
            <span  >{{scope.row.start_time}}</span >
        </template>
      </el-table-column>

   <el-table-column min-width="110px"  align="center" label="展示结束时间">
        <template slot-scope="scope">
            <span  >{{scope.row.end_time}}</span >
        </template>
      </el-table-column>

      <el-table-column min-width="110px"  align="center" label="排序">
        <template slot-scope="scope">
            <span  >{{scope.row.sort}}</span >
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">

          <router-link :to="'/new/edit/'+scope.row.id">
        <el-button  size="mini" type="primary" >编辑</el-button>
          </router-link>
        <el-button  size="mini" type="danger" @click="handleDelete(scope.row,scope.row.id)">删除</el-button>

          <el-button size="mini" type="success" v-if="scope.row.top!=1"  @click="handelTop(scope.row,1)">置顶</el-button>
          <el-button size="mini" type="danger" v-if="scope.row.top==1"  @click="handelTop(scope.row,0)">取消</el-button>

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
import { fetchList,Delete,setStatus} from '@/api/news'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
const calendarTypeOptions = [
  { key: '1', display_name: '本地' },
  { key: '2', display_name: '暂住' },
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
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      calendarStatusOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        labor_name: '',
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
      rules: {
        labor_name: [{ required: true, message: '商品需要填写', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        present_price: [{ required: true, message: '价格需要填写', trigger: 'blur' }],
        original_price:[{ required: true, message: '价格需要填写', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: '已上架',
        2: '未上架',
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
    this.getList()
  },
  methods: {
    handelTop(row,status){
      const data={};
      data.id=row.id;
      data.top=status;
   setStatus(data).then(response=>{

   })
       row.top =status

    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {

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
        this.list.splice(index, 1)
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
