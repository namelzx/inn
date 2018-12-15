<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky :className="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">草稿</el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
  <el-form-item style="margin-bottom: 40px;" prop="title">
         <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                标题
              </MDinput>

              <el-form-item label="描述">
              <el-input type="textarea" v-model="postForm.desc"></el-input>
            </el-form-item>
  </el-form-item>

   <div class="postInfo-container">
      <el-row>
           <el-col :span="8">
                  <el-form-item label-width="45px" label="作者:" class="postInfo-container-item">
                    <el-input v-model="postForm.author" placeholder="请输入文章作者"></el-input>

                  </el-form-item>
                </el-col>
                <el-col :span="8">
                   <el-form-item label-width="100px" label="类型:" class="postInfo-container-item">
                   <el-select v-model="postForm.type" placeholder="文章类型">
                          <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.articels_name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                   </el-form-item>
                </el-col>
                   <el-col :span="8">
                   <el-form-item label-width="100px" label="文章标示:" class="postInfo-container-item">
                   <el-select v-model="postForm.isShow" placeholder="默认正常">
                          <el-option
                            v-for="item in isshow"
                            :key="item.id"
                            :label="item.articels_name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                   </el-form-item>
                </el-col>

      </el-row>
   </div>
    <el-form-item label="logo">
              <Upload :imageUrl="postForm.images_url" v-model="postForm.images_url">
              </Upload>
    </el-form-item>
        </el-row>

        <div class="editor-container">
          <UE :defaultMsg="defaultMsg" :config=config ref="ue"></UE>
          <!-- <Tinymce :height=400 ref="editor"  v-model="postForm.content" /> -->
        </div>
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
import { fetchArticle,Articlecreate } from '@/api/article'
import {fetchList,ConfigTask} from '@/api/articleconfig'
import { userSearch } from '@/api/remoteSearch'
import Warning from './Warning'
import UE from "@/components/ue";
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  author:'',
  id: undefined,
  platforms: ['a-platform'],
  isShow:undefined,
  type:undefined,
  task_type:undefined,
  images_url:'',
  desc:'',

}

export default {
  name: 'articleDetail',
  components: { UE,Tinymce, MDinput, Upload, Multiselect, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
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
      const validateURL = (rule, value, callback) => {
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
       form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
         options: [{
          id: '3',
          articels_name: '教程'
        },{
          id: '1',
          articels_name: '诚信公告'
        },{
          id: '2',
          articels_name: '日常文章'
        }],
           isshow: [{
          id: '0',
          articels_name: '商户'
        },{
          id: '1',
          articels_name: '酒店'
        },{
          id: '2',
          articels_name: '旅游'
        }],
          module: [],
         value: '',
      rules: {
        images_url: [{ validator: validateURL }],
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

    this.Tasktype();
    // console.log(postForm.images_url);
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {

  this.$refs.ue.serUEContent(response.data.content);
        this.postForm = response.data
        // Just for test
      }).catch(err => {
        console.log(err)
      })
    },

      Tasktype(){
      ConfigTask().then(response=>{
        this.module = response.data.data
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
            console.log(this.postForm.desc.length);

             if (this.postForm.content.length === 0 || this.postForm.title.length === 0||this.postForm.desc.length<10||this.postForm.desc.length>100) {
        this.$message({
          message: '请填写必要的标题和内容、描述',
          type: 'warning'
        })
        return
           }
         this.loading = true
            this.postForm.content=this.$refs.ue.getUEContent();
         Articlecreate(this.postForm).then(response => {
          console.log(response);

           if(response.data.status==1){
                this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
            })
              this.$router.push({ path: '/' })
           }else{
                 this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
            })
                this.$router.push({ path: '/' })
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
