<template>
    <div class="container"> 
        <div class="faculty-area">
            <button @click="fun()" >test</button>
        </div>
        <div class="student-area"></div>
        <div class="doubt-area"></div>
    </div>
</template>
<script>
import { test } from '../services/video_calling'
export default {
    
    methods: {
        async fun(){
            await test()
        }
    }
}
</script>
<style  scoped>
.container{
    height: 100%;
    position: relative;
}
.faculty-area{
    width: 75%;
    height: 90%;
    background-color: #707070;
}

.student-area{
    position: absolute;
    bottom:10%;
    right:0;
    width:24%;
    height:25%;
    background-color: #ececec;
}
</style>