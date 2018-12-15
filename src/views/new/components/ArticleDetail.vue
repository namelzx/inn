<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <el-form-item style="margin-bottom: 40px;">
              <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                标题
              </MDinput>
            </el-form-item>

            <el-form-item>
                 <el-col :span="8">
                 <el-form-item label="企业名称:" label-width="100px" >
                      <el-input v-model="postForm.qyname"></el-input>

              </el-form-item>
               </el-col>
                <el-col :span="8">
              <el-form-item label="地址:" label-width="100px" >
                      <el-input v-model="postForm.area"></el-input>
              </el-form-item>
              </el-col>

                 <el-col :span="8">
                 <el-form-item label="联系电话:" label-width="100px" >
                      <el-input v-model="postForm.tel"></el-input>

              </el-form-item>
               </el-col>

            </el-form-item>
            <el-form-item>
                 <el-col :span="8">
                 <el-form-item label="标签:" label-width="100px" >
                         <el-select v-model="postForm.label" placeholder="请选择">
                          <el-option
                            v-for="item in op"
                            :key="item.id"
                            :label="item.title"
                            :value="item.title">
                          </el-option>
                        </el-select>
              </el-form-item>
                </el-col>

                  <el-col :span="8">
                 <el-form-item label="开始时间:" label-width="100px" >
                    <el-date-picker
                        v-model="postForm.start_time"
                        type="date"
                        placeholder="选择日期">
                      </el-date-picker>
              </el-form-item>
                </el-col>
                      <el-col :span="8">
                 <el-form-item label="结束时间:" label-width="100px" >
                    <el-date-picker
                        v-model="postForm.end_time"
                        type="date"
                        placeholder="选择日期">
                      </el-date-picker>
              </el-form-item>
                </el-col>

              </el-form-item>

                   <el-form-item>

   <el-col :span="8">
                 <el-form-item label="价格:" label-width="100px" >
                      <el-input v-model="postForm.price"></el-input>
              </el-form-item>
               </el-col>
                  <el-col :span="8">

                 <el-form-item label="排序:" label-width="100px" >
                  <el-input v-model="postForm.sort" placeholder="输入数字 越小越在前"></el-input>
              </el-form-item>

                </el-col>

                   <el-col :span="8">


              <el-form-item label="" label-width="100px" >
                    <el-switch
                      v-model="postForm.top"
                      active-text="置顶"
                      inactive-text="不置顶">
                    </el-switch>
              </el-form-item>
               </el-col>

              </el-form-item>

                  <el-form-item label="套图:" label-width="100px" >

                  <el-upload
                    class="upload-demo"
                    action="https://new.10huisp.com/api/images/upload/"
                    :on-remove="handleRemove"
                    :file-list="fileList2"
                    :on-success="handlesuccess"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
              </el-form-item>
            <div class="postInfo-container">

              <el-form-item label="logo:" v-model="postForm.images" label-width="100px" >
              <Upload v-model="postForm.images" v-if="postForm.images" :imageUrl="postForm.images"/>
               <Upload v-else v-model="postForm.images" />
              </el-form-item>

    <el-form-item label="描述:" v-model="postForm.images" label-width="100px" >

                 <el-input
  type="textarea"
  :rows="2"
  placeholder="请输入描述"
  v-model="postForm.desc">
</el-input>
              </el-form-item>
                <!-- <el-form-item label="详细:" v-model="postForm.images" label-width="100px" >
                  <div class="editor-container">

                  <Tinymce :height=400 ref="editor" v-model="postForm.describe" />
                </div>
              </el-form-item> -->

    <div class="desc-lef">
     <div class="tecxt">详细内容:</div>
    <!-- <button @click="getUEContent()">获取内容</button>  -->
    <div class="editor-container">
      <UE :defaultMsg="defaultMsg" :config=config ref="ue"></UE>
    </div>
  </div>
            </div>
          </el-col>
        </el-row>
      </div>


    </el-form>
  </div>
