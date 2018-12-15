 <template>
   <div class="app-container">
     <div class="filter-container">

       <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>

     </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="id" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="分类名称">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span> -->
            <span>{{scope.row.articels_name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="logo">
        <template slot-scope="scope">
          <!-- <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
          <el-tag>{{scope.row.type}}</el-tag> -->

      <img  :src="scope.row.images_url" class="avatar">
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="描述">
        <template slot-scope="scope">
          <!-- <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
          <el-tag>{{scope.row.type}}</el-tag> -->
         <span>{{scope.row.describe}}</span>
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


     <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
       <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
         <el-form-item label="分类名称" prop="skills_name">
           <el-input v-model="temp.articels_name"></el-input>
         </el-form-item>

         <el-form-item label="分类描述" prop="describe">
           <el-input v-model="temp.describe"></el-input>
         </el-form-item>
           <el-form-item label="排序" prop="describe">
           <el-input v-model="temp.sort"></el-input>
         </el-form-item>
           <el-form-item label="首页展示" prop="icon">

          <!-- <el-checkbox v-if="temp.certificate==0"  checked="true"> 备选项</el-checkbox> -->
        <el-select clearable class="filter-item" style="width: 130px" v-model="temp.status" placeholder="展示状态">
         <el-option v-for="item in  calendarStatusOptions" :key="item.key" :label="item.display_name" :value="item.key">
         </el-option>
       </el-select>
         </el-form-item>
             <el-form-item label="logo" prop="describe">
              <Upload :imageUrl="temp.images_url" v-model="temp.images_url">
              </Upload>
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
import { fetchList,ConfigCreate,ConfigDelele,ConfigStatus} from '@/api/articleconfig'

import Upload from '@/components/Upload/singleLogin'
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
    components:{Upload},
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
      temp: {
        id: undefined,
        certificate:false,
        articels_name:'',
        describe: '',
        images_url:'',
        status: ''
      },
      sdata:{
          id:null,
          status:null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
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
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        certificate:false,
        articels_name: '',
        describe: '',
        images_url:'',
        status: ''
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
          ConfigCreate(this.temp).then(response => {
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

      ConfigDelele(id).then(response=>{
        console.log(id);
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
     // 修改审核状态
    handleModifyStatus(row, status) {
        this.sdata.status=status
        this.sdata.id=row.id
        ConfigStatus(this.sdata).then(response => {
            console.log(response)
         })
      this.$message({
        message: '操作成功',
        type: 'success'
      })

      row.status =status
    // console.log(row.status)
    },


  }
}
</script>
