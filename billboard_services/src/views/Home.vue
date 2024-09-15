
<script>
export default {
  inject: ["$auth"],
  resources: {
	ping() {
	  return {
		method: "frappe.ping", // Method to call on backend
		onSuccess(d) {
		  alert(d);
		},
	  };
	},
  },
};
</script>

<template>
  <div class="text-black">
	<h1 class="text-2xl mb-4 ">ยินดีต้อนรับสู่ระบบบริการจัดการป้ายภาษี</h1>
  </div>
</template>