</template>
<script>
import Tinymce from "@/components/Tinymce";
import UE from "@/components/ue";
import Upload from "@/components/Upload/singleLogin";
import MDinput from "@/components/MDinput";
import Multiselect from "vue-multiselect"; // 使用的一个多选框组件，element-ui的select不能满足所有需求
import "vue-multiselect/dist/vue-multiselect.min.css"; // 多选框组件css
import Sticky from "@/components/Sticky"; // 粘性header组件
import { validateURL } from "@/utils/validate";
import { PostByData, detail, label,getImages } from "@/api/news";
import { userSearch } from "@/api/remoteSearch";
import Warning from "./Warning";
import {
  CommentDropdown,
  PlatformDropdown,
  SourceUrlDropdown
} from "./Dropdown";

const defaultForm = {
  id: undefined,
  title: "", //课程名称
  images: "", //logo
  describe: "", //描述
  area: "",
  label: "",
  price: ""
};

export default {
  name: "articleDetail",
  components: {
    UE,
    Tinymce,
    MDinput,
    Upload,
    Multiselect,
    Sticky,
    Warning,
    CommentDropdown,
    PlatformDropdown,
    SourceUrlDropdown
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "为必传项",
          type: "error"
        });
        callback(null);
      } else {
        callback();
      }
    };
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validateURL(value)) {
          callback();
        } else {
          this.$message({
            message: "外链url填写不正确",
            type: "error"
          });
          callback(null);
        }
      } else {
        callback();
      }
    };
    return {
      defaultMsg: '输入详细信息',
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 350
        },
      postForm: Object.assign({}, defaultForm),
      loading: false,
      dialogVisible: false,
      userListOptions: [],
      image_prefix: process.env.IMAGE_PREFIX,

      fileList2: [
      ],

      options: [
        {
          value: "0",
          label: "普通文章"
        },
        {
          value: "1",
          label: "热点文章"
        }
      ],
      op: [],
      value: "",
      rules: {
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: "blur" }]
      }
    };
  },

  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id);

    } else {
      this.postForm = Object.assign({}, defaultForm);
    }
    this.getdata();
  },
  methods: {
         getUEContent() {
        let content = this.$refs.ue.getUEContent();
      },
    handlesuccess(file,fileList){
      this.fileList2.push({'name':fileList.name,'url':file.path})
    },
      handlePreview(file) {
      },
    getdata() {
    var that=this;
      label().then(response => {
        this.op = response.data;
      });
    },
    fetchData(id) {
      getImages(id).then(response=>{
          for(var i=0;i<response.data.length;i++){
            this.fileList2.push(response.data[i])
          }
      })
      detail(id)
        .then(response => {
          // console.log(response.data.describe)
  this.$refs.ue.serUEContent(response.data.describe);
          this.postForm = response.data;



        })
        .catch(err => {

        });
    },
    handleRemove(file, fileList) {
      for(var i=0;i<this.fileList2.length;i++){
          if(file.id==this.fileList2[i].id){

            this.fileList2.splice(i)
          }
      }
    },
    uploadSuccess(response, file, fileList) {
      this.addForm.img = response.data[0];
      this.editForm.img = response.data[0];
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.postForm.imageslist=this.fileList2
          if(this.postForm.title.length>19){
 this.$message.error('标题不能超过20个字');
               this.loading = false;
              return false;

          }else{

               this.postForm.describe=this.$refs.ue.getUEContent();
          PostByData(this.postForm).then(response => {
            if (response.data.status == 200) {
              this.$notify({
                title: "成功",
                message: "添加成功",
                type: "success",
                duration: 2000
              });
            } else {
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                duration: 2000
              });
            }
            this.loading = false;
          });
          }


          this.loading = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    draftForm() {
      if (
        this.postForm.content.length === 0 ||
        this.postForm.title.length === 0
      ) {
        this.$message({
          message: "请填写必要的标题和内容",
          type: "warning"
        });
        return;
      }
      this.$message({
        message: "保存成功",
        type: "success",
        showClose: true,
        duration: 1000
      });
      this.postForm.status = "draft";
    },
    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) return;
        this.userListOptions = response.data.items.map(v => v.name);
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.desc-lef .tecxt{
  font-size: 14px;
    color: #606266;
    font-weight: bold;
        margin-bottom: 10px;
  // padding-left: 90px;
}
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
