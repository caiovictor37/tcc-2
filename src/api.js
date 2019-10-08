import Vue from 'vue'
import axios from 'axios'

// @CAIO: Config IP
// const hostName = 'localhost'
const hostName = '187.1.90.150'

const client = axios.create({
  baseURL: `http://${hostName}:15040/`,
  json: true
})

export default {
  async execute (method, resource, data) {
    // inject the accessToken for each request
    let accessToken = await Vue.prototype.$auth.getAccessToken()
    return client({
      method,
      url: resource,
      data,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(req => {
      return req.data
    })
  },

  // Posts
  getPosts () {
    return this.execute('get', '/posts')
  },
  getPost (id) {
    return this.execute('get', `/posts/${id}`)
  },
  createPost (data) {
    return this.execute('post', '/posts', data)
  },
  updatePost (id, data) {
    return this.execute('put', `/posts/${id}`, data)
  },
  deletePost (id) {
    return this.execute('delete', `/posts/${id}`)
  },

  // Workday
  getWorkdays () {
    return this.execute('get', '/workday')
  },
  getWorkday (id) {
    return this.execute('get', `/workday/${id}`)
  },
  createWorkday (data) {
    return this.execute('post', '/workday', data)
  },
  updateWorkday (id, data) {
    return this.execute('put', `/workday/${id}`, data)
  },
  deleteWorkday (id) {
    return this.execute('delete', `/workday/${id}`)
  }
}
