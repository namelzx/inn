<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>可用通知列表</span>
        </div>
        <div style="margin-bottom:50px;">
          <el-col :span="4" class="text-center">
            <span class="pan-btn blue-btn" @click="show"> 通知</span>

          </el-col>
          <!-- <el-col :span="4" class="text-center">
            <router-link class="pan-btn light-blue-btn" to="/charts/index">Charts</router-link>
          </el-col>
          <el-col :span="4" class="text-center">
            <router-link class="pan-btn pink-btn" to="/excel/download">Excel</router-link>
          </el-col>
          <el-col :span="4" class="text-center">
            <router-link class="pan-btn green-btn" to="/example/table/complex-table">Table</router-link>
          </el-col>
          <el-col :span="4" class="text-center">
            <router-link class="pan-btn tiffany-btn" to="/form/edit-form">Form</router-link>
          </el-col>
          <el-col :span="4" class="text-center">
            <router-link class="pan-btn yellow-btn" to="/theme/index">Theme</router-link>
          </el-col> -->
        </div>
      </el-card>
    </el-row>
<el-dialog title="填写内容" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>

        <el-form-item label="标题" prop="icon">
            <el-input placeholder="请输入标题" v-model="temp.title" clearable>
            </el-input>
        </el-form-item>
        <el-form-item label="内容" prop="icon">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="temp.content">
            </el-input>
        </el-form-item>


    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendData">确定</el-button>
    </div>
</el-dialog>
  </div>
</template>

<script>
import {posttemplate} from "@/api/template";
import PanThumb from '@/components/PanThumb'
import MdInput from '@/components/MDinput'
import Mallki from '@/components/TextHoverEffect/Mallki'
import DropdownMenu from '@/components/Share/dropdownMenu'
import waves from '@/directive/waves/index.js' // 水波纹指令


export default {
  name: 'componentMixin-demo',

  directives: {
    waves
  },

  data() {
    const validate = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('请输入六个字符'))
      } else {
        callback()
      }
    }
      return {
      dialogFormVisible: false,
      temp: {
        content: "",
        title: ""
      }
    };
  },
  methods: {
    show() {
      this.dialogFormVisible = true;
    },
    sendData() {
       console.log(11)
       this.$message({
            message: '已发送给用户',
            type: 'success'
          })
            this.dialogFormVisible = false;
     posttemplate(this.temp).then(response=>{



     })
    }
  }
}
</script>

