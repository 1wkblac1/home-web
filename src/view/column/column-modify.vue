<template>
  <div class="container">
    <div class="title">
      <span>修改分类</span> <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
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
import Column from '@/model/column'
import edit from '@/component/base/service/edit'

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
          type: 'input',
          prop: 'name',
          label: '栏目名称',
          placeholder: '请输入栏目名称',
        },
        {
          type: 'input:sort',
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
            required: true,
            type: 'number',
            trigger: ['blur', 'change'],
            max: 9999,
            message: '数值在 0 到 9999 之间',
          },
        ],
      },
    }
  },
  async mounted() {
    try {
      this.loading = true
      const res = await Column.columnDetail({ id: this.editID })
      this.form = res.result
      this.loading = false
    } catch (error) {
      console.log(error)
      this.loading = false
    }
  },
  watch: {
    form() {
      this.formFlag = true
    },
  },
  methods: {
    async submitForm() {
      try {
        this.loading = true
        const res = await Column.columnModify(this.form)
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
        path: '/column/list',
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
