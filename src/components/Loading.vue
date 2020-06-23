<template>
    <!-- <div> -->
        <loading :active.sync="isLoading" 
        :can-cancel="false" 
        :color="color"
        :height="height"
        :width="width"
        :loader="loader"
        :opacity ="opacity"
        :background-color="background_color"
        :is-full-page="true"></loading>
    <!-- </div> -->
</template>

<script>

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
export default {
    props: ['isLoading'],
    // name: 'loading',
    data() {
        return { 
            height:150,
            width:150,
            loader:"bars",
            opacity:0.7,
            background_color:"#2c2c2c",
            color:"#002486"
       }    
    },
    components: { 'loading':Loading }
}
</script>

<style lang="">
    .class{
        color:#2c2c2c;
    }
</style>