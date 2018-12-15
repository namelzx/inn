 <template>
   <div class="app-container">
     <div class="filter-container">

       <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>

     </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="id" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="技能名称">
        <template slot-scope="scope">

            <span>{{scope.row.skills_name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="描述">
        <template slot-scope="scope">

         <span>{{scope.row.describe}}</span>
        </template>
      </el-table-column>
        <el-table-column min-width="150px" align="center" label="奖励金">
        <template slot-scope="scope">
         <span>{{scope.row.reward}}</span>
        </template>
      </el-table-column>
         <el-table-column min-width="150px" align="center" label="经验值">
        <template slot-scope="scope">
         <span>{{scope.row.exp}}</span>
        </template>
      </el-table-column>

         <el-table-column class-name="status-col" label="状态" width="100">
         <template slot-scope="scope">
           <el-tag  v-if="scope.row.status!='1'" type="danger">未审核</el-tag>
           <el-tag  v-if="scope.row.status=='1'">已审核</el-tag>
         </template>
       </el-table-column>
           <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
         <template slot-scope="scope">
           <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>


           <el-button  size="mini"  v-if="scope.row.status!='1'"  type="success" @click="handleModifyStatus(scope.row,1)">展示
           </el-button>
             <el-button  size="mini"  v-if="scope.row.status=='1'"  type="danger" @click="handleModifyStatus(scope.row,0)">隐藏
           </el-button>
          <el-button  size="mini" type="danger" @click="handleDelete(scope.row,scope.row.id)">删除</el-button>
         </template>
           </el-table-column>
    </el-table>
     <div class="pagination-container">
       <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
       </el-pagination>
     </div>

     <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
       <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
         <el-form-item label="技能名" prop="skills_name">
           <el-input v-model="temp.skills_name"></el-input>
         </el-form-item>

         <el-form-item label="描述" prop="describe">
           <el-input v-model="temp.describe"></el-input>
         </el-form-item>
         <el-form-item label="经验值" prop="describe">
           <el-input v-model="temp.exp"></el-input>
         </el-form-item>

         <el-form-item label="图标码" prop="icon">
           <el-input v-model="temp.icon"></el-input>
         </el-form-item>
         <el-form-item label="奖励金" prop="icon">
           <el-input v-model="temp.reward"></el-input>
         </el-form-item>
           <el-form-item label="证件" prop="icon">

          <!-- <el-checkbox v-if="temp.certificate==0"  checked="true"> 备选项</el-checkbox> -->
           <el-select clearable class="filter-item" style="width: 130px" v-model="checked" placeholder="技能状态">
         <el-option v-for="item in  calendarStatusOptions" :key="item.key" :label="item.display_name" :value="item.key">
         </el-option>
       </el-select>
         </el-form-item>
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
         <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
         <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
       </div>
     </el-dialog>

     <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
       <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
         <el-table-column prop="key" label="Channel"> </el-table-column>
         <el-table-column prop="pv" label="Pv"> </el-table-column>
       </el-table>
       <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
       </span>
     </el-dialog>

   </div>
 </template>

 <script>
import { getSkillsitem,statusUser, createSkills, DeleteSkills, updateSkills,statusSk } from '@/api/skills'
import waves from '@/directive/waves'  //水波纹指令
import { parseTime } from '@/utils'
import '@/assets/icon/iconfont.css'
const calendarTypeOptions = [
  { key: '1', display_name: '本地' },
  { key: '2', display_name: '暂住' },

]


const calendarStatusOptions = [
  { key: '1', display_name: '启用' },
  { key: '2', display_name: '不启用' },
]

const calendarStatusKeyValue = calendarStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'index',
  directives: {
    waves
  },
  data() {
    return {
      checked:'',
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
         image_prefix:process.env.IMAGE_PREFIX,
      temp: {
        id: undefined,
        certificate:false,
        skills_name: '',
        timestamp: new Date(),
        describe: '',
        icon: '',
        exp: undefined,
        status: 'published',
        reward:''
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
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getSkillsitem(this.listQuery).then(response => {
        console.log(response);
        this.list = response.data.data
        this.total = response.data.total


        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
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

        statusSk(this.sdata).then(response => {
            console.log(response)
         })

      this.$message({
        message: '操作成功',
        type: 'success'
      })

      row.status =status
     console.log(row.status)
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: '',
        checked:true
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
   //  修改
    handleUpdate(row) {
      this.temp = Object.assign({}, row)

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
          tempData.timestamp = +new Date(tempData.timestamp)
          tempData.checked=this.checked

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
      DeleteSkills(id).then(response=>{
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
