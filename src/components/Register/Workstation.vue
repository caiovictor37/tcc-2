<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Workstation</h1>
    <b-alert :show="loading" variant="info">Loading...</b-alert>
    <b-row>
      <b-col lg="3">
        <b-card :title="(model.id ? 'Edit Workstation' : 'New Workstation')">
          <form @submit.prevent="saveWorkstation">
            <b-form-group label="Name">
              <b-form-input type="text" v-model="model.name" required></b-form-input>
            </b-form-group>
            <b-form-group label="Description">
              <b-form-input type="text" v-model="model.description" required></b-form-input>
            </b-form-group>
            <b-form-group label="Start of Turn">
              <b-form-input type="time" v-model="model.workdayStart" required></b-form-input>
            </b-form-group>
            <b-form-group label="End of Turn">
              <b-form-input type="time" v-model="model.workdayEnd" required></b-form-input>
            </b-form-group>
            <div>
              <b-btn type="submit" variant="success">Save Workstation</b-btn>
              <b-button v-if="model.id" @click="resetModel()">New Workstation</b-button>
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
              <th>Start of Turn</th>
              <th>End of Turn</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="workstation in workstations" :key="workstation.id">
              <td>{{ workstation.name }}</td>
              <td>{{ workstation.description }}</td>
              <td>{{ workstation.workdayStart }}</td>
              <td>{{ workstation.workdayEnd }}</td>
              <td class="text-center">
                <a href="#" @click.prevent="populateWorkstationToEdit(workstation)">Edit</a>
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
      workstations: [],
      model: {}
    };
  },
  async created() {
    this.refreshWorkstations();
  },
  methods: {
    async refreshWorkstations() {
      this.loading = true;
      this.workstations = await api.getWorkstations();
      this.loading = false;
    },
    async populateWorkstationToEdit(workstation) {
      this.model = Object.assign({}, workstation);
    },
    async saveWorkstation() {
      if (this.model.id) {
        await api.updateWorkstation(this.model.id, this.model);
      } else {
        await api.createWorkstation(this.model);
      }
      this.model = {};
      await this.refreshWorkstations();
    },
    async deleteWorkstation(id) {
      if (confirm("Are you sure you want to delete this workstation?")) {
        if (this.model.id === id) {
          this.model = {};
        }
        await api.deleteWorkstation(id);
        await this.refreshWorkstations();
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