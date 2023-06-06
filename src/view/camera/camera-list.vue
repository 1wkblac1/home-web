<template>
  <div>
    <el-container>
      <!-- 列表页面 -->
      <el-header :height="'80px'">
        <el-row :gutter="40">
          <el-col :span="4">
            <el-select v-model="params.column_id" clearable size="medium" placeholder="请选择分类搜索">
              <el-option v-for="item in columnData" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input size="medium" placeholder="请输入标题/副标题关键字搜索" v-model="params.keyword"> </el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="search()">
              搜索
            </el-button>
          </el-col>
        </el-row>
      </el-header>
      <!-- 表格 -->
      <el-main>
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
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Camera from '@/model/camera'
import List from '@/component/base/service/list'
import Column from '@/model/column'

export default {
  components: {
    List,
  },
  data() {
    return {
      data: [],
      titleData: [
        { prop: 'id', label: 'ID', type: 'column' },
        { prop: 'column_name', label: '分类', type: 'column' },
        { prop: 'title', label: '标题', type: 'column' },
        { prop: 'cover_path', label: '封面', type: 'image' },
        { prop: 'author', label: '作者', type: 'column' },
        { prop: 'views', label: '浏览数', type: 'column' },
        { prop: 'like_count', label: '点赞数', type: 'column' },
        { prop: 'status', label: '是否公开', type: 'switch', func: 'handleEditInfo' },
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
      currentDate: new Date(),

      // 查询参数
      params: {
        page: 1,
        count: 15,
        column_id: '',
        keyword: '',
      },

      columnData: {},
    }
  },
  async created() {
    this.loading = true
    await this.getColumns()
    await this.getList()
    this.loading = false
  },
  methods: {
    // 分类信息
    async getColumns() {
      try {
        const result = await Column.columns({ target_type: 1 })
        this.columnData = result.result.data
      } catch (error) {
        this.columnData = []
      }
    },
    search() {
      this.loading = true
      this.getList()
      this.loading = false
    },
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
        const result = await Camera.cameras(this.params)
        this.data = result.result.data
        this.paginationData.total = result.result.total
      } catch (error) {
        this.tableData = []
      }
    },
    async handleEditInfo(val) {
      try {
        const { row } = val
        const form = {
          id: row.id,
          sort: row.sort,
          status: row.status,
        }
        const res = await Camera.cameraListModify(form)
        this.$message.success(`${res.message}`)
      } catch (error) {
        console.log(error)
      }
      await this.getList()
    },
    handleEdit(val) {
      this.$router.push({
        path: '/camera/modify',
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
            const res = await Camera.cameraDelete({ id: val.row.id })
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
img {
  width: auto;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
.el-header {
  line-height: 80px;
  border-bottom: 1px solid #dae1ed;
}
.el-main {
  margin-top: 30px;
}
.el-select {
  width: 100%;
}
</style>
