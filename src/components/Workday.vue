<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Workday</h1>
    <b-alert :show="loading" variant="info">Loading...</b-alert>
    <b-row>
      <b-col lg="3">
        <b-card :title="(model.id ? 'Edit Workday ID#' + model.id : 'New Workday')">
          <form @submit.prevent="saveWorkday">
            <b-form-group label="Name">
              <b-form-input type="text" v-model="model.name"></b-form-input>
            </b-form-group>
            <b-form-group label="Activities">
              <b-form-select v-model="model.activity" :options="activities"></b-form-select>
            </b-form-group>
            <b-form-group label="Types">
              <b-form-radio-group
                id="radio-group-1"
                v-model="model.type"
                :options="types"
                name="radios-stacked"
                stacked
              ></b-form-radio-group>
            </b-form-group>
            <div>
              <b-btn type="submit" variant="success">Save Workday</b-btn>
              <b-button v-if="model.id" @click="resetModel()">New Workday</b-button>
            </div>
          </form>
        </b-card>
      </b-col>
      <b-col>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Activity</th>
              <th>Type</th>
              <th>Updated At</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="Workday in Workdays" :key="Workday.id">
              <td>{{ Workday.id }}</td>
              <td>{{ Workday.name }}</td>
              <td>{{ Workday.activity }}</td>
              <td>{{ Workday.type }}</td>
              <td>{{ formatTimestamp(Workday.updatedAt) }}</td>
              <td class="text-right">
                <a href="#" @click.prevent="populateWorkdayToEdit(Workday)">Edit</a> -
                <a href="#" @click.prevent="deleteWorkday(Workday.id)">Delete</a>
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
      Workdays: [],
      model: {},
      activities: [
        "Atividade 1",
        "Atividade 2",
        "Atividade 3",
        "Atividade 4",
        "Atividade 5"
      ],
      types: ["Produtiva", "Não produtiva", "Parada", "Almoço"]
    };
  },
  async created() {
    this.refreshWorkdays();
  },
  methods: {
    async refreshWorkdays() {
      this.loading = true;
      this.Workdays = await api.getWorkdays();
      this.loading = false;
    },
    async populateWorkdayToEdit(Workday) {
      this.model = Object.assign({}, Workday);
    },
    async saveWorkday() {
      // console.log(process.env.HOST);
      if (this.model.id) {
        await api.updateWorkday(this.model.id, this.model);
      } else {
        await api.createWorkday(this.model);
      }
      this.model = {}; // reset form
      await this.refreshWorkdays();
    },
    async deleteWorkday(id) {
      if (confirm("Are you sure you want to delete this Workday?")) {
        // if we are editing a Workday we deleted, remove it from the form
        if (this.model.id === id) {
          this.model = {};
        }
        await api.deleteWorkday(id);
        await this.refreshWorkdays();
      }
    },
    resetModel() {
      this.model = {};
    },
    formatTimestamp(input) {
      var variable = new Date(input);
      return variable.toLocaleString();
    }
  }
};
</script>