<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Workday</h1>
    <b-alert :show="loading" variant="info">Loading...</b-alert>
    <b-row>
      <b-col lg="3">
        <b-card :title="'New Workday'">
          <form @submit.prevent="saveWorkday">
            <b-form-group label="Workstation">
              <b-form-select v-model="model.workstationId" :options="workstations" value-field="id" text-field="name" required></b-form-select>
            </b-form-group>
            <b-form-group label="Worker">
              <b-form-select v-model="model.workerId" :options="workers" value-field="id" text-field="name" required></b-form-select>
            </b-form-group>
            <b-form-group label="Activity">
              <b-form-select v-model="model.activityId" :options="activities" value-field="id" text-field="name" required></b-form-select>
            </b-form-group>
            <div>
              <b-btn type="submit" variant="success">Save Workday</b-btn>
            </div>
          </form>
        </b-card>
      </b-col>
      <b-col>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Workstation</th>
              <th>Worker</th>
              <th>Activity</th>
              <th>Type</th>
              <th>Creation Date</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="workday in workdays" :key="workday.id">
              <td>{{ workdayWorkstation(workday.workstationId).name }}</td>
              <td>{{ workdayWorker(workday.workerId).name }}</td>
              <td>{{ workdayActivity(workday.activityId).name }}</td>
              <td>{{ workdayActivity(workday.activityId).type }}</td>
              <td>{{ formatTimestamp(workday.createdAt) }}</td>
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
      workdays: [],
      workstations: [],
      workers: [],
      activities: [],
      model: {}
    };
  },
  async created() {
    this.refreshWorkdays();
  },
  methods: {
    async refreshWorkdays() {
      this.loading = true;
      this.workstations = await api.getWorkstations();
      this.workers = await api.getWorkers();
      this.activities = await api.getActivities();
      this.workdays = await api.getWorkdays();
      this.loading = false;
    },
    async populateWorkdayToEdit(workday) {
      this.model = Object.assign({}, workday);
    },
    async saveWorkday() {
      if (this.model.id) {
        await api.updateWorkday(this.model.id, this.model);
      } else {
        await api.createWorkday(this.model);
      }
      this.model = {};
      await this.refreshWorkdays();
    },
    async deleteWorkday(id) {
      if (confirm("Are you sure you want to delete this workday?")) {
        if (this.model.id === id) {
          this.model = {};
        }
        await api.deleteWorkday(id);
        await this.refreshWorkdays();
      }
    },
    formatTimestamp(input) {
      var variable = new Date(input)
      return variable.toLocaleString();
    },
    workdayWorkstation(id) {
      var workstation = this.workstations.find((element) => {
        return element.id === id ? element : '';
      });
      return workstation;
    },
    workdayWorker(id) {
      var worker = this.workers.find((element) => {
        return element.id === id ? element : '';
      });
      return worker;
    },
    workdayActivity(id) {
      var activity = this.activities.find((element) => {
        return element.id === id ? element : '';
      });
      return activity;
    },
  }
};
</script>