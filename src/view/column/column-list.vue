<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <div class="title">栏目列表</div>
      </div>
      <!-- 表格 -->
      <list
        :loading="loading"
        :data="data"
        :title-data="titleData"
        :operation-data="operationData"
        :paginationData="paginationData"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        @handleEditInfo="handleEditInfo"
      ></list>
    </div>
  </div>
</template>

<script>
import Column from '@/model/column'
import List from '@/component/base/service/list'

export default {
  components: {
    List,
  },
  data() {
    return {
      data: [],
      titleData: [
        { prop: 'id', label: 'ID', type: 'column' },
        { prop: 'name', label: '分类', type: 'column' },
        { prop: 'status', label: '状态', type: 'switch', func: 'handleEditInfo' },
        { prop: 'sort', label: '排序', type: 'input:number', func: 'handleEditInfo' },
      ],
      operationData: [
        { name: '编辑', func: 'handleEdit', type: 'primary' },
        { name: '删除', func: 'handleDelete', type: 'danger' },
      ],
      paginationData: {
        pageSize: 15,
        total: 0,
        currentPage: 1,
      },

      showEdit: false,
      editID: 0,
      loading: false,

      // 查询参数
      params: {
        target_type: 1,
        page: 1,
        count: 15,
      },
    }
  },
  async created() {
    this.loading = true
    await this.getList()
    this.loading = false
  },
  methods: {
    handleCurrentChange(val) {
      this.params.page = val
      this.loading = true
      this.getList()
      this.loading = false
    },
    handleSizeChange(val) {
      this.params.count = val
      this.loading = true
      this.getList()
      this.loading = false
    },
    async getList() {
      try {
        const result = await Column.columns(this.params)
        this.data = result.result.data
        this.paginationData.total = result.result.total
      } catch (error) {
        console.log(error)
        this.tableData = []
      }
    },
    async handleEditInfo(val) {
      try {
        const res = await Column.columnModify(val.row)
        this.$message.success(`${res.message}`)
      } catch (error) {
        console.log(error)
      }
      await this.getList()
    },
    handleEdit(val) {
      this.$router.push({
        path: '/column/modify',
        query: {
          id: val.row.id,
        },
      })
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            this.loading = true
            const res = await Column.columnDelete({ id: val.row.id })
            await this.getList()
            this.$message({
              type: 'success',
              message: `${res.message}`,
            })
            this.loading = false
          } catch (error) {
            console.log(error)
            this.loading = false
          }
        })
        .catch(() => {
          this.$message.error('取消删除')
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;
  font-family: YYW01, serif;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
