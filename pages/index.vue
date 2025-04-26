<template>
    <div ref="QrcodeContainer" class="container">
        <QrcodeStream :track="onTrack" :formats="selectedBarcodeFormats" :constraints="constraints" :torch="torchActive">
        </QrcodeStream>
    </div>
    <button @click="torchActive = !torchActive">
        {{ torchActive ? '关闭' : '打开' }}手电筒
    </button>
    <br />
    <NuxtLink to="/TorchDemo">手电筒Demo</NuxtLink>
    <br />
    <NuxtLink to="/FullDemo">扫码+手电筒Demo</NuxtLink>
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
const onTrack = (detectedCodes) => {
    CodeList.value.push(detectedCodes);
    result.value.scrollTop = result.value.scrollHeight;
    console.log(detectedCodes);
}

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

const torchActive = ref(false);
const CodeList = ref([]);
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