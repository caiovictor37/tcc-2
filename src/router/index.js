import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import PostsManager from '@/components/PostsManager'
import Workday from '@/components/Workday'
import Auth from '@okta/okta-vue'

// @CAIO: Config IP
// const hostName = 'localhost'
const hostName = '187.1.90.150'

Vue.use(Auth, {
  issuer: 'https://dev-360836.okta.com/oauth2/default',
  client_id: '0oa1b3uwzxt0W2rU7357',
  redirect_uri: `http://${hostName}:15000/implicit/callback`,
  scope: 'openid profile email'
})

Vue.use(Router)

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
      path: '/posts-manager',
      name: 'PostsManager',
      component: PostsManager,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/workday',
      name: 'Workday',
      component: Workday,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach(Vue.prototype.$auth.authRedirectGuard())

export default router
