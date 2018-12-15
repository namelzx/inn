import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  },
  {
    path: '/order',
    component: Layout,
    redirect: 'order',
    name: 'ontraining',
    meta: {
      title: '订单管理',
      icon: 'training'
    },
    children: [
      { path: 'index', component: () => import('@/views/order/index'), name: 'orderindex', meta: { title: '订单列表', icon: 'edit' }}
      // { path: 'refund', component: () => import('@/views/order/refund'), name: 'orderrefund', meta: { title: '过期订单', icon: 'edit' }}
    ]
  },
  {
    path: '/area',
    component: Layout,
    redirect: '/area/index',
    children: [{
      path: 'area',
      component: () => import('@/views/area/index'),
      name: 'area',
      meta: { title: '服务区域', icon: 'area', noCache: true }
    }]
  },
  {
    path: '/banner',
    component: Layout,
    redirect: '/area/index',
    children: [{
      path: 'banner',
      component: () => import('@/views/banner/index'),
      name: 'banner',
      meta: { title: '广告位管理', icon: 'lbt', noCache: true }
    }]
  },
  {
    path: '/user',
    component: Layout,
    redirect: 'index',
    name: '用户管理',
    meta: {
      title: '用户管理',
      icon: 'peoples'
    },
    children: [
      { path: 'user_audit', component: () => import('@/views/user/user_audit'), name: 'user_audit', meta: { title: '用户审核', noCache: true }},
      { path: 'user_level', component: () => import('@/views/user/user_level'), name: 'user_level', meta: { title: '会员等级', noCache: true }},
      { path: 'user_list', component: () => import('@/views/user/user_list'), name: 'user_list', meta: { title: '用户列表', noCache: true }},
      { path: 'myawarde', component: () => import('@/views/user/myawarde'), name: 'myawarde', meta: { title: '我的任务', noCache: true }, roles: ['editor'] }
    ]
  },
  {
    path: '/skills',
    component: Layout,
    redirect: 'index',
    name: 'skills',
    meta: {
      title: '技能管理',
      icon: 'skills'
    },
    children: [
      { path: 'index', component: () => import('@/views/skills/index'), name: 'index', meta: { title: '技能列表', noCache: true }},
      { path: 'audit', component: () => import('@/views/skills/audit'), name: 'audit', meta: { title: '技能审核', noCache: true }}
    ]
  },
  {
    path: '/article',
    component: Layout,
    redirect: 'index',
    name: 'article',
    meta: {
      title: '文章管理',
      icon: 'wz'
    },
    children: [
      { path: 'create', component: () => import('@/views/article/create'), name: 'Articlecreate', meta: { title: '创建文章' }},
      { path: 'edit/:id(\\d+)', component: () => import('@/views/article/edit'), name: 'Articleedit', meta: { title: '修改文章', noCache: true }, hidden: true },
      { path: 'index', component: () => import('@/views/article/index'), name: 'ArticleList', meta: { title: '文章管理' }}
    ]
  },
  {
    path: '/advertising',
    component: Layout,
    redirect: 'index',
    name: 'advertising',
    meta: {
      title: '广告与新闻',
      icon: 'wx'
    },
    children: [
      { path: 'config', component: () => import('@/views/advertising/config'), name: 'advertisingconfig', meta: { title: '广告分类' }},
      { path: 'index', component: () => import('@/views/advertising/index'), name: 'advertisingList', meta: { title: '广告列表' }},
      { path: 'wx', component: () => import('@/views/advertising/wx'), name: 'wx', meta: { title: '新闻政策' }}
    ]
  },
  {
    path: '/new',
    component: Layout,
    redirect: 'index',
    name: 'new',
    meta: {
      title: '信息发布',
      icon: 'wx'
    },
    children: [
      { path: 'new', component: () => import('@/views/new/index'), name: 'new', meta: { title: '发布列表' }},
      { path: 'create', component: () => import('@/views/new/detail'), name: 'detail', meta: { title: '新增信息' }},
      { path: 'edit/:id(\\d+)', component: () => import('@/views/new/edit'), name: 'edit', meta: { title: '修改信息', noCache: true }, hidden: true }
    ]
  },
  {
    path: '/training',
    component: Layout,
    redirect: 'index',
    name: 'training',
    meta: {
      title: '线下培训',
      icon: 'training'
    },
    children: [
      { path: 'create', component: () => import('@/views/training/create'), name: 'trainingecreate', meta: { title: '添加线下培训', icon: 'edit' }},
      { path: 'edit/:id(\\d+)', component: () => import('@/views/training/edit'), name: 'trainingedit', meta: { title: '修改培训', noCache: true }, hidden: true },
      { path: 'oncreate', component: () => import('@/views/training/oncreate'), name: 'trainingeconreate', meta: { title: '添加线上培训', icon: 'edit' }},
      { path: 'onedit/:id(\\d+)', component: () => import('@/views/training/onedit'), name: 'trainingonedit', meta: { title: '修改线上培训', noCache: true }, hidden: true },
      { path: 'index', component: () => import('@/views/training/index'), name: 'trainingList', meta: { title: '培训管理', icon: 'list' }},
      { path: 'training_offline/:id(\\d+)', component: () => import('@/views/training/training_offline'), name: 'training_offline', meta: { title: '报名记录', noCache: true }, hidden: true }
    ]
  },
  {
    path: '/topup',
    component: Layout,
    redirect: 'index',
    name: 'topup',
    meta: {
      title: '账户管理',
      icon: 'pay'
    },
    children: [
      { path: 'withdrawal', component: () => import('@/views/topup/withdrawal'), name: 'withdrawal', meta: { title: '用户提现', noCache: true }},
      { path: 'topup', component: () => import('@/views/topup/topup'), name: 'topup', meta: { title: '用户充值', noCache: true }}
    ]
  },
  {
    path: '/config',
    component: Layout,
    redirect: 'index',
    name: 'config',
    meta: {
      title: '系统配置',
      icon: 'pay'
    },
    children: [
      { path: 'hotwords', component: () => import('@/views/config/hotwords'), name: 'hotwords', meta: { title: '评论词', noCache: true }},
      { path: 'template', component: () => import('@/views/config/template'), name: 'template', meta: { title: '通知', noCache: true }},
      { path: 'base', component: () => import('@/views/config/base'), name: 'base', meta: { title: '基础配置', noCache: true }}

    //   { path: 'user_level', component: () => import('@/views/user/user_level'), name: 'user_level', meta: { title: '会员等级', noCache: true }}
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '管理员',
      icon: 'lock',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/admin/index'),
        name: '管理员管理',
        meta: {
          title: '管理员管理',
          icon: 'lock',
          roles: ['admin'] // you can set roles in root nav
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
