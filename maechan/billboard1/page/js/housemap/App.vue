<script>
import { GoogleMap, Marker, InfoWindow } from 'vue3-google-map'
import Multiselect from 'vue-multiselect'

export default {
  components: { GoogleMap, Marker, InfoWindow, Multiselect },
  data() {
    return {
      greeting: 'Chaow!',
      houses: [],
      districts: [],
      center: { lat: 20.138951, lng: 99.854991 },
      apiKey : null,
      currentMarker : null,
      top : 0,
      zoom: 15,

      form: {
        disrtict: null,
      },
    }
  }, async mounted() {


    this.apiKey = await frappe.db.get_single_value('MaechanConfig', 'google_api_key')

    let houses = await this.getHouses();
    let districts = await frappe.db.get_list('District', { fields: ["*"], order_by:"moo asc" })

    this.houses = houses
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
    getHouses: async function (district_id) {
      if (district_id) {
        let response = await frappe.call({
          method: "maechan.maechan_core.api.house_chart",
          args: {
            district_id: district_id
          },
        })
        let houses = response.message
        houses.forEach(element => {
          element.showInfoWindow = false
        });
        return houses;
      }else {
        let response = await frappe.call({
          method: "maechan.maechan_core.api.house_chart",
          args: {
          },
        })
        let houses = response.message

        houses.forEach(element => {
          element.showInfoWindow = false
        });
        return houses;

      }
    },
    filterHouse: async function (option, id) {
      let district = this.form.district;
      if (district) {
        let district_name = district.name
        let houses = await this.getHouses(district_name);
        this.houses = houses;
      } else {
        let houses = await this.getHouses();
        this.houses = houses;
      }

    },
    openclose : function(marker){
      if(this.currentMarker != null){
        this.currentMarker.showInfoWindow = false;
      }
      marker.showInfoWindow = true
      this.currentMarker = marker
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
      <multiselect @remove="filterHouse" @select="filterHouse" v-model="form.district" :options="districts"
        track-by="name" label="text_display"></multiselect>
    </div>
  </div>

  <div class="row mt-3" ref="map">
    <div class="col" v-if="apiKey">
      
      <GoogleMap  :api-key="apiKey"  :style="{'min-height' : '50vh',height : `calc(100vh - ${top}px - 30px)` }" style="width: 100%;" :center="center" :zoom="zoom">
        <Marker @click="openclose(d)" v-for="d in houses" :options="{ position: { lat: d.house_lat, lng: d.house_lng } }">
          <InfoWindow v-model="d.showInfoWindow">
            <div class="infowindow_content" style="padding-right: 1rem;">
              <div class="infowindow_siteNotice"></div>
              <div style="display:flex; flex-direction: column;" class="infowindow_bodyContent">
                <div style="display: flex;">
                  เลขที่ {{ d.house_no }} หมู่ที่ {{ d.house_moo }} ตำบล{{ d.tambon_th }}
                  อำเภอ {{ d.amphure_th }} จังหวัด {{ d.province_th }}
                </div>

                <div style="display: flex;">
                  <a :href="`https://www.google.com/maps/dir/?api=1&destination=${d.house_lat},${d.house_lng}`" target="_blank" style="text-decoration: none;border-radius: 16px;margin-top: 1rem; padding : 0.5rem 1rem; background-color: black; color:white">นำทาง</a>
                </div>
                
              </div>
            </div>
          </InfoWindow>
        </Marker>
      </GoogleMap>
    </div>
  </div>
</template>
