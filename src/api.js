import Vue from 'vue'
import axios from 'axios'

// @CAIO: Config IP to run locally or in PRD Server
const hostName = 'localhost'
// const hostName = '187.1.90.150'

const client = axios.create({
  baseURL: `http://${hostName}:15040/`,
  json: true
})

export default {
  async execute (method, resource, data) {
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

  // Workstation
  getWorkstations () {
    return this.execute('get', '/workstation')
  },
  getWorkstation (id) {
    return this.execute('get', `/workstation/${id}`)
  },
  createWorkstation (data) {
    return this.execute('post', '/workstation', data)
  },
  updateWorkstation (id, data) {
    return this.execute('put', `/workstation/${id}`, data)
  },
  deleteWorkstation (id) {
    return this.execute('delete', `/workstation/${id}`)
  },

  // Worker
  getWorkers () {
    return this.execute('get', '/worker')
  },
  getWorker (id) {
    return this.execute('get', `/worker/${id}`)
  },
  createWorker (data) {
    return this.execute('post', '/worker', data)
  },
  updateWorker (id, data) {
    return this.execute('put', `/worker/${id}`, data)
  },
  deleteWorker (id) {
    return this.execute('delete', `/worker/${id}`)
  },

  // Activity
  getActivities () {
    return this.execute('get', '/activity')
  },
  getActivity (id) {
    return this.execute('get', `/activity/${id}`)
  },
  createActivity (data) {
    return this.execute('post', '/activity', data)
  },
  updateActivity (id, data) {
    return this.execute('put', `/activity/${id}`, data)
  },
  deleteActivity (id) {
    return this.execute('delete', `/activity/${id}`)
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
