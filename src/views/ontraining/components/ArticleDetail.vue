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
              <!-- <Upload v-model="postForm.logo" /> -->
            <Upload  v-model="postForm.logo" />

              </el-form-item>


               <el-form-item label="课程链接:" :v-model="postForm.fileList" label-width="100px" >

              </el-form-item>
                <el-form-item label="描述:" v-model="postForm.logo" label-width="100px" >
                  <div class="editor-container">
                <Tinymce :height=400 ref="editor" v-model="postForm.describe" />
              </div>

              </el-form-item>

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

import MDinput from '@/components/MDinput'
import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { detailTraining,createTraining } from '@/api/training'
import { userSearch } from '@/api/remoteSearch'
import Warning from './Warning'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
       id: undefined,
        training_name:'',//课程名称
        apply_time: undefined, // 报名时间
        deadline:undefined,//课程截止时间
        start_time:undefined,//课程开始时间
        code:0,//签到码
        describe:'',//描述
        logo:'',//logo
        willnum:'',//报名人数
        teacher:'',//讲课老师
        exp:'',//可获得经验
        fileList:[],
        type:2,
        isshow:false
}
export default {
  name: 'articleDetail',
  components: { Tinymce, MDinput, Upload, Multiselect, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
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
      postForm: Object.assign({}, defaultForm),
      loading: false,
      dialogVisible: false,
      userListOptions: [],
      fileList: [],
      image_prefix:process.env.IMAGE_PREFIX,
      options: [{
        value: '0',
        label: '普通文章'
      }, {
        value: '1',
        label: '热点文章'
      }
      ],
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

        this.postForm = response.data
        // Just for test

      }).catch(err => {
        console.log(err)
      })
    },
      handleRemove(file, fileList) {
        console.log(file, fileList);
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
        console.log(this.postForm);
        if (valid) {

         this.loading = true
        //  createTraining(this.postForm).then(response => {
        //    console.log(response);

        //    if(response.data.status==1){
        //         this.$notify({
        //     title: '成功',
        //     message: '添加成功',
        //     type: 'success',
        //     duration: 2000
        //     })
        //   this.$router.push({ path: '/training/index' })
        //    }else{
        //          this.$notify({
        //     title: '成功',
        //     message: '更新成功',
        //     type: 'success',
        //     duration: 2000
        //     })
        //        this.$router.push({ path: '/training/index' })
        //    }
        //   })
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
    },
    // 视频上传
       handleRemove(file, fileList) {
        // console.log(file,fileList);
      },
      handlePreview(fileList) {




      },
      handleExceed(files, fileList) {
        console.log(fileList);
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        console.log(fileList);
        return this.$confirm(`确定移除 ${ file.name }？`);
      }, beforeUploadVideo(file) {
      this.loading=true;
      },
      uploadVideoProcess(event, file, fileList){
        this.loading=true;
          this.videoFlag = true;
          this.videoUploadPercent = file.percentage.toFixed(0);
      },
      beforeAvatarUpload(file){
           console.log( file)
        const isLt10M = file.size / 1024 / 1024  < 500;
        if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
            this.$message.error('请上传正确的视频格式');
            return false;
        }
        if (!isLt10M) {
            this.$message.error('上传视频大小不能超过10MB哦!');
            return false;
        }
          this.postForm.fileList.push({'name':'/uploads/'+file.name,'video_name':file.name})
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
