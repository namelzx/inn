<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="搜索用户名" v-model="listQuery.username">
      </el-input>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="技能类型">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
        <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.status" placeholder="审核状态">
        <el-option v-for="item in  calendarStatusOptions" :key="item.key" :label="item.display_name" :value="item.key">
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
      <el-table-column width="100px" align="center" label="用户名">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span> -->
            <span v-if="scope.row.userinfo!=null">{{scope.row.userinfo.username}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center"  label="技能类型">
        <template slot-scope="scope">
          <!-- <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
          <el-tag>{{scope.row.type}}</el-tag> -->
           <el-tag  type="success">{{scope.row.skills.skills_name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" label="证书地址">
        <template slot-scope="scope" >
          <img v-if="scope.row.images_url!=null"  :src="scope.row.images_url" class="avatar">
           <span v-if="scope.row.images_url==null">无证书</span>
        </template>
      </el-table-column>
       <el-table-column min-width="150px" align="center" label="技能描述">
        <template slot-scope="scope" >
           <span>{{scope.row.describe}}</span>
        </template>
      </el-table-column>
       <el-table-column min-width="150px" align="center" label="个人履历">
        <template slot-scope="scope" >
           <span>{{scope.row.cv}}</span>
        </template>
      </el-table-column>
         <el-table-column min-width="110px" align="center" label="提交时间">
        <template slot-scope="scope">
             <span>{{scope.row.create_time | formatTime('{y}-{m}-{d} {h}:{i}')}}</span>

        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag  v-if="scope.row.status=='0'" type="danger">未审核</el-tag>
          <el-tag  v-if="scope.row.status=='1'">已审核</el-tag>
          <el-tag  v-if="scope.row.status=='2'" type="warning">已拒绝</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="permissions==1" align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button  size="mini"  v-if="scope.row.status!='1'"  type="success" @click="handleModifyStatus(scope.row,1)">通过
          </el-button>
            <el-button  size="mini"  v-if="scope.row.status=='1'"  type="danger" @click="handleModifyStatus(scope.row,0)">取消
          </el-button>
              <el-button  size="mini"  type="warning" @click="handleRefused(scope.row)">拒绝
          </el-button>
            <el-button  size="mini"  type="primary" @click="handleAuth(scope.row)">人工
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



 <el-dialog title="认证信息" :visible.sync="dialogFormAuth">
       <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
         <el-form-item label="技能描述" prop="skills_name">
         <el-input
  type="textarea"
  :autosize="{ minRows: 2, maxRows: 4}"

  placeholder="请输入内容"
  v-model="temp.describe">
</el-input>
         </el-form-item>
         <el-form-item label="个人履历" prop="describe">
              <el-input
  type="textarea"
  :autosize="{ minRows: 2, maxRows: 4}"

  placeholder="请输入内容"
  v-model="temp.cv">
</el-input>
         </el-form-item>
         <el-form-item label="上传证件" prop="describe">
         <el-select @change="handelcalendar" clearable class="filter-item" style="width: 130px" v-model="temp.checked" placeholder="技能状态">
         <el-option v-for="item in  showStatusOptions" :key="item.key" :label="item.display_name" :value="item.key">
         </el-option>
       </el-select>
         </el-form-item>

       <el-form-item v-show="calendarshow" label="证件" prop="describe">

    <Upload v-if="temp.audit==1" :imageUrl="temp.images_url" v-model="temp.images_url" >
            </Upload>

               <Upload v-else :imageUrl="temp.images_url" v-model="temp.images_url" >
            </Upload>
      </el-form-item>


       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button  type="primary" @click="updateinfoData">{{$t('table.confirm')}}</el-button>
       </div>
     </el-dialog>
  </div>
</template>

<script>
import { SkillsList,statusSkills, fetchPv, createArticle, updateData } from '@/api/skills'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils/index'
import { getToken } from '@/utils/auth' // getToken from cookie
import Upload from '@/components/Upload/singlelogin'
const calendarTypeOptions = [
   { key: '0', display_name: '查询所有' },
  { key: '1', display_name: '客房保洁' },
  { key: '2', display_name: '水电维修' },
  { key: '3', display_name: '勤杂帮工' },
  { key: '4', display_name: '其他' },

]
const calendarStatusOptions = [
  { key: '1', display_name: '已审核' },
  { key: '2', display_name: '未审核' },

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
  name: 'audit',
  directives: {
    waves
  },
   components:{
Upload
   },
  data() {
    return {
      checked:undefined,
     showStatusOptions:[
         { key: '1', display_name: '启用' },
  { key: '2', display_name: '不启用' },
      ],
         dialogFormVisible: false,
      dialogFormAuth:false,
      permissions:0,
        image_prefix:process.env.IMAGE_PREFIX,
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
      utemp:[],
      temp:[],
      calendarshow:false,
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      calendarStatusOptions,

      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      sdata:{
          id:null,
          status:null
      },


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
    updateinfoData(){
      if(this.calendarshow==true){
        if(this.temp.images_url==null){
            return false;
        }
      }
      updateData(this.temp).then(res=>{
          this.$message({
                message: '操作成功',
                type: 'success'
            })
      })

      this.dialogFormAuth=false;

    },
    handelcalendar(res){
      if(res==1){
        this.calendarshow=true;
      }else{
         this.calendarshow=false;
      }

    },
     handleRefused(row){
    this.dialogFormVisible = true
    this.utemp=row;
     row.status=2

    },
      updateData(row) {
      const tempData = Object.assign({}, this.utemp)
      tempData.status=2
      tempData.content=this.temp.content
      this.dialogFormVisible=false;
      console.log( tempData)
        statusSkills(tempData).then(response => {
          this.$message({
                message: '操作成功',
                type: 'success'
            })
         })

    },
        // 修改
    handleAuth(row) {
      this.temp=row
      // this.dialogStatus = 'update'
      this.dialogFormAuth = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getList() {
      this.listLoading = true
      SkillsList(this.listQuery).then(response => {
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
        this.sdata.user_id=row.user_id
        this.sdata.exp=row.exp
        statusSkills(this.sdata).then(response => {
          this.$message({
                message: '操作成功',
                type: 'success'
            })
         })
      row.status =status
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
  }
}
</script>
