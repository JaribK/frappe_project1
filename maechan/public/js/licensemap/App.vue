<script>
import { GoogleMap, Marker, InfoWindow, Polygon } from 'vue3-google-map'
import Multiselect from 'vue-multiselect'
import UTMLatLng from "utm-latlng"
import _ from 'underscore'
import dayjs from 'dayjs'
let DURATION = require('dayjs/plugin/duration')


dayjs.extend(DURATION)

export default {
  components: { GoogleMap, Polygon, Marker, InfoWindow, Multiselect },
  data() {
    return {
      apiKey: null,
      licenses: [],
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
      markers : {
        icon : "M8.075 23.52C1.264 13.642 0 12.629 0 9c0-4.971 4.029-9 9-9s9 4.029 9 9c0 3.629-1.264 4.64-8.075 14.516a1.126 1.126 0 0 1-1.847.004l-.002-.004z",
        normal : "green",
        last90 : "yellow",
        last60 : "orange",
        last30 : "red",
        expired : "grey"
      },
      top : 0,

      zoom: 15,

      form: {
        disrtict: null,
      },
    }
  }, async mounted() {

    this.apiKey = await frappe.db.get_single_value('MaechanConfig', 'google_api_key')

    let licenses = await this.getLicenses()
    let districts = await frappe.db.get_list('District', { fields: ["*"],order_by : "moo asc, tambon_id asc" })

    for (let i = 0; i < licenses.length; i++) {
      licenses[i].showInfo = false;
    }

    this.licenses = licenses;
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
    getDurationDays: function (day) {
      let end_date = dayjs(day)
      let today = dayjs()

      let duration = dayjs.duration(today.diff(end_date))
      let days = duration.asDays()

      return parseInt(Math.abs(days))
    },
    getLicenses: async function (district_id) {
      let licenses = []
      if (district_id) {
        let response = await frappe.call({
          method: "maechan.maechan_license.api.license_chart",
          args: {
            district_id: district_id
          },
        })
        licenses = response.message
      } else {
        let response = await frappe.call({
          method: "maechan.maechan_license.api.license_chart",
          args: {
          },
        })
        licenses = response.message
      }

      licenses = _.sortBy(licenses, (l) => l.license_end_date).reverse()
      
      licenses.forEach((value,key) => {
        licenses[key].house_lat = licenses[key].house_lat + (Math.random() / 10000  - 0.00005)
        licenses[key].house_lng = licenses[key].house_lng + (Math.random() / 10000  - 0.00005)
      });


      let test = _.groupBy(licenses, (l) => l.license_name)
  
      console.log(_.chain(test).map((value, key) => ({ showInfoWindow: false, licenses: value })).value());


      return _.chain(test).map((value, key) => ({ showInfoWindow: false, licenses: value })).value()

    },
    filterLicense: async function (option, id) {
      let district = this.form.district;
      if (district) {
        let district_name = district.name
        let licenses = await this.getLicenses(district_name);


        this.licenses = licenses
      } else {

        let licenses = await this.getLicenses();
        this.licenses = licenses
      }

    },
    showInfo: function (license) {
      this.infos.push(license)
    },
    openclose : function(marker){
      if(this.currentMarker != null){
        this.currentMarker.showInfoWindow = false;
      }
      marker.showInfoWindow = true
      this.currentMarker = marker
    },

    getColor(license_wrapper) {

      let license = license_wrapper.licenses[0]
      
      if(license.workflow_state == "Approved"){
        let duration = this.getDurationDays(license.license_end_date)
        if(duration > 90){
          return this.markers.normal
        }else if (duration >60) {
          return this.markers.last90
        }else if (duration >30) {
          return this.markers.last60
        }else if (duration >0) {
          return this.markers.last30
        }else {
          return this.markers.expired
        }

       }else {
        return this.markers.expired
      }
      
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
      <multiselect @remove="filterLicense" @select="filterLicense" v-model="form.district" :options="districts"
        track-by="name" label="text_display"></multiselect>
    </div>
  </div>

  <div class="row mt-3" ref="map">
    <div class="col" v-if="apiKey">
      <GoogleMap :styles='[
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [
              { visibility: "off" }
        ]
    }
]'  :api-key="apiKey"  :style="{'min-height' : '50vh',height : `calc(100vh - ${top}px - 30px)` }" style="width: 100%;" :center="center" :zoom="zoom" >
        <Marker @click="openclose(license)" v-for="license in licenses"
          :options="{icon: { path: markers.icon,fillColor:getColor(license),fillOpacity:1,strokeWeight:0, scaledSize: { width: 40, height: 40 } },  position: { lat: license.licenses[0].house_lat, lng: license.licenses[0].house_lng } }">
          <InfoWindow v-model="license.showInfoWindow">
            <div class="info_window_content">
              <div class="info_window_site_notice"></div>
              <div class="info_window_window_content" style="display: flex;flex-direction: column;">
                <div style="display: flex;">
                  <span class="font-bold">เลขที่</span> {{ license.licenses[0].house_no }} หมู่ที่ {{
                    license.licenses[0].house_moo }} ตำบล{{
    license.licenses[0].tambon_th }}
                  อำเภอ {{ license.licenses[0].amphure_th }} จังหวัด {{ license.licenses[0].province_th }}
                </div>



                <div style="display: flex;">
                  <a :href="`https://www.google.com/maps/dir/?api=1&destination=${license.licenses[0].house_lat},${license.licenses[0].house_lng}`"
                    target="_blank"
                    style="text-decoration: none;border-radius: 16px;margin-top: 1rem; padding : 0.5rem 1rem; background-color: black; color:white">นำทาง</a>
                </div>
                <div style="display: block;">
                  <hr />
                </div>


                <div v-for="d in license.licenses" style="display: block;">
                  <span class="font-bold">ใบอนุญาต</span> {{ d.license_main_type }} <br />
                  <span class="font-bold">ผู้ได้รับใบอนุญาต</span> {{ d.license_applicant_title }} <br />
                  <span class="font-bold">สถานะ</span> {{ d.workflow_state == "Approved" ? "อนุมัติ" : "หมดอายุ" }} <br />
                  <span class="font-bold">วันหมดอายุ</span> {{ d.license_end_date }} ({{
                    getDurationDays(d.license_end_date) }} วัน)<br />
                  <hr />
                </div>

              </div>
            </div>
          </InfoWindow>
        </Marker>
      </GoogleMap>
    </div>
  </div>
</template>

<style scoped>
.font-bold {
  font-weight: bold;
}
</style>