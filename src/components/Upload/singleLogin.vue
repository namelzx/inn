<template>
  <el-upload
  class="avatar-uploader"
  action="https://new.10huisp.com/api/images/upload/"
  :show-file-list="false"
  :on-success="handleAvatarSuccess"


 >
  <img v-if="imageUrl" :src="imageUrl" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>

</template>
<script>

export default {
  name: 'singvideo',
  props: {
    imageUrl: String
  },
  data() {
    return {
      image_prefix:process.env.IMAGE_PREFIX,
      dataObj: { token: '', key: '' },
      videoFlag:false,
      loading: false,

      //  fileList: []
    }
  },
  created() {
    console.log(this.imageUrl);
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleAvatarprogress( file){
        console.log(1)
    },
    handleAvatarSuccess(res, file) {
       console.log(2)
 const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
          loading.close();

      this.emitInput(res.path)
    },
  beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg,image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    }

}
</script>

<style>
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

