import { post } from '@/lin/plugin/axios'

class File {
  // 文件上传
  async upload(params) {
    const res = post('home/upload', params)
    return res
  }
}

export default new File()
