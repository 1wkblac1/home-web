<template>
  <div>
    <el-table
      ref="list"
      v-loading="loading"
      :data="data"
      :border="border"
      :highlight-current-row="!!highlightCurrentRow"
      :cell-style="cellStyle"
      :header-cell-style="headerCellStyle"
    >
      <template v-for="(item, index) in titleData">
        <!--        默认展示-->
        <template v-if="item.type === 'column'">
          <el-table-column :label="item.label" :prop="item.prop" :key="index"></el-table-column>
        </template>

        <!--        switch效果-->
        <template v-if="item.type === 'switch'">
          <el-table-column :label="item.label" :key="index">
            <template slot-scope="scope">
              <el-switch
                :key="index"
                v-model="scope.row[item.prop]"
                @click.native.prevent.stop="buttonMethods(item.func, scope.$index, scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
        </template>

        <!--        input:数字效果-->
        <template v-if="item.type === 'input:number'">
          <el-table-column :label="item.label" :key="index">
            <template slot-scope="scope">
              <el-input
                :class="item.prop"
                type="number"
                v-model="scope.row[item.prop]"
                @blur="buttonMethods(item.func, scope.$index, scope.row)"
              ></el-input>
            </template>
          </el-table-column>
        </template>

        <!--        图片效果-->
        <template v-if="item.type === 'image'">
          <el-table-column :label="item.label" :key="index">
            <template slot-scope="scope">
              <el-image :src="scope.row[item.prop]" :fit="fit" :preview-src-list="scope.row.images"></el-image>
            </template>
          </el-table-column>
        </template>
      </template>

      <!--        操作栏-->
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-for="(item, index) in operationData"
            :type="item.type"
            plain
            :key="index"
            size="mini"
            @click.native.prevent.stop="buttonMethods(item.func, scope.$index, scope.row)"
            >{{ item.name }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--    分页-->
    <el-pagination
      class="pagination"
      v-if="paginationData"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paginationData.currentPage"
      :page-sizes="pageSizes"
      :page-size="paginationData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="paginationData.total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    titleData: {
      type: Array,
      default: () => [],
    },
    operationData: {
      type: Array,
      default: () => [],
    },
    paginationData: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
    highlightCurrentRow: {
      type: Boolean,
      default: true,
    },
    cellStyle: {
      type: Object,
      default: () => ({
        'text-align': 'center',
      }),
    },
    headerCellStyle: {
      type: Object,
      default: () => ({
        'text-align': 'center',
      }),
    },
  },
  data() {
    return {
      pageSizes: [15, 30, 50, 100],
      fit: 'scale-down',
    }
  },
  methods: {
    // 自定义方法
    buttonMethods(func, index, row) {
      const _this = this
      const { methods } = this.$options
      methods[func](_this, index, row)
    },
    // 页面编辑
    handleEditInfo(_this, index, row) {
      _this.$emit('handleEditInfo', { index, row })
    },
    // 编辑
    handleEdit(_this, index, row) {
      _this.$emit('handleEdit', { index, row })
    },
    // 删除
    handleDelete(_this, index, row) {
      _this.$emit('handleDelete', { index, row })
    },
    handleCurrentChange(val) {
      this.paginationData.currentPage = val
      this.$emit('handleCurrentChange', val)
    },
    handleSizeChange(val) {
      this.paginationData.pageSize = val
      this.$emit('handleSizeChange', val)
    },
  },
}
</script>

<style scoped>
.el-image {
  width: 120px;
  height: 120px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-right: -10px;
  margin-top: 15px;
}
/deep/ .el-table--striped .el-table__body tr {
  background-color: white;
}
.sort {
  width: 100px;
}
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
</style>
