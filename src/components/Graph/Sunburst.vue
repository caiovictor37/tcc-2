<template>
  <div class='page'>
    <div class='title'>
      <span>Clique nos objetos para dar zoom nos detalhes, e no meio para sair do zoom</span>
    </div>
    <div class='sunburst'>
      <sunburst :data='tree'>
        <!-- Add behaviors -->
        <template slot-scope='{ on, actions }'>
          <highlightOnHover v-bind='{ on, actions }' />
          <zoomOnClick v-bind='{ on, actions }' />
        </template>

        <!-- Add information to be displayed on top the graph -->
        <nodeInfoDisplayer
          slot='top'
          slot-scope='{ nodes }'
          :current='nodes.mouseOver'
          :root='nodes.root'
          description='do total'
        />

        <!-- Add bottom legend -->
        <breadcrumbTrail
          slot='legend'
          slot-scope='{ nodes, colorGetter, width }'
          :current='nodes.mouseOver'
          :root='nodes.root'
          :colorGetter='colorGetter'
          :from='nodes.clicked'
          :width='width'
          :item-width='itemWidth'
        />
      </sunburst>
    </div>
  </div>
</template>

<script>
import {
  breadcrumbTrail,
  highlightOnHover,
  nodeInfoDisplayer,
  sunburst,
  zoomOnClick
} from 'vue-d3-sunburst'
import 'vue-d3-sunburst/dist/vue-d3-sunburst.css'
import api from '@/api'
import tree from './example'

export default {
  components: {
    breadcrumbTrail,
    highlightOnHover,
    nodeInfoDisplayer,
    sunburst,
    zoomOnClick
  },
  data () {
    return {
      itemWidth: parseInt(200),
      loading: false,
      dataset: {},
      tree,
      workdays: [],
      workstations: [],
      workers: [],
      activities: []
    }
  },
  async created () {
    this.init()
  },
  methods: {
    async init () {
      await this.refreshWorkdays()
    },
    async refreshWorkdays () {
      this.loading = true
      this.workstations = await api.getWorkstations()
      this.workers = await api.getWorkers()
      this.activities = await api.getActivities()
      this.workdays = await api.getWorkdays()
      this.loading = false
      console.log(this.workdays)
    }
  }
}
</script>

<style>
  .page {
    margin-top: 20px;
    margin-left: 100px;
  }
  .page .sunburst {
    margin: auto;
    margin-left: 50px;
    height: 500px;
    width: 500px;
  }
  .page .title {
    margin: auto;
    margin-bottom: 1%;
    text-align: left;
  }
</style>