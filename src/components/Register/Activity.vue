<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Activity</h1>
    <b-alert :show="loading" variant="info">Loading...</b-alert>
    <b-row>
      <b-col lg="3">
        <b-card :title="(model.id ? 'Edit Activity' : 'New Activity')">
          <form @submit.prevent="saveActivity">
            <b-form-group label="Name">
              <b-form-input type="text" v-model="model.name" required></b-form-input>
            </b-form-group>
            <b-form-group label="Type">
              <b-form-select v-model="model.type" :options="types" required></b-form-select>
            </b-form-group>
            <b-form-group label="Description">
              <b-form-textarea type="text" v-model="model.description" required></b-form-textarea>
            </b-form-group>
            <div>
              <b-btn type="submit" variant="success">Save Activity</b-btn>
              <b-button v-if="model.id" @click="resetModel()">New Activity</b-button>
            </div>
          </form>
        </b-card>
      </b-col>
      <b-col>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="activity in activities" :key="activity.id">
              <td>{{ activity.name }}</td>
              <td>{{ activity.type }}</td>
              <td>{{ activity.description }}</td>
              <td>{{ formatTimestamp(activity.createdAt) }}</td>
              <td>{{ formatTimestamp(activity.updatedAt) }}</td>
              <td class="text-center">
                <a href="#" @click.prevent="populateActivityToEdit(activity)">Edit</a>
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
      activities: [],
      workstations: [],
      types:[
        'Produtiva', // Faz parte do escopo de trabalho
        'Não Produtiva', // Não faz parte do escopo de trabalho, mas é necessária
        'Parada' // Não faz parte do escopo de trabalho, e não é necessária
      ],
      model: {}
    };
  },
  async created() {
    this.refreshActivities();
  },
  methods: {
    async refreshActivities() {
      this.loading = true;
      this.activities = await api.getActivities();
      this.workstations = await api.getWorkstations();
      this.loading = false;
    },
    async populateActivityToEdit(activity) {
      this.model = Object.assign({}, activity);
    },
    async saveActivity() {
      if (this.model.id) {
        await api.updateActivity(this.model.id, this.model);
      } else {
        await api.createActivity(this.model);
      }
      this.model = {};
      await this.refreshActivities();
    },
    async deleteActivity(id) {
      if (confirm("Are you sure you want to delete this activity?")) {
        if (this.model.id === id) {
          this.model = {};
        }
        await api.deleteActivity(id);
        await this.refreshActivities();
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