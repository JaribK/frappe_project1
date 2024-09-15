<script>
import axios from 'axios'

export default {
    name: 'SidebarMenu',
    data() {
        return {

        }
    },
    async mounted() {
        console.log(this.$route.path)
    },
    computed: {

    },

}
</script>

<template>
    <div class="flex h-screen">
      <div class="w-64">
        <div class="p-4">
          <ul class="menu">
            <li>
              <router-link to="home" class="flex items-center space-x-3 text-black" >
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" aria-hidden="true" focusable="false" tabindex="-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg>
                <span>หน้าหลัก</span>
              </router-link>
            </li>
            <li>
              <router-link to="test" class="flex items-center space-x-3 text-black">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" tabindex="-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 21h-9a3 3 0 0 1 -3 -3v-1h10v2a2 2 0 0 0 4 0v-14a2 2 0 1 1 2 2h-2m2 -4h-11a3 3 0 0 0 -3 3v11"></path><path d="M9 7l4 0"></path><path d="M9 11l4 0"></path></svg>
                <span>ออกรายงานผล</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>
  