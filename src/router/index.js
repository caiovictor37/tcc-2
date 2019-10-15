import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Workday from '@/components/Workday'
import Workstation from '@/components/Register/Workstation'
import Worker from '@/components/Register/Worker'
import Activity from '@/components/Register/Activity'
import Sunburst from '@/components/Graph/Sunburst'
import Auth from '@okta/okta-vue'

// @CAIO: Config IP
const hostName = 'localhost'
// const hostName = '187.1.90.150'

Vue.use(Auth, {
  issuer: 'https://dev-360836.okta.com/oauth2/default',
  client_id: '0oa1b3uwzxt0W2rU7357',
  redirect_uri: `http://${hostName}:15000/implicit/callback`,
  scope: 'openid profile email'
})

Vue.use(Router)

let reqAuthentication = true

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/implicit/callback',
      component: Auth.handleCallback()
    },
    {
      path: '/register/workstation',
      name: 'Workstation',
      component: Workstation,
      meta: {
        requiresAuth: reqAuthentication
      }
    },
    {
      path: '/register/worker',
      name: 'Worker',
      component: Worker,
      meta: {
        requiresAuth: reqAuthentication
      }
    },
    {
      path: '/register/activity',
      name: 'Activity',
      component: Activity,
      meta: {
        requiresAuth: reqAuthentication
      }
    },
    {
      path: '/workday',
      name: 'Workday',
      component: Workday,
      meta: {
        requiresAuth: reqAuthentication
      }
    },
    {
      path: '/graph/sunburst',
      name: 'Sunburst',
      component: Sunburst,
      meta: {
        requiresAuth: reqAuthentication
      }
    }
  ]
})

router.beforeEach(Vue.prototype.$auth.authRedirectGuard())

export default router
