<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="商品名称" v-model="listQuery.username">
      </el-input>

      <!-- <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="证件类型">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select> -->
        <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.status" placeholder="商品状态">
        <el-option v-for="item in  calendarStatusOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>

      <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showReviewer">{{$t('table.reviewer')}}</el-checkbox>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="id" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="套餐名称">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span> -->
            <span>{{scope.row.labor_name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" label="logo">
        <template slot-scope="scope">
          <!-- <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
          <el-tag>{{scope.row.type}}</el-tag> -->
            <img  :src="image_prefix+scope.row.images" class="avatar">
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" label="销量">
        <template slot-scope="scope">
            <span>{{scope.row.sales}}</span>
        </template>
      </el-table-column>
       <el-table-column width="110px" align="center" label="现价">
        <template slot-scope="scope">
        <span>{{scope.row.present_price}}</span>
        </template>
      </el-table-column>
       <el-table-column width="110px" align="center" label="原价">
        <template slot-scope="scope">
         <span>{{scope.row.original_price}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag  v-if="scope.row.status!='1'" type="danger">下架</el-tag>
          <el-tag  v-if="scope.row.status=='1'">上架</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>


          <el-button  size="mini"  v-if="scope.row.status!='1'"  type="success" @click="handleModifyStatus(scope.row,1)">下架
          </el-button>
            <el-button  size="mini"  v-if="scope.row.status=='1'"  type="danger" @click="handleModifyStatus(scope.row,0)">上架
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
         <el-form-item label="套餐名">
          <el-input v-model="temp.labor_name" placeholder="请输入内容"></el-input>

        </el-form-item>
         <el-form-item label="现价">
          <el-input v-model="temp.present_price" placeholder="请输入内容"></el-input>

        </el-form-item>
        <el-form-item label="原价">
          <el-input v-model="temp.original_price" placeholder="请输入内容"></el-input>

        </el-form-item>

        <el-form-item>

        <el-upload
        v-if="dialogStatus=='create'"
        action="
        '"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        >
        <i class="el-icon-plus"></i>
        </el-upload>
          <el-upload
       v-else
        action="https://new.10huisp.com/v1/images/upload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :file-list="fileList3">
        <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
</el-dialog>
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
import { LoabrList,createData,update,Editstatus,Delete } from '@/api/shop'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import Vue from 'vue';

const calendarTypeOptions = [
   { key: '0', display_name: '所有' },
  { key: '1', display_name: '本地' },
  { key: '2', display_name: '暂住' },

]
const calendarStatusOptions = [
  { key: '0', display_name: '所有' },
  { key: '1', display_name: '已上架' },
  { key: '2', display_name: '未上架' },

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

      fileList3: [{name:'',url:''}],
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
       image_prefix:process.env.IMAGE_PREFIX,
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
        editimges: {
        name:'imges',
        url: '',
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
    getList() {
      this.listLoading = true
      LoabrList(this.listQuery).then(response => {

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
           this.images=[]
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
      // Vue.set(this.fileList3,'name','1')
      // Vue.set(this.fileList3,'url',this.temp.images)
      this.fileList3[0].url=this.image_prefix+this.temp.images
       this.fileList3[0].name='123'
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
  width: 200px
}
</style>

