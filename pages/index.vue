<template>
    <div ref="QrcodeContainer" class="fullscreen">
        <QrcodeStream :track="onTrack" :formats="selectedBarcodeFormats" :constraints="constraints">
        </QrcodeStream>
    </div>
</template>
<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'

const onTrack = (detectedCodes) => {
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
</script>
<style scoped>
.fullscreen{
    position:fixed;
    left:0;
    right:0;
    top:0;
    bottom:0;
}
</style>