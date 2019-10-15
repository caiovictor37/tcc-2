<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Worker</h1>
    <b-alert :show="loading" variant="info">Loading...</b-alert>
    <b-row>
      <b-col lg="3">
        <b-card :title="(model.id ? 'Edit Worker' : 'New Worker')">
          <form @submit.prevent="saveWorker">
            <b-form-group label="Name">
              <b-form-input type="text" v-model="model.name" required></b-form-input>
            </b-form-group>
            <b-form-group label="Registration Code">
              <b-form-input rows="4" v-model="model.registrationCode" required></b-form-input>
            </b-form-group>
            <b-form-group label="Description">
              <b-form-textarea rows="4" v-model="model.description" required></b-form-textarea>
            </b-form-group>
            <div>
              <b-btn type="submit" variant="success">Save Worker</b-btn>
              <b-button v-if="model.id" @click="resetModel()">New Worker</b-button>
            </div>
          </form>
        </b-card>
      </b-col>
      <b-col>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Registration Code</th>
              <th>Updated At</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="worker in workers" :key="worker.id">
              <td>{{ worker.name }}</td>
              <td>{{ worker.description }}</td>
              <td>{{ worker.registrationCode }}</td>
              <td>{{ formatTimestamp(worker.updatedAt) }}</td>
              <td class="text-center">
                <a href="#" @click.prevent="populateWorkerToEdit(worker)">Edit</a>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/*eslint-disable*/
import api from "@/api";
export default {
  data() {
    return {
      loading: false,
      workers: [],
      model: {}
    };
  },
  async created() {
    this.refreshWorkers();
  },
  methods: {
    async refreshWorkers() {
      this.loading = true;
      this.workers = await api.getWorkers();
      this.loading = false;
    },
    async populateWorkerToEdit(worker) {
      this.model = Object.assign({}, worker);
    },
    async saveWorker() {
      if (this.model.id) {
        await api.updateWorker(this.model.id, this.model);
      } else {
        await api.createWorker(this.model);
      }
      this.model = {};
      await this.refreshWorkers();
    },
    async deleteWorker(id) {
      if (confirm("Are you sure you want to delete this worker?")) {
        if (this.model.id === id) {
          this.model = {};
        }
        await api.deleteWorker(id);
        await this.refreshWorkers();
      }
    },
    resetModel() {
      this.model = {};
    },
    formatTimestamp(input) {
      var variable = new Date(input)
      return variable.toLocaleString();
    }
  }
};
</script>