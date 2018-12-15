<template>
<div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="输入用户名" v-model="listQuery.username">
      </el-input>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="证件类型">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
        <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.status" placeholder="审核状态">
        <el-option v-for="item in  calendarStatusOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-tag type="success">当前人数:{{total}}</el-tag>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">

      <el-table-column width="100px" align="center" label="用户名">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span> -->
            <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" label="证件类别">
        <template slot-scope="scope" @click="handeltype(scope.row,1)">

              <a  v-if="scope.row.type=='1'"  @click="handeltype(scope.row,2)" >
                <el-tag   type="success">本地</el-tag>
              </a>
             <a   v-if="scope.row.type=='2'" @click="handeltype(scope.row,1)" >
             <el-tag   type="warning">暂住</el-tag>
          </a>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="暂住证明">
        <template slot-scope="scope" >
          <template v-if="scope.row.type==2">
          <img  v-if="scope.row.audit==1" @click="handleopen(scope.row.images_url)" :src="scope.row.images_url" class="avatar">
           <img v-if="scope.row.audit==0" @click="handleopen(scope.row.images_url)" :src="scope.row.images_url" class="avatar">
          </template>
          <template v-else>
            本地居民不需要上传暂住证
          </template>
        </template>
      </el-table-column>
      <el-table-column width="110px"  align="center" label="身份证">
        <template slot-scope="scope">
        <img v-if="scope.row.audit==1"   @click="handleopen(scope.row.images_card)"  width="100%" :src="scope.row.images_card" class="avatar">
       <img v-else @click="handleopen(scope.row.images_card)"  width="100%" :src="scope.row.images_card" class="avatar">
        </template>
      </el-table-column>
        <el-table-column class-name="status-col" label="居住地址" mix-width="150">
        <template slot-scope="scope">
         <span>{{scope.row.work}} {{scope.row.detailed}} </span>
        </template>
      </el-table-column>
        <el-table-column class-name="status-col" label="手机号码" mix-width="100">
        <template slot-scope="scope">
         <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag  v-if="scope.row.status=='0'" type="danger">未审核</el-tag>
          <el-tag  v-if="scope.row.status=='1'" type="success">已通过</el-tag>
            <el-tag  v-if="scope.row.status=='9'" type="info">已撤销</el-tag>
            <el-tag type="danger" v-if="scope.row.status=='4'">已拒绝</el-tag>
        </template>
      </el-table-column>
        <el-table-column class-name="status-col" label="分配" width="100">
        <template slot-scope="scope">
          <el-tag  v-if="scope.row.awarded==2" type="danger">未分配</el-tag>
          <el-tag  v-if="scope.row.awarded==1">{{scope.row.user_name}}</el-tag>

        </template>
      </el-table-column>


       <el-table-column width="110px" align="center" label="注册模式">
        <template slot-scope="scope" >
          <template v-if="scope.row.type==2">
           <!-- <img  v-if="scope.row.audit==1" @click="handleopen(scope.row.images_url)" :src="scope.row.images_url" class="avatar">
           <img v-if="scope.row.audit==0" @click="handleopen(scope.row.images_url)" :src="scope.row.images_url" class="avatar"> -->
            <span  v-if="scope.row.images_card==''">
               <el-tag v-if="scope.row.guarantee_status==1" type="success">
                推荐人
               </el-tag>
                  <el-tag v-else type="warning">
                  推荐人
               </el-tag>
            </span>
            <el-tag  v-else>
               证件上传
            </el-tag>

          </template>
          <template v-else>
            本岛
          </template>
        </template>
      </el-table-column>

          <el-table-column class-name="status-col" label="邀请人" width="100">
        <template slot-scope="scope">
          <a @click="handeredfe(scope.row)" v-if="scope.row.referees_status==2">
            <el-tag type="warning"  v-if="scope.row.referees!=null">{{scope.row.referees}}</el-tag>
             <el-tag type="warning" v-if="scope.row.referees==null">未填写</el-tag>
          </a>
           <a  v-if="scope.row.referees_status==1">
             <el-tag type="success">已发放</el-tag>
          </a>
        </template>
      </el-table-column>
      <el-table-column  v-if="permissions==1"    fixed="right" align="center" label="操作" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope" >
          <el-button  size="mini"  v-if="scope.row.status=='0'"  type="success" @click="handleModifyStatus(scope.row,1)">通过
          </el-button>
            <el-button  size="mini"  v-if="scope.row.status=='9'"  type="success" @click="handleModifyStatus(scope.row,1)">恢复
          </el-button>

            <el-button  size="mini"  v-if="scope.row.status=='1'"  type="info" @click="handeleundo(scope.row)">撤销用户
          </el-button>
          <template v-if="scope.row.status !='9'">
              <el-button  size="mini"  v-if="scope.row.status!='1'"   type="warning" @click="handleRefused(scope.row)">拒绝
             </el-button>

          </template>
               <el-button  size="mini"     type="info" @click="handelawarded(scope.row)">分配
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
<el-dialog title="拒绝理由" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :visible.sync="dialogFormRefused">
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
 <el-dialog title="用户信息" :visible.sync="dialogFormAuth">
       <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
         <el-form-item label="用户名" prop="skills_name">
           <el-input v-model="temp.username"></el-input>
         </el-form-item>

         <el-form-item label="手机" prop="describe">
           <el-input v-model="temp.mobile"></el-input>
         </el-form-item>
         <el-form-item label="工作地址" prop="describe">
           <el-input v-model="temp.work"></el-input>
         </el-form-item>
   <el-form-item label="身份证" prop="describe">
    <Upload v-if="temp.audit==1"  :imageUrl="temp.images_card" v-model="temp.images_card" >
            </Upload>
             <Upload v-else  :imageUrl="temp.images_card" v-model="temp.images_card" >
            </Upload>
      </el-form-item>
       <el-form-item label="暂住证" prop="describe">

    <Upload v-if="temp.audit==1" :imageUrl="temp.images_url" v-model="temp.images_url" >
            </Upload>
               <Upload v-else :imageUrl="temp.images_url" v-model="temp.images_url" >
            </Upload>
      </el-form-item>
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click="dialogFormAuth = false">{{$t('table.cancel')}}</el-button>
         <el-button v-if="dialogStatus=='create'"  type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
         <el-button v-else type="primary" @click="updateinfoData">{{$t('table.confirm')}}</el-button>
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



    <el-dialog title="分配任务" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="awarded" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
          <el-form-item label="绑定人员" prop="icon">
        <el-select  v-model="awarded.admin_id" filterable placeholder="请选择">
              <el-option
                v-for="item in user"
                :key="item.id"
                :label="item.user_name"
                :value="item.id"
                >
              </el-option>
            </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">

        <el-button  type="primary" @click="handeladdawarded()">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

     <el-dialog title="推荐奖励金" :visible.sync="dialogFormVfede">
      <el-form :rules="rules" ref="dataForm" :model="fedetemp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="奖励金额" prop="describe">
           <el-input v-model="fedetemp.price"></el-input>
         </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">

        <el-button  type="primary" @click="handeladdfede()">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog
        title="确认信息"
        :visible.sync="dialogundo"
        width="30%"
        :before-close="handleClose">
        <span>确定撤销该用户的身份认证？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogundo = false">取 消</el-button>
          <el-button type="primary" @click="handeleuned()">确 定</el-button>
        </span>
