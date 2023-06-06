<template>
  <div>
    <el-form v-if="params && form" :model="form" :rules="rules" status-icon ref="form" label-width="100px">
      <template v-for="(item, index) in params">
        <!--            普通输入框-->
        <template v-if="item.type === 'input'">
          <el-form-item :label="item.label" :prop="item.prop" :key="index">
            <el-input size="medium" v-model="form[item.prop]" :placeholder="item.placeholder"></el-input>
          </el-form-item>
        </template>

        <!--            数字输入框-->
        <template v-if="item.type === 'input:sort'">
          <el-form-item :label="item.label" :prop="item.prop" :key="index">
            <el-input size="medium" v-model.number="form[item.prop]" :placeholder="item.placeholder"></el-input>
          </el-form-item>
        </template>

        <!--            switch-->
        <template v-if="item.type === 'switch'">
          <el-form-item :label="item.label" :prop="item.prop" :key="index">
            <el-switch v-model="form[item.prop]"></el-switch>
          </el-form-item>
        </template>

        <!--            select-->
        <template v-if="item.type === 'select'">
          <el-form-item :label="item.label" :prop="item.prop" :key="index">
            <el-select v-model="form[item.prop]" size="medium" :placeholder="item.placeholder">
              <el-option
                v-for="(itemOp, keyOp) in item.values"
                :key="keyOp"
                :label="itemOp.name"
                :value="itemOp.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>

        <!--            radio-->
        <template v-if="item.type === 'radio'">
          <el-form-item :label="item.label" :prop="item.prop" :key="index">
            <el-radio
              v-model="form[item.prop]"
              v-for="(itemRa, keyRa) in item.values"
              :key="keyRa"
              size="medium"
              :label="itemRa.value"
              >{{ itemRa.text }}</el-radio
            >
          </el-form-item>
        </template>

        <!--            多图上传-->
        <template v-if="item.type === 'imagesUpload' && item.show.value === form[item.show.prop]">
          <el-form-item :label="item.label" :prop="item.prop" :key="index">
            <el-upload
              ref="asda"
              :action="uploadURL"
              :data="item.values"
              list-type="picture-card"
              :on-error="handleError"
              :file-list="fileList"
              :on-success="handleSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :limit="9"
              multiple
            >
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">最多可上传9张照片</div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-form-item>
        </template>

        <!--            视频-->
        <template v-if="item.type === 'videoUpload' && item.show.value === form[item.show.prop]">
          <el-form-item :label="item.label" :prop="item.prop" :key="index">
            <el-upload
              class="avatar-uploader"
              :action="uploadURL"
              :data="item.values"
              :on-error="handleError"
              :on-success="handleSuccess"
              :show-file-list="false"
            >
              <video class="video" v-if="videoUrl" :src="videoUrl" controls></video>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">最多可上传1个视频，推荐格式为MP4</div>
            </el-upload>
          </el-form-item>
        </template>

        <!--            富文本-->
        <template v-if="item.type === 'text'">
          <el-form-item :label="item.label" :prop="item.prop" :key="index">
            <tinymce ref="txt" :upload_url="uploadURL" :defaultContent="form[item.prop]" @textChange="textChange" />
          </el-form-item>
        </template>
      </template>

      <el-form-item class="submit">
        <el-button type="primary" @click="submitForm('form')" :loading="loading">保 存</el-button>
        <el-button @click="resetForm('form')">重 置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Config from '@/config'
import Tinymce from '@/component/base/tinymce'

export default {
  components: {
    Tinymce,
  },
  props: {
    form: {
      type: Object,
      default: () => {},
    },
    params: {
      type: Array,
      default: () => [],
    },
    rules: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      uploadURL: Config.uploadURL,
      videoUrl: '',
      fileList: [],
    }
  },
  mounted() {
    if (this.form.files) {
      if (this.form.type === 1) {
        this.fileList = this.form.files
      } else {
        this.videoUrl = this.form.files[0].url
      }
    }
  },
  methods: {
    // 富文本内容
    textChange(val) {
      this.form.describe = val
    },
    // 移除文件
    handleRemove(file) {
      this.form.files.forEach((item, index) => {
        // 删除已上传的
        if (file.uid) {
          if (item.filename === file.filename) {
            this.form.files.splice(index)
          }
        } else if (item.filename === file.response.result.filename) {
          this.form.files.splice(index)
        }
      })
    },
    // 上传成功
    handleSuccess(response, file, fileList) {
      if (response.result.type === '2') {
        // 视频上传成功
        this.videoUrl = response.result.url
      }
      this.form.files = []
      if (fileList) {
        for (let i = 0; i < fileList.length; i++) {
          if (!fileList[i].type) {
            this.form.files.push(fileList[i].response.result)
          } else {
            this.form.files.push(fileList[i])
          }
        }
      }
    },
    // 上传失败
    handleError(error) {
      let myError = error.toString()
      myError = myError.replace('Error: ', '')
      this.$message.error(JSON.parse(myError).message)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
    submitForm(formName) {
      // 验证
      console.log(this.$refs[formName].fields)
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.$emit('submitForm')
        } else {
          this.$message.error('请填写正确的信息')
        }
      })
    },
  },
}
</script>

<style scoped>
/deep/ table .el-input__inner {
  text-align: center;
}
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
/deep/ input[type='number'] {
  -moz-appearance: textfield;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 136px;
  text-align: center;
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  vertical-align: top;
}
.avatar {
  width: 148px;
  height: 148px;
  display: block;
}
.video {
  width: 148px;
}
</style>
