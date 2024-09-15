<template>
	<div class="min-h-screen bg-white flex">
	  <div class="mx-auto w-full max-w-sm lg:w-96 align-middle bg-gray-100 h-fit rounded-lg p-10">
		<div id="title" class="flex justify-center text-black mt-5">
				กรุณาเข้าสู่ระบบ
		</div>
		<form @submit.prevent="login" class="space-y-6">
		  <div class="form-group">
			<label for="email" class="block text-black">อีเมล</label>
			<input type="text" v-model="email" class="bg-white text-black input input-bordered w-full" />
		  </div>
		  <div class="form-group">
			<label for="password" class="block text-black">รหัสผ่าน</label>
			<input type="password" v-model="password" class="bg-white text-black input input-bordered w-full" />
		  </div>
		  <button
			class="btn btn-primary block w-full"
			type="submit"
		  >
			Sign in
		  </button>
		</form>
	  </div>
	</div>
  </template>
<script>

export default {
  data() {
	return {
	  email: null,
	  password: null,
	};
  },
  inject: ["$auth"],
  async mounted() {
	if (this.$route?.query?.route) {
	  this.redirect_route = this.$route.query.route;
	  this.$router.replace({ query: null });
	}
  },
  methods: {
	async login() {
	  if (this.email && this.password) {
		let res = await this.$auth.login(this.email, this.password);
		if (res) {
		  this.$router.go();
		}
	  }
	},
  },
};
</script>
