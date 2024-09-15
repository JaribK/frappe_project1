<script>
import axios from 'axios'

export default {
    name: 'Navbar',
    data() {
        return {
            username: '',
            user_pic: '',
            auth: false
        }
    },
    async mounted() {
        this.getUsername()
        this.checkAuth()
    },
    methods: {
        checkAuth() {
            axios.get('/api/method/frappe.auth.get_logged_user')
            .then(response => {
                if (response.data.message == 'Guest') {
                    this.auth = false
                } else {
                    this.auth = true
                }
            })
            .catch(error => {
                console.log(error)
            })
        },
        getUsername() {
            axios.get('/api/method/frappe.auth.get_logged_user')
            .then(response => {
                this.username = response.data.message
                this.user_pic = `https://placehold.jp/100/33ffb2/000000/250x250.png?text=${this.username.substring(0,3)}`
            })
            .catch(error => {
                console.log(error)
            })
        },
        async logout() {
            await axios.post('/api/method/maechan.api.logout')
            .then(response => {
                this.$router.go()
            })
            .catch(error => {
                console.log(error)
            })
        }
    }

}
</script>

<template>
    <div class="navbar flex justify-between items-center px-[100px] gap-4 border-b-[1px] ">
          <a class="btn btn-ghost text-xl text-black">บริการจัดการป้ายภาษี</a>
          <div class="dropdown dropdown-end">
            <div v-if="auth" tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" :src="user_pic" />
              </div>
            </div>
            <ul tabindex="0" class="menu menu-sm dropdown-content bg-red-600 rounded-box z-[1] mt-3 w-52 p-2 shadow text-black">
              <li @click="logout"><a>Logout</a></li>
            </ul>
        </div>
      </div>
</template>