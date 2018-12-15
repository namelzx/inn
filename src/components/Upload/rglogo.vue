<template>
  <el-upload
  class="avatar-uploader el-upload--picture-card"
  action="https://new.10huisp.com/api/images/training"
  :show-file-list="false"
  :on-success="handleAvatarSuccess"
 >
  <img v-if="imageUrl" :src="imageUrl" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
</template>
<script>

export default {
  name: 'singlogo',
  props: {
    value: String
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  data() {
    return {
      image_prefix:process.env.IMAGE_PREFIX,
      tempUrl: '',
      dataObj: { token: '', key: '' },
      videoFlag:false,
       loading: false,
      fileList: []


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
    handleAvatarSuccess(file) {
    //   this.fileList[0].url=this.image_prefix+file.path
    //    this.fileList[0].name='123'
    //    console.log(this.fileList);
      this.emitInput(file.path)
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
    const isLt10M = file.size / 1024 / 1024  < 10;
    // if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
    //     this.$message.error('请上传正确的视频格式');
    //     return false;
    // }
    // if (!isLt10M) {
    //     this.$message.error('上传视频大小不能超过10MB哦!');
    //     return false;
    // }

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
.el-upload--picture-card{
    width: 178px;
    height: 178px;
}
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
