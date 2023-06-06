/* eslint-disable class-methods-use-this */
import { get, post, put, _delete } from '@/lin/plugin/axios'

class Column {
  // 列表
  async columns(params) {
    const res = await get('home/columns', params)
    return res
  }

  // 新增
  async columnAdd(params) {
    const res = post('home/columnAdd', params)
    return res
  }

  // 详情
  async columnDetail(params) {
    const res = await get('home/columnDetail', params)
    return res
  }

  // 修改
  async columnModify(params) {
    const res = await put('home/columnModify', params)
    return res
  }

  // 详情
  async columnDelete(params) {
    const res = await _delete('home/columnDelete', params)
    return res
  }
}

export default new Column()
