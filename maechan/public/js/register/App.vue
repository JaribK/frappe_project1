<template>
   <form @submit.prevent="submit">
      <div class="page-card container">
         <section>
            <h3>ข้อมูลส่วนตัว</h3>
            <hr>
            <div class="form-group">
               <p>ชื่อ-สกุล</p><input type="text" v-model.trim="registerForm.fullname" required />
            </div>
            <div class="form-group col-75">
               <p>เบอร์โทรศัพท์</p><input type="tel" v-model="registerForm.tel" pattern=".{8,12}" required />
            </div>
            <div class="row">
               <div class="form-group col-30">
                  <p>เชื้อชาติ</p><input type="text" v-model="registerForm.race" required />
               </div>
               <div class="form-group col-30">
                  <p>สัญชาติ</p><input type="text" v-model="registerForm.nationality" required />
               </div>
               <div class="form-group col-30">
                  <p>วัน/เดือน/ปี เกิด</p><input type="date" v-model="registerForm.birthdate" required />
               </div>
            </div>
         </section>
         <section>
            <h3>ที่อยู่</h3>
            <hr>
            <div class="row">
               <div class="form-group col-30">
                  <p>บ้านเลขที่</p><input type="text" v-model="registerForm.address_no" required />
               </div>
               <div class="form-group col-30">
                  <p>หมู่</p><input type="text" v-model="registerForm.address_moo" pattern="[0-9]{1,}"
                     title="กรุณากรอกข้อมูล ตัวเลข เท่านั้น" required />
               </div>
               <div class="form-group col-30">
                  <p>ตรอก/ซอย</p><input type="text" v-model="registerForm.address_soi">
               </div>
            </div>
            <div class="row">
               <div class="form-group col-50">
                  <p>ถนน</p><input type="text" v-model="registerForm.address_road">
               </div>
               <div class="form-group col-50">
                  <p>ตำบล</p><input type="text" v-model="registerForm.address_district" required />
               </div>
            </div>
            <div class="row">
               <div class="form-group col-50">
                  <p>อำเภอ</p><input type="text" v-model="registerForm.address_amphur" required />
               </div>
               <div class="form-group col-50">
                  <p>จังหวัด</p><input type="text" v-model="registerForm.address_province" required />
               </div>
            </div>
         </section>
         <section>
            <h3>ข้อมูลบัญชี</h3>
            <hr>
            <div class="form-group">
               <p>Email</p><input type="email" v-model="registerForm.email" required />
            </div>
            <div class="form-group">
               <p>รหัสผ่าน</p><input type="password" v-model="registerForm.pwd" required />
            </div>
            <div class="form-group">
               <p>ยืนยันรหัสผ่าน</p><input type="password" v-model="registerForm.confirm_pwd" required />
            </div>
         </section>
         <div class="form-group" style="display: grid;">
            <button class="btn btn-sm btn-primary btn-signup" type="submit">
               {{ buttonLabel }}
            </button>
         </div>
      </div>
   </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { ref } from 'vue'

const frappe = window.frappe;

window.disable_signup = false;

let buttonLabel = ref('Sign up');
let registerForm = reactive({
   fullname: "",
   nationality: "",
   race: "",
   birthdate: "",
   tel: "",
   email: "",
   address_no: "",
   address_moo: "",
   address_soi: "",
   address_road: "",
   address_district: "",
   address_amphur: "",
   address_province: "",
   pwd: "",
   confirm_pwd: "",
})

async function submit() {
   try {
      await checkEmailAndTel();
      if (buttonLabel.value == "Sign up" && checkPwd(registerForm)) {
         await Promise.all([signup(), register()]);
         await setOwner();
      }
   } catch (error) {
      console.error(error);
   }
}

async function signup() {
   return frappe.call("maechan.api.createUser", {
      ...registerForm
   });
}

async function register() {
   return frappe.call("maechan.api.register", {
      ...registerForm
   })
}

async function setOwner() {
   return frappe.call("maechan.api.setOwner", {
      ...registerForm
   })
}

async function checkEmailAndTel() {
   const emailResponse = await frappe.call("maechan.api.checkEmail", { ...registerForm });
   const telResponse = await frappe.call("maechan.api.checkTel", { ...registerForm });

   console.log(emailResponse.message,telResponse.message);
   
   if (emailResponse.message) {
      buttonLabel.value = "Email Already Registered";
   } else if (telResponse.message) {
      buttonLabel.value = "Telephone Already Registered";
   } else {
      buttonLabel.value = "Sign up";
   }
}

function checkPwd(registerForm) {
   if (registerForm.pwd == registerForm.confirm_pwd) {
      return true
   } else {
      alert("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบใหม่อีกครั้ง")
      return false
   }
}

</script>

<style>
input[type="text"],
input[type="email"],
input[type="date"],
input[type="tel"],
input[type="password"] {
   border: none;
   color: var(--text-color);
   background-color: var(--control-bg);
   margin-bottom: 1rem;
   height: 28px;
   width: -webkit-fill-available;
   border-radius: 8px;
}


#page-register {
   background-color: var(--bg-light-gray)
}

.page-card {
   padding: 25px 10px;
   background-color: #fff;
   max-width: 400px;
   margin: 0 auto;
   border-radius: var(--border-radius-md);
   border: 1px solid var(--border-color);
}

.form-group {
   padding-inline: 15px;
   margin: 0%;
}

.page-card p {
   font-size: var(--text-sm);
   font-weight: var(--weight-regular);
}

.page-card hr {
   padding-inline: 15px;
   margin: 0.5rem 0 1rem 0;
}

.page-card h3 {
   padding-inline: 15px;
}

.row {
   display: flex;
   flex-wrap: nowrap;
   margin: 0%;
   align-items: flex-end;
}

.col-30 {
   flex-basis: 0;
   flex-grow: 1;
   max-width: 33%;
}

.col-50 {
   flex-basis: 0;
   flex-grow: 1;
   max-width: 50%;
}

.col-75 {
   flex-basis: 0;
   flex-grow: 1;
   max-width: 75%;
}


.web-footer {
   display: none;
}
</style>