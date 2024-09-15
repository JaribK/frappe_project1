<script>
import { GoogleMap, Marker, InfoWindow } from 'vue3-google-map'
import Multiselect from 'vue-multiselect'

export default {
  components: { GoogleMap, Marker, InfoWindow, Multiselect },
  data() {
    return {
      waterGates: [],
      center: { lat: 20.138951, lng: 99.854991 },
      apiKey: null,
      zoom: 15,
      test: null,
      top : 0,
      red: 'https://maps.google.com/mapfiles/kml/paddle/red-circle.png',
      orange: 'https://maps.google.com/mapfiles/kml/paddle/orange-circle.png',
      yellow: 'https://maps.google.com/mapfiles/kml/paddle/ylw-circle.png',
      blue: 'https://maps.google.com/mapfiles/kml/paddle/blu-circle.png',

      infowindow : null,

    }
  }, async mounted() {
    this.apiKey = await frappe.db.get_single_value('MaechanConfig', 'google_api_key')

    let waterGates = await this.getWaterGates();

    this.waterGates = waterGates
    this.myEventHandler()

  },
  created() {
    window.addEventListener("resize", this.myEventHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.myEventHandler);
  },
  methods: {
    myEventHandler(e) {
      // your code for handling resize...
      console.log(this.$refs.map.getBoundingClientRect().top)
      this.top = this.$refs.map.getBoundingClientRect().top
    },
    getWaterGates: async function () {
      let response = await frappe.call({
        method: "maechan.maechan_water.api.list_watergates",
        args: {

        },
      })
      let waterGates = response.message
      return waterGates;
    },

    openclose: async function (waterGate) {
      waterGate.isOpenInfo = false;
      let response = await fetch(`/api/resource/WaterGate/${waterGate.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "X-Frappe-CSRF-Token": frappe.csrf_token
        },
        body: JSON.stringify({
          "status": waterGate.status === "เปิด" ? "ปิด" : "เปิด"
        })
      })

      let result = await response.json()

      waterGate.status = result.data.status
      waterGate.isOpenInfo = false;
    },

    openCloseInfo: async function (waterGate) {
      
      if(this.infowindow != null) {
        this.infowindow.isOpenInfo = false
      }

      this.infowindow = waterGate
      this.infowindow.isOpenInfo = true 
    },

    getIcon: function (waterGate) {
      if (waterGate.status == "เปิด") {
        return this.blue
      } else {
        return this.orange
      }
    }
  }
}
</script>

<style>
@import "vue-multiselect/dist/vue-multiselect.css";
</style>

<template>
  <div class="row mt-3" ref="map">
    <div class="col" v-if="apiKey">
      <GoogleMap :api-key="apiKey" :style="{ 'min-height': '50vh', height: `calc(100vh - ${top}px - 30px)` }"
        style="width: 100%;" :center="center" :zoom="zoom">
        <Marker @click="openCloseInfo(d)" v-for="d in waterGates"
          :options="{ icon: { url: getIcon(d), scaledSize: { width: 40, height: 40 } }, position: { lat: d.lat, lng: d.lng } }">
          <InfoWindow v-model="d.isOpenInfo">
            <div id="contet">
              <div id="siteNotice"></div>
              <div id="bodyContent">
                {{ d.name }} <br />
                <b>สถานะประตู</b> {{ d.status }} <br />
                <img :src="d.image" style="width: 10vw; height: auto;" />
                <br />
                <button class="btn btn-info" @click="openclose(d)">เปิด/ปิด ประตู</button>

              </div>
            </div>
          </InfoWindow>
        </Marker>
      </GoogleMap>
    </div>
  </div>
</template>
