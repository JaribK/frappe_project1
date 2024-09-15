<script setup="ts">
import { Html5Qrcode } from "html5-qrcode";
import { ref, onMounted } from 'vue'
let isReady = ref(false)
let cameras = ref([])
let cameraIndex = ref(0)
let html5QrCode;
let reader = ref(null)
let isScanning = ref(false)
let isPreivew = ref(false)
let previewFrame = ref(false)
let iframeUrl = ref(null)

function isMobile() {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}


function loadCameras() {

  Html5Qrcode.getCameras().then(devices => {
    /**
     * devices would be an array of objects of type:
     * { id: "id", label: "label" }
     */
    if (devices && devices.length) {
      devices.forEach(element => {
        cameras.value.push(element)
      });
    }
    console.log(cameras.value)
    isReady.value = true;
    // startScan();
  }).catch(err => {
    // handle err
  });
}

onMounted(() => {
  loadCameras();
  console.log(reader)

})

async function loadIframe(result) {
  let iframe = document.getElementById(previewFrame.value.id)

  let doc = await frappe.get_doc("License", result.name)
  let content = await frappe.call("maechan.api.license_preivew", result)
  console.log(iframe)
  console.log(previewFrame)
  var frameDoc = iframe.document;
  if (iframe.contentWindow)
    frameDoc = iframe.contentWindow.document; // IE
  // Write into iframe
  frameDoc.open();
  frameDoc.writeln(content.message);
  frameDoc.close();
  isPreivew.value = true;
}

async function nextCamera() {
  if (html5QrCode != null) {
    try {
      await html5QrCode.stop();
    } catch (e) {

    }

  }

  cameraIndex.value++;
  cameraIndex.value = cameraIndex.value % cameras.value.length;
  startScan();
}

function startScan() {
  html5QrCode = new Html5Qrcode(reader.value.id);
  console.log(cameras, cameraIndex.value, cameras.value[cameraIndex.value]);
  isScanning.value = true;
  isPreivew.value = false;
  html5QrCode.start(

    cameras.value[cameraIndex.value].id,
    {
      fps: 10,    // Optional, frame per seconds for qr code scanning
      qrbox: { width: 400, height: 400 },  // Optional, if you want bounded box UI
      // videoConstraints: {
      //   facingMode: { exact: "environment" },
      // },
    },
    (decodedText, decodedResult) => {
      // do something when code is read
      isScanning.value = false
      result = JSON.parse(decodedResult.decodedText)
       loadIframe(result)
      // let url = `https://maechan.chaow.dev/api/method/frappe.utils.print_format.download_pdf?doctype=${result.type}&name=${result.name}&key=None`
      // iframeUrl.value = url
      // isPreivew.value = true;
      html5QrCode.stop();
    },
    (errorMessage) => {
      // parse error, ignore it.
    })
    .catch((err) => {
      // Start failed, handle it.
    });


}

</script>


<template>
  <div class="tw-flex tw-flex-col tw-w-full tw-text-center">
    <div>
      สำหรับตรวจสอบความถูกต้องของข้อมูลเท่านั้น
    </div>
    <div class="tw-w-full tw-text-center" v-if="isReady">
      <button class="tw-mr-3 tw-bg-blue-500 hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded"
        @click="startScan">Start Scan</button>
      <button class="tw-bg-blue-500 hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded"
        @click="nextCamera">Next Camera</button>

      <div ref="reader" id="reader" width="600px" v-show="isScanning"></div>

      <div class="tw-w-full tw-bg-gray-200"  v-show="isPreivew">
        <div class="print-preview tw-mx-auto tw-bg-white" style="min-width: 8.3in; max-width: 8.3in;height: 1122.23px;">
          <iframe :src="iframeUrl" ref="previewFrame" id="frame" class="print-format-container" width="100%" height="0"
            frameborder="0" scrolling="yes" style="height: 1122.23px;width:8.3in;">
          </iframe>
        </div>
      </div>
    </div>
  </div>
</template>
