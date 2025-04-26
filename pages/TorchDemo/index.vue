<template>
    <video class="container" ref="video" autoplay playsinline></video>
    <br />
    <button @click="toggleTorch" :disabled="!torchAvailable">
        {{ torchAvailable?torchActive ? '关闭手电筒' : '打开手电筒': ErrorMsg }}
    </button>
    <br />
    <NuxtLink to="/">返回</NuxtLink>
    <h2>设备信息</h2>
    <pre>{{ capabilitiesMsg }}</pre>
</template>
<script setup>

const torchActive = ref(false);
const torchAvailable = ref(true);
const ErrorMsg = ref();
const video = ref();
const capabilitiesMsg = ref();
const startVideo = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment',
                torch: false//此处可指定初始时打开还是关闭手电筒
            }
        });
        video.value.srcObject = stream;
        video.value.play();
        const track = video.value.srcObject.getVideoTracks()[0];
        if (track) {
            const capabilities = track.getCapabilities();
            capabilitiesMsg.value = capabilities;
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
    startVideo();
});
const toggleTorch = () => {
    torchActive.value = !torchActive.value;
    const track = video.value.srcObject.getVideoTracks()[0];
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
    max-width:300px;
    max-height:300px;
}
</style>