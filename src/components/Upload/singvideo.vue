<template>
 <div>
 <el-upload
  class="upload-demo"
  action="https://new.10huisp.com/api/images/upload"
  :on-preview="handlePreview"
  :on-progress="beforeUploadVideo"
  :on-remove="handleRemove"
  :before-remove="beforeRemove"
  multiple
  :limit="3"
  :on-exceed="handleExceed"
  :file-list="fileList"
 >
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
<!-- <el-upload
  class="avatar-uploader"
 >

  <video v-if="imageUrl" :src="imageUrl" class="avatar">您的浏览器不支持 video 标签。</video>
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>

</el-upload> -->
<el-progress v-if="videoFlag == true" type="circle" :percentage="videoUploadPercent" style="margin-top:30px;"></el-progress>

</div>

</template>

<script>
import { getToken } from '@/api/qiniu'

export default {
  name: 'singvideo',
  props: {
    fileList: Array
  },
  computed: {
    imageUrl() {
      return this.fileList
    }
  },
  data() {
    return {
      image_prefix:process.env.IMAGE_PREFIX,
      tempUrl: '',
      dataObj: { token: '', key: '' },
      videoFlag:false,
       loading: false,
      //  fileList: []
    }
  },
  methods: {

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
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleVideoSuccess(file) {

      this.fileList[0].url=this.image_prefix+file.path
       this.fileList[0].name='123'
      this.emitInput(this.image_prefix+file.path)
        this.loading=false;
    },
    beforeUpload() {
      const _self = this
      return new Promise((resolve, reject) => {

        getToken().then(response => {
          console.log(response);
          const key = response.data.qiniu_key
          const token = response.data.qiniu_token
          _self._data.dataObj.token = token
          _self._data.dataObj.key = key
          this.tempUrl = response.data.qiniu_url
           this.loading=false
          resolve(true)
        }).catch(() => {
          reject(false)
        })
      })
    },
    beforeUploadVideo(file) {
      this.loading=true;


},
uploadVideoProcess(event, file, fileList){
  this.loading=true;
    this.videoFlag = true;
    this.videoUploadPercent = file.percentage.toFixed(0);
},
    }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