</el-dialog>
  </div>
</template>
<script>
import {
  UserList,
  statusUser,
  updateArticle,
  setUserbyUpdate,
  SetByType,
  PostAwardedByData,
  GetRedfedeByFind,
  SetRedfeByAdd
} from "@/api/user";
import { AdminSele } from "@/api/admin";
import waves from "@/directive/waves"; // 水波纹指令
import { parseTime } from "@/utils";
import Upload from "@/components/Upload/singlelogin";
import { getToken, getAdmin } from "@/utils/auth"; // getToken from cookie

const calendarTypeOptions = [
  { key: "1", display_name: "本地" },
  { key: "2", display_name: "暂住" }
];

const calendarStatusOptions = [
  { key: "1", display_name: "通过" },
  { key: "2", display_name: "待审核" },
  { key: "3", display_name: "拒绝通过" }
];
// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

const calendarStatusKeyValue = calendarStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "user_audit",
  directives: {
    waves
  },
  components: { Upload },
  data() {
    return {
      dialogundo: false,
      dialogFormVfede: false,
      dialogFormRefused: false,
      dialogFormVisible: false,
      permissions: 0,
      dtype: {
        id: undefined,
        type: undefined
      },
      fileList3: [{ name: "", url: "" }],
      diaimg: "",
      tableKey: 0,
      list: null,
      dialogVisible: false,
      dialogContent: false,
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
      user: [],
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
      utemp: null,
      awarded: {},
      rede_id: undefined, //用户id主要用于奖励金发放
      c_id: undefined, //任务id
      fedetemp: {
        user_id: undefined,
        price: undefined,
        c_id: undefined
      },
      temp: {
        id: undefined,
        content: "",
        status: "",
        user_id: "",
        title: "",
        images_card: "",
        images_url: "",
        audit: ""
      },
      sdata: {
        id: null,
        status: null
      },
      dialogFormAuth: false,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      undotemp: {},
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" }
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" }
        ]
      },
      downloadLoading: false
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "已通过",
        2: "未审核",
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
    var dd = getToken();
    AdminSele().then(response => {
      this.user = response.data.data;
    });
    if (dd == "editor") {
      this.permissions = 0;
    } else {
      this.permissions = 1;
    }
    this.getList();
  },
  methods: {
    handeleundo(row) {
      this.undotemp = row;
      this.dialogundo = true;
    },
    handeleuned() {
      statusUser(this.undotemp).then(response => {
        for (var i = 0; i < this.list.length; i++) {
          this.list[0].status = 9;
        }
      });
      this.dialogundo = false;
      this.$message({
        message: "操作成功",
        type: "success"
      });
    },
    handeredfe(row) {
      if (row.referees == null) {
        this.$message({
          message: "没有填写推荐人",
          type: "error"
        });
        return false;
      }
      GetRedfedeByFind(row).then(response => {
        const data = response.data;
        this.dialogFormVfede = true;
        if (response.data != null) {
          this.rede_id = data.id;
          this.c_id = row.id;
        } else {
          this.$message({
            message: "该用户未实名",
            type: "error"
          });
        }
      });
    },
    handeladdfede() {
      const data = this.fedetemp;
      data.user_id = this.rede_id;
      data.c_id = this.c_id;
      SetRedfeByAdd(data).then(res => {
        this.$message({
          message: "奖励已发放",
          type: "success"
        });
        this.dialogFormVfede = false;
      });
    },
    handeladdawarded() {
      PostAwardedByData(this.awarded).then(response => {
        console.log(response);
      });
      this.dialogFormVisible = false;
      this.$message({
        message: "分配",
        type: "success"
      });
      // console.log(this.awarded)
    },
    //分配
    handelawarded(row) {
      row.awarded = 1;
      this.awarded = row;
      this.dialogFormVisible = true;
    },
    // 修改
    handleAuth(row) {
      console.log(row);
      this.temp = Object.assign({}, row); // copy obj
      this.fileList3[0].url = this.image_prefix + this.temp.images;
      this.fileList3[0].name = "123";

      // this.dialogStatus = 'update'
      this.dialogFormAuth = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleopen(val) {
      this.diaimg = val;
      this.dialogVisible = true;
      console.log(this.diaimg);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    getList() {
      this.listLoading = true;
      UserList(this.listQuery).then(response => {
        this.list = response.data.data.data;
        this.total = response.data.data.total;
        console.log(response.data.data.total);
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
    handeltype(row, type) {
      row.type = type;
      this.dtype.id = row.id;
      this.dtype.type = type;
      SetByType(this.dtype).then(response => {
        console.log(response);
      });
    },
    // 修改审核状态
    handleModifyStatus(row, status) {
      this.sdata.status = status;
      this.sdata.id = row.id;
      this.sdata.user_id = row.user_id;
      statusUser(this.sdata).then(response => {
        console.log(response);
      });
      this.$message({
        message: "操作成功",
        type: "success"
      });

      row.status = status;
      // console.log(row.status)
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: ""
      };
    },

    handleCreate(row) {
      this.utemp = row;

      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleRefused(row) {
      this.dialogFormRefused = true;
      this.utemp = row;
      row.status = 4;
    },
    dialogClick(row) {
      console.log(row);
    },
    createData() {
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
    // 修改
    handleUpdate(row, status) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.status = status;
      this.dialogContent = true;
      row.status = status;
    },
    updateData(row) {
      const tempData = Object.assign({}, this.utemp);
      tempData.status = 4;
      tempData.content = this.temp.content;
      console.log(tempData);
      statusUser(tempData).then(response => {
        console.log(response);
        this.$message({
          message: "操作成功",
          type: "success"
        });
        this.dialogFormRefused = false;
      });
    },
    updateinfoData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          //  tempData.images_url=this.image_prefix+ tempData.images_card
          tempData.audit = 1;
          console.log(tempData);
          setUserbyUpdate(tempData).then(res => {
            console.log(res);
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.temp.audit = 1;
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
          });
          this.dialogFormAuth = false;
          this.$notify({
            title: "成功",
            message: "更新成功",
            type: "success",
            duration: 2000
          });
        }
      });
    },
    handleDelete(row) {
      this.$notify({
        title: "成功",
        message: "删除成功",
        type: "success",
        duration: 2000
      });
      const index = this.list.indexOf(row);
      this.list.splice(index, 1);
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["timestamp", "title", "type", "importance", "status"];
        const filterVal = [
          "timestamp",
          "title",
          "type",
          "importance",
          "status"
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
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
