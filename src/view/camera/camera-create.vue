<template>
  <div class="container">
    <div class="title">添加动态</div>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <add
            v-if="columnDataLoading"
            :params="params"
            :form="form"
            :rules="rules"
            :loading="loading"
            :resetFlag.sync="resetFlag"
            @submitForm="submitForm"
          ></add>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Camera from '@/model/camera'
import Column from '@/model/column'
import add from '@/component/base/service/add'

export default {
  data() {
    return {
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
      form: {
        column_id: '',
        title: '',
        sub_title: '',
        files: [],
        type: 1,
        sort: 0,
        describe: '',
        status: true,
      },
      loading: false,
      columnData: [],
      columnDataLoading: false,
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
      resetFlag: false,
    }
  },
  components: {
    add,
  },
  created() {
    this.getColumns()
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
        const res = await Camera.cameraAdd(this.form)
        this.$message.success(`${res.message}`)
        this.resetFlag = true
        this.loading = false
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
