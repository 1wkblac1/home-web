const columnRouter = {
  route: null,
  name: null,
  title: '分类管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-column',
  filePath: 'view/column/', // 文件路径
  inNav: true,
  children: [
    {
      title: '分类列表',
      type: 'view',
      name: 'columnCreate',
      route: '/column/list',
      filePath: 'view/column/column-list.vue',
      inNav: true,
    },
    {
      title: '添加分类',
      type: 'view',
      name: 'columnCreate',
      route: '/column/add',
      filePath: 'view/column/column-create.vue',
      inNav: true,
    },
    {
      title: '修改分类',
      type: 'view',
      name: 'columnModify',
      route: '/column/modify',
      filePath: 'view/column/column-modify.vue',
      inNav: false,
    },
  ],
}

export default columnRouter
