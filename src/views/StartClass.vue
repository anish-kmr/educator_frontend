<template>
    <div class="container">
        <div class="info">
            <div class="info-text">
                <p v-if="role =='faculty'">  
                    You can start Class 5 minutes prior to scheduled time. The class can go upto maximum 5 minutes after scheduled end time.
                    <br>
                    Plan your lectures accordingly.
                </p>
            </div>
            <div class="info-controls">
                <div class="options" v-if="role =='faculty'">
                    <div class="form-group">
                        <label class="label" for="webcam">
                            <div class="label-text">
                                <h4>Start by Webcam feed</h4>
                            </div>
                            <div class="checkbox-container">
                                <input type="checkbox" id="webcam" v-model="webcam">
                                <span class="custom-checkbox"></span>
                            </div>
                        </label>
                    </div>
                    <div class="form-group">
                        <label class="label" for="screen-share">
                            <div class="label-text">
                                <h4>Start by screen share</h4>
                            </div>
                            <div class="checkbox-container">
                                <input type="checkbox" id="screen-share" v-model="screen_share">
                                <span class="custom-checkbox"></span>{{screen_share}}
                            </div>
                        </label>
                        
                        
                    </div>
            
                    <div class="form-group">
                         <label class="label" for="audio-type">
                            <div class="label-text">
                                <h4>Mute Audio</h4>
                            </div>
                            <div class="checkbox-container">
                                <input type="checkbox"  id="audio-type" v-model="audio_muted">
                                <span class="custom-checkbox"></span>
                            </div>
                        </label>
                    </div>
                </div>
                <button @click="start_lecture" v-if="role =='faculty'">Start Lecture</button>
                <button @click="attend_lecture" v-if="role =='student'">Attend Lecture</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            role:"",
            webcam:true,
            screen_share:false,
            audio_muted:false,
        }
    },
    created(){
        this.role = localStorage.getItem('role')
    },
    methods:{
        start_lecture(ev){
            ev.preventDefault();
            localStorage.setItem('video_muted',!this.webcam)
            localStorage.setItem('screen_share',this.screen_share)
            localStorage.setItem('audio_muted',this.audio_muted)
            this.$router.push('/dashboard/class')
        },
        attend_lecture(ev){
            ev.preventDefault()
            this.$router.push('/dashboard/attend')
        }
    }
}
</script>

<style scoped>
.container{
    height: 100%;
    background-color: #d3daee;
    position: relative;
}
.info{
    position: absolute;
    top:40%;
    left:50%;
    text-align: center;
    transform: translate(-50%,-50%);
}
.info-text p{
    color: #a0a0a0;
    text-align: center;
    font-size: 2rem;
}
.info-controls{
    margin-top: 3rem;
}
.options{
    /* outline: 2px solid red; */
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}
.form-group{
    position: relative;
    padding-left: 2.4rem;
    /* padding-top: .2rem; */
}
.form-group label h4{
    font-size: 1.6rem;
}

.info-controls button{
    margin-top: 2rem;
    padding: 1rem 2rem;
    background-color: #002486;
    color:white;
    font-size: 1.6rem;
}
</style>