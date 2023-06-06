/* eslint-disable class-methods-use-this */
import { get, post, put, _delete } from '@/lin/plugin/axios'

class Camera {
  // 列表
  async cameras(params) {
    const res = await get('home/cameras', params)
    return res
  }

  // 新增
  async cameraAdd(params) {
    const res = post('home/cameraAdd', params)
    return res
  }

  // 详情
  async cameraDetail(params) {
    const res = await get('home/cameraDetail', params)
    return res
  }

  // 修改
  async cameraModify(params) {
    const res = await put('home/cameraModify', params)
    return res
  }

  // 列表修改
  async cameraListModify(params) {
    const res = await put('home/cameraListModify', params)
    return res
  }

  // 详情
  async cameraDelete(params) {
    const res = await _delete('home/cameraDelete', params)
    return res
  }
}

export default new Camera()
