<script>
import { GoogleMap, Marker, InfoWindow, Polygon } from 'vue3-google-map'
import Multiselect from 'vue-multiselect'
import UTMLatLng from "utm-latlng"

export default {
  components: { GoogleMap, Polygon, Marker, InfoWindow, Multiselect },
  data() {
    return {
      colors: [
        "#000000", "#FF0000", "#EE005F", "#B62A8F", "#6D4B9A", "#325082", "#0082FF", "#009700"
      ],
      apiKey: null,
      lands: [],
      infos: [],
      districts: [],
      center: { lat: 20.138951, lng: 99.854991 },
      options: {
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
      },
      top : 0,
      zoom: 15,

      form: {
        disrtict: null,
      },
    }
  }, async mounted() {

    this.apiKey = await frappe.db.get_single_value('MaechanConfig', 'google_api_key')

    let lands = await this.getLands()
    let districts = await frappe.db.get_list('District', { fields: ["*"] })

    for (let i = 0; i < lands.length; i++) {
      lands[i].showInfo = false;
    }

    this.lands = lands;
    this.districts = districts
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
    getLands: async function (district_id) {
      if (district_id) {
        let response = await frappe.call({
          method: "maechan.maechan_core.api.land_chart",
          args: {
            district_id: district_id
          },
        })
        let lands = response.message
        return lands;
      } else {
        let response = await frappe.call({
          method: "maechan.maechan_core.api.land_chart",
          args: {
          },
        })
        let lands = response.message
        return lands;

      }
    },
    getPathOfLand: function (land) {
      console.log(land)
      let json = JSON.parse(land.geojson)
      let utmLatLng = new UTMLatLng('Everest')

      let coordinates_utm = json.geometry.coordinates[0][0]
      let coordinates_latlng = coordinates_utm.map(x => {
        return {
          lat: x[1],
          lng: x[0]
        }
      })

      // console.log(coordinates_latlng)
      options = { ...this.options, paths: coordinates_latlng }
      options.strokeColor = this.colors[parseInt(land.district_id)]
      options.fillColor = this.colors[parseInt(land.district_id)]
      return options

    },
    filterLand: async function (option, id) {
      let district = this.form.district;
      if (district) {
        let district_name = district.name
        let lands = await this.getLands(district_name);
        this.lands = lands;
      } else {

        let lands = await this.getLands();
        this.lands = lands;
      }

    },
    showInfo: function (land) {
      this.infos.push(land)
    },
    closeInfo: function (land) {
      let index = this.infos.indexOf(land)
      this.infos.splice(index, 1)
      // console.log(this.infos);
    }
  }
}
</script>

<style>
@import "vue-multiselect/dist/vue-multiselect.css";
</style>

<template>
  <div class="row">
    <div class="col-6">
      <multiselect @remove="filterLand" @select="filterLand" v-model="form.district" :options="districts" track-by="name"
        label="text_display"></multiselect>
    </div>
  </div>

  <div class="row mt-3" ref="map">
    <div class="col" v-if="apiKey">

      <GoogleMap :api-key="apiKey" :style="{ 'min-height': '50vh', height: `calc(100vh - ${top}px - 30px)` }"
        style="width: 100%;" :center="center" :zoom="zoom">
        <Polygon :options="getPathOfLand(d)" v-for="d in lands" @click="showInfo(d)">
        </Polygon>

        <InfoWindow @closeclick="closeInfo(d)" v-for="d in infos" :options="{ position: { lat: d.lat, lng: d.lng } }">
          Name : {{ d.land_owner }} <br />
          PARCEL COD : {{ d.parcel_cod }}
        </InfoWindow>
      </GoogleMap>
    </div>
  </div>
</template>
