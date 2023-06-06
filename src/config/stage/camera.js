const cameraRouter = {
  route: null,
  name: null,
  title: '动态管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-camera',
  filePath: 'view/camera/', // 文件路径
  inNav: true,
  children: [
    {
      title: '动态列表',
      type: 'view',
      name: 'cameraCreate',
      route: '/camera/list',
      filePath: 'view/camera/camera-list.vue',
      inNav: true,
    },
    {
      title: '添加动态',
      type: 'view',
      name: 'cameraCreate',
      route: '/camera/add',
      filePath: 'view/camera/camera-create.vue',
      inNav: true,
    },
    {
      title: '修改动态',
      type: 'view',
      name: 'cameraModify',
      route: '/camera/modify',
      filePath: 'view/camera/camera-modify.vue',
      inNav: false,
    },
  ],
}

export default cameraRouter
