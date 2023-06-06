<template>
  <div class="container">
    <div class="title">添加分类</div>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <add
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
import Column from '@/model/column'
import add from '@/component/base/service/add'

export default {
  data() {
    return {
      params: [
        {
          type: 'input',
          prop: 'name',
          label: '栏目名称',
          placeholder: '请输入栏目名称',
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
          label: '状态',
          placeholder: '',
        },
      ],
      rules: {
        name: [
          {
            trigger: ['blur', 'change'],
            required: true,
            message: '请填写栏目名称',
          },
          {
            trigger: ['blur', 'change'],
            min: 2,
            max: 4,
            message: '长度在 2 到 4 个字符',
          },
        ],
        sort: [
          {
            type: 'number',
            trigger: ['blur', 'change'],
            max: 9999,
            message: '数值在 0 到 9999 之间',
          },
        ],
      },
      form: {
        name: '',
        status: true,
        sort: 0,
        target_type: 1, // 照片分类
      },
      loading: false,
      resetFlag: false,
    }
  },
  components: {
    add,
  },
  methods: {
    async submitForm() {
      try {
        this.loading = true
        const res = await Column.columnAdd(this.form)
        this.$message.success(`${res.message}`)
        this.resetFlag = true
        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false
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
