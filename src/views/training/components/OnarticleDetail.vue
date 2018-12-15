<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status">
  <el-checkbox v-model="postForm.isshow">是否首页推荐</el-checkbox>
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>

        <el-button v-loading="loading" type="warning" @click="draftForm">草稿</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>


          <el-col :span="21">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput name="name" v-model="postForm.training_name" required :maxlength="100">
                课程名称
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">


                <el-row  :gutter="20">
                <el-col :span="8">
                  <el-form-item label-width="100px" label="老师:" >

                    <el-input v-model="postForm.teacher" placeholder="讲课老师名称"></el-input>

                  </el-form-item>
                </el-col>
                 <el-col :span="8">
                  <el-form-item label-width="100px" label="经验:" class="postInfo-container-item">

                    <el-input v-model="postForm.exp" placeholder="经验值"></el-input>

                  </el-form-item>
                 </el-col>
                  <el-col :span="8">
                      <el-form-item label-width="100px" label="价格:" class="postInfo-container-item">

                    <el-input v-model="postForm.price" placeholder="不输入即免费"></el-input>

                  </el-form-item>
                  </el-col>
                      <el-col :span="20">
                      <el-form-item label-width="100px" label="链接:" class="postInfo-container-item">
                    <el-input v-model="postForm.url" placeholder=" "></el-input>

                  </el-form-item>
                  </el-col>


              </el-row>

               <el-row>
                <el-col :span="8">
                  <el-form-item label-width="100px" label="报名开始时间:" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.apply_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="100px" label="报名结束时间:" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.deadline" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="100px" label="课程开始时间:" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.start_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="logo:" v-model="postForm.logo" label-width="100px" >
              <Upload v-model="postForm.logo" v-if="postForm.logo" :imageUrl="postForm.logo"/>
               <Upload v-else v-model="postForm.logo" />
              </el-form-item>


           <!-- <el-form-item label="视频地址:"  label-width="100px" >
              <el-upload
              class="upload-demo"
              action="https://new.10huisp.com/api/images/training"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
              </el-form-item> -->


                <!-- <el-form-item label="描述:" v-model="postForm.logo" label-width="100px" >
                  <div class="editor-container">
                  <Tinymce :height=400 ref="editor" v-model="postForm.describe" />
                </div>
              </el-form-item> -->
                    <div class="editor-container">
                   <UE :defaultMsg="defaultMsg" :config=config ref="ue"></UE>
                  <!-- <Tinymce :height=400 ref="editor" v-model="postForm.describe" /> -->
                </div>

            </div>
          </el-col>
        </el-row>

      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleLogin'
import Video from '@/components/Upload/rglogo'
import MDinput from '@/components/MDinput'
import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { detailTraining,createTraining } from '@/api/training'
import { userSearch } from '@/api/remoteSearch'
import Warning from './Warning'
import UE from "@/components/ue";
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  id: undefined,
  training_name:'',//课程名称
  apply_time: undefined, // 报名时间
  deadline:undefined,//课程截止时间
  start_time:undefined,//课程开始时间
  describe:'',//描述
  logo:'',//logo
  type:2,
  willnum:'',//报名人数
  url:'',
  exp:'',//可获得经验
  sales: 0,
  present_price: 0,
  original_price:0,
  isshow:false,
}

export default {
  name: 'OnarticleDetail',
  components: {UE, Video, Tinymce, MDinput, Upload, Multiselect, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(null)
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validateURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(null)
        }
      } else {
        callback()
      }
    }
    return {
          defaultMsg: '输入详细内容',
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 350
        },
      postForm: Object.assign({}, defaultForm),
      loading: false,
      dialogVisible: false,
      userListOptions: [],

        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      image_prefix:process.env.IMAGE_PREFIX,
         options: [{
          value: '0',
          label: '普通文章'
        }, {
          value: '1',
          label: '热点文章'
        }],
         value: '',
      rules: {

        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      }
    }
  },

  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  methods: {
    fetchData(id) {
      detailTraining(id).then(response => {
          this.$refs.ue.serUEContent(response.data.describe);
        this.postForm = response.data
        // Just for test
      }).catch(err => {
        console.log(err)
      })
    },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
         handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      uploadSuccess (response, file, fileList) {
        this.addForm.img=response.data[0];
        this.editForm.img=response.data[0];
      },
      handlePictureCardPreview(file) {
        this.dialogVisible = true;
      },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
         this.loading = true
          this.postForm.describe=this.$refs.ue.getUEContent();
         createTraining(this.postForm).then(response => {

           if(response.data.status==1){
                this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
            })
          this.$router.push({ path: '/training/index' })
           }else{
                 this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
            })
               this.$router.push({ path: '/training/index' })
           }
          })
           this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
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
