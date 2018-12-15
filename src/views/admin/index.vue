<template>
<div class="app-container">
    <div class="filter-container">

 <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="id" min-width="100">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100" align="center" label="用户名">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span> -->
            <span>{{scope.row.user_name}}</span>
        </template>
      </el-table-column>

        <el-table-column min-width="100" align="center" label="角色">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span> -->
            <span>{{scope.row.real_name}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" min-width="100">
        <template slot-scope="scope">
          <el-tag  v-if="scope.row.status=='0'" type="danger">禁用</el-tag>
          <el-tag  v-if="scope.row.status=='1'">启用</el-tag>

        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button  size="mini"  v-if="scope.row.status!='1'"  type="success" @click="handleModifyStatus(scope.row,1)">通过
          </el-button>
            <el-button  size="mini"  v-if="scope.row.status=='1'"  type="danger" @click="handleModifyStatus(scope.row,0)">取消
          </el-button>
              <el-button  size="mini"  type="warning" @click="handleRefused(scope.row,scope.row.id)">删除
          </el-button>
             <el-button  size="mini"  type="primary" @click="handleUpdate(scope.row)">修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>



 <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
       <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
         <el-form-item  label="用户名" prop="skills_name">
           <el-input v-model="temp.user_name"></el-input>
         </el-form-item>
          <el-form-item  label="密码" prop="skills_name">
           <el-input v-model="temp.password"></el-input>
         </el-form-item>
           <el-form-item  label="角色" prop="skills_name">
         <el-select v-model="temp.real_name" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.real_name"
                :label="item.label"
                :value="item.real_name">
              </el-option>
            </el-select>
         </el-form-item>
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click="dialogFormAuth = false">{{$t('table.cancel')}}</el-button>
         <el-button v-if="dialogStatus=='create'"  type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
         <el-button v-else type="primary" @click="updateinfoData">{{$t('table.confirm')}}</el-button>
       </div>
     </el-dialog>


  </div>
</template>

<script>
import { AdminList,statusAD, dele,update, add} from '@/api/admin'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import Upload from '@/components/Upload/singlelogin'

const calendarTypeOptions = [
  { key: '1', display_name: '本地' },
  { key: '2', display_name: '暂住' },

]


const calendarStatusOptions = [
  { key: '1', display_name: '通过' },
  { key: '2', display_name: '待审核' },
  { key: '3', display_name: '拒绝通过' },

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
  components:{Upload},
  data() {
    return {
        fileList3: [{name:'',url:''}],
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
        options: [{
          real_name: 'admin',
          label: '管理员'
        }, {
          real_name: 'editor',
          label: '编辑'
        }],
      showReviewer: false,
      utemp:null,
      temp: {
        id: undefined,
        password:'',
        user_name:'',
        real_name:'',
      },
      sdata:{
          id:null,
          status:null
      },
      dialogFormAuth:false,
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
    this.getList()
  },
  methods: {

   // 修改
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true

    },
  handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormAuth = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getList() {
      this.listLoading = true
      AdminList(this.listQuery).then(response => {

        this.list = response.data.data.data
        this.total = response.data.total
        this.listLoading = false
           console.log(this.list);
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

         console.log(this.sdata)
        statusAD(this.sdata).then(response => {
            console.log(response)
         })
      this.$message({
        message: '操作成功',
        type: 'success'
      })

      row.status =status
    // console.log(row.status)
    },
    resetTemp() {
      this.temp = {
        id: undefined,

      }
    },

     handleCreate(row) {
       this.utemp=row;
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true

    },
    handleRefused(row,id){
      dele(id).then(response=>{
        console.log(response)
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
    dialogClick(row){
      console.log(row);
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          add(this.temp).then(response => {
          console.log(response)
          this.temp.id = response.data.data
           this.temp.status =0
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
    updateData(row) {
      const tempData = Object.assign({}, this.utemp)
      tempData.status=4
      tempData.content=this.temp.content
      console.log(tempData);
           statusUser(tempData).then(response => {
             console.log(response);
            this.$message({
              message: '操作成功',
              type: 'success'
            })

             this.dialogFormVisible=false
         })
    },
      updateinfoData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
        //  tempData.images_url=this.image_prefix+ tempData.images_card


           for (const v of this.list) {

              if (v.id === this.temp.id) {
                  if(v.password==this.temp.password){
                  this.$notify({
                        title: '警告',
                        message: '请更改密码',
                        type: 'warning',
                        duration: 2000
                      })
                    return false
                  }
              }
            }
        update(tempData).then(response=>{
            console.log(response);
           for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, response.data.data)
                break
              }
            }
            this.dialogFormVisible=false
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
