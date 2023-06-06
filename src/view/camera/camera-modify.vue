<template>
  <div class="container">
    <div class="title">
      <span>修改动态</span> <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>
    <el-divider></el-divider>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <edit
            v-if="formFlag"
            :params="params"
            :form="form"
            :loading="loading"
            :rules="rules"
            @submitForm="submitForm"
          ></edit>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Camera from '@/model/camera'
import edit from '@/component/base/service/edit'
import Column from '@/model/column'

export default {
  components: {
    edit,
  },
  data() {
    return {
      loading: false,
      resetFlag: false,
      editID: this.$route.query.id,
      formFlag: false,
      form: {},
      params: [
        {
          type: 'select',
          prop: 'column_id',
          label: '选择分类',
          placeholder: '请选择要发布的分类',
          values: [],
        },
        {
          type: 'input',
          prop: 'title',
          label: '标题',
          placeholder: '填写标题会获得更多赞哦~',
        },
        {
          type: 'input',
          prop: 'sub_title',
          label: '副标题',
          placeholder: '用更加详细的语言概略',
        },
        {
          type: 'radio',
          prop: 'type',
          label: '发布类型',
          placeholder: '请选择要发布的类型',
          values: [
            {
              value: 1,
              text: '图文',
            },
            {
              value: 2,
              text: '视频',
            },
          ],
        },
        {
          type: 'imagesUpload',
          prop: 'files',
          label: '上传照片',
          placeholder: '请上传照片信息',
          values: {
            type: 1, // 上传类型
          },
          show: {
            prop: 'type',
            value: 1,
          }, // 绑定的radio值
        },
        {
          type: 'videoUpload',
          prop: 'files',
          label: '上传视频',
          placeholder: '请上传视频',
          values: {
            type: 2, // 上传类型
          },
          show: {
            prop: 'type',
            value: 2,
          }, // 绑定的radio值
        },
        {
          type: 'text',
          prop: 'describe',
          label: '添加正文',
          placeholder: '添加正文',
        },
        {
          type: 'input:number',
          prop: 'sort',
          label: '排序',
          placeholder: '请输入排序',
        },
        {
          type: 'switch',
          prop: 'status',
          label: '公开可见',
          placeholder: '',
        },
      ],
      rules: {
        column_id: [
          {
            trigger: ['submit'],
            required: true,
            message: '请选择栏目',
          },
        ],
        title: [
          {
            trigger: ['submit'],
            required: true,
            message: '请填写标题',
          },
        ],
        type: [
          {
            trigger: ['submit'],
            required: true,
            message: '请选择要发布的类型',
          },
        ],
        files: [
          {
            trigger: ['submit'],
            required: true,
            message: '请上传对应的照片/视频',
          },
        ],
      },
    }
  },
  watch: {
    form() {
      this.formFlag = true
    },
  },
  created() {
    this.getColumns()
  },
  async mounted() {
    try {
      this.loading = true
      const res = await Camera.cameraDetail({ id: this.editID })
      const { result } = res
      this.form = {
        id: result.id,
        column_id: result.column_id,
        sort: result.sort,
        type: result.type,
        describe: result.describe,
        title: result.title,
        sub_title: result.sub_title,
        status: result.status,
        files: result.files,
      }
      this.loading = false
    } catch (error) {
      console.log(error)
      this.loading = false
    }
  },
  methods: {
    // 分类信息
    async getColumns() {
      try {
        const result = await Column.columns({ target_type: 1 })
        this.params[0].values = result.result.data
        this.columnDataLoading = true
      } catch (error) {
        console.log(error)
        this.params[0].values = []
      }
    },
    async submitForm() {
      try {
        this.loading = true
        const res = await Camera.cameraModify(this.form)
        this.$message.success(`${res.message}`)
        this.back()
        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    back() {
      this.$router.push({
        path: '/camera/list',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 0;
}

.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
