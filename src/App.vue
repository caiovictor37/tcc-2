<template>
  <div id='app'>
    <b-navbar toggleable='md' type='dark' variant='dark'>
      <b-navbar-toggle class='hero' target='nav_collapse'></b-navbar-toggle>
      <b-navbar-brand to='/'>TCC 2</b-navbar-brand>
      <b-collapse is-nav id='nav_collapse'>
        <b-navbar-nav>
          <b-nav-item to='/'>Home</b-nav-item>
          <b-nav-item-dropdown text='Register' v-if='activeUser' right>
            <b-dropdown-item to='/register/workstation' v-if='activeUser'>Workstation</b-dropdown-item>
            <b-dropdown-item to='/register/worker' v-if='activeUser'>Worker</b-dropdown-item>
            <b-dropdown-item to='/register/activity' v-if='activeUser'>Activity</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item to='/workday' v-if='activeUser'>Workday</b-nav-item>
          <b-nav-item-dropdown text='Graph' v-if='activeUser' right>
            <b-dropdown-item to='/graph/sunburst' v-if='activeUser'>Sunburst</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item href='#' @click.prevent='login' v-if='!activeUser'>Login</b-nav-item>
          <b-nav-item href='#' @click.prevent='logout' v-else>Logout</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <!-- routes will be rendered here -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      activeUser: null
    }
  },
  async created () {
    await this.refreshActiveUser()
  },
  watch: {
    // everytime a route is changed refresh the activeUser
    $route: 'refreshActiveUser'
  },
  methods: {
    login () {
      this.$auth.loginRedirect()
    },
    async refreshActiveUser () {
      this.activeUser = await this.$auth.getUser()
    },
    async logout () {
      await this.$auth.logout()
      await this.refreshActiveUser()
      this.$router.push('/')
    }
  }
}
</script>