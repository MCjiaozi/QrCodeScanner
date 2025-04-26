<template>
    <div ref="QrcodeContainer" class="container">
        <QrcodeStream :track="onTrack" :formats="selectedBarcodeFormats" :constraints="constraints">
        </QrcodeStream>
    </div>
    <button @click="toggleTorch" :disabled="!torchAvailable">
        {{ torchAvailable?torchActive ? '关闭手电筒' : '打开手电筒': ErrorMsg }}
    </button>
    <br />
    <NuxtLink to="/">返回</NuxtLink>
    <h2>扫码结果</h2>
    <div class="result" ref="result">
        <template v-for="(item, index) in CodeList" :key="index">
            <template v-for="(unit, indexOfUnit) in item" :key="indexOfUnit">
                <div>({{ index }} - {{ indexOfUnit }}){{ unit.rawValue }}</div>
            </template>
        </template>
    </div>
</template>
<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'
const result = ref();

const barcodeFormats = ref({
    'linear_codes': true,
    'qr_code': true
});

const selectedBarcodeFormats = computed(() => {
  return Object.keys(barcodeFormats.value).filter((format) => barcodeFormats.value[format])
})

const constraints = {
    width: { ideal: 10000 },
    height: { ideal: 10000 },
    frameRate: 60,
    facingMode: 'environment',
}

const CodeList = ref([]);

const onTrack = (detectedCodes) => {
    CodeList.value.push(detectedCodes);
    result.value.scrollTop = result.value.scrollHeight;
    console.log(detectedCodes);
}

const ErrorMsg = ref();
const torchActive = ref(false);
const torchAvailable = ref(true);
let track = null;
const startStream = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment',
                torch: false//此处可指定初始时打开还是关闭手电筒
            }
        });
        track = stream.getVideoTracks()[0];
        if (track) {
            const capabilities = track.getCapabilities();
            console.log(capabilities);
            if (!capabilities.torch) {
                torchAvailable.value = false;
                ErrorMsg.value = "设备不支持手电筒功能";
                console.warn("设备不支持手电筒功能");
            }
        }
    } catch (error) {
        console.error("无法开启相机: ", error);
        torchAvailable.value = false;
        ErrorMsg.value = "无法开启相机";
    }
}
onMounted(() => {
    startStream();
});
const toggleTorch = () => {
    torchActive.value = !torchActive.value;
    if (track) {
        track.applyConstraints({
            advanced: [{ torch: torchActive.value }]
        }).then(() => {
            console.log(`手电筒已${torchActive.value ? '打开' : '关闭'}`);
        }).catch((error) => {
            console.error("无法切换手电筒状态: ", error);
        });
    }
}
</script>
<style scoped>
.container{
    width:300px;
    height:300px;
}
.result{
    height:300px;
    width:100%;
    overflow-y: auto;
    border:1px solid #000000;
}
</style>