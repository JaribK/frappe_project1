<template>
    <div class="tw-flex">
        <div>
            <button v-if="signature" class="btn btn-default" @click="open_add_signature">Update Signature</button>
            <button v-else class="btn btn-default" @click="open_add_signature">Add Signature</button>

        </div>
        
        <div>
            <img style="width: 20rem;" v-if="signature" :src="signature.signature" />

        </div>

    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

let signature = ref(null)

onMounted(async () => {


    await load_signature();

})

let load_signature = async () => {
    let sig = await frappe.call("maechan.maechan_core.api.load_signature")
    console.log(sig)
    if (sig.count > 0) {
        signature.value = sig.message[0]
    }
}

let open_add_signature = () => {
    frappe.prompt({
        label: __("Update Signature"),
        fieldname: 'signature',
        fieldtype: 'AttachImage'
    }, async (values) => {
        let sig = await frappe.call("maechan.maechan_core.api.update_signature", {
            signature : values.signature
        })
        console.log(sig)
        signature.value = sig.message
    })

}
</script>