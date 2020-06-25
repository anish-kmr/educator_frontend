<template>
    <div class="container">
        <div class="info">
            <div class="info-text">
                <p> You can start Class 5 minutes prior to scheduled time. The class can go upto maximum 5 minutes after scheduled end time.
                    <br>Plan your lectures accordingly.</p>
            </div>
            <div class="info-controls">
                <div class="options">
                    <div class="form-group">
                        <label class="label" for="webcam">
                            <div class="label-text">
                                <h4>Start by Webcam feed</h4>
                            </div>
                            <div class="radio-container">
                                <input type="radio" id="webcam" value="webcam" v-model="video_type">
                                <span class="custom-radio"></span>
                            </div>
                        </label>
                    </div>
                    <div class="form-group">
                        <label class="label" for="screen-share">
                            <div class="label-text">
                                <h4>Start by screen share</h4>
                            </div>
                            <div class="radio-container">
                                <input type="radio" id="screen-share" value="screen-share" v-model="video_type">
                                <span class="custom-radio"></span>
                            </div>
                        </label>
                        
                        
                    </div>
            
                    <div class="form-group">
                         <label class="label" for="audio-type">
                            <div class="label-text">
                                <h4>Mute Audio</h4>
                            </div>
                            <div class="checkbox-container">
                                <input type="checkbox"  id="audio-type">
                                <span class="custom-checkbox"></span>
                            </div>
                        </label>
                    </div>
                </div>
                <button >Start Lecture</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            video_type:"webcam",
            audio_type:"",
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