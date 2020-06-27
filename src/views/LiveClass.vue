<template>
    <div class="container"> 
        <div class="faculty-area">
            <div class="faculty-stream">
                <video :src-object.prop.camel="localStream" autoplay  :audio_muted="audio_muted"></video>
            </div>
            <div class="stream-controls">
                <div class="toggle-tray">
                   <div class="icon">
                       <i class="fas fa-chevron-up"></i>
                   </div>
               </div>
               <div class="option" @click="toggle_video">
                   <div class="icon">
                       <i class="fas fa-video" v-if="!video_muted"></i>
                       <i class="fas fa-video-slash" v-else></i>
                   </div>
                   <div class="text">
                       <template v-if="!video_muted"> Mute Video</template>
                       <template v-else> Unmute Video</template>
                   </div>
               </div>
               
               <div class="option" @click="audio_muted=!audio_muted">
                   <div class="icon">
                       <i class="fa fa-microphone" aria-hidden="true"  v-if="!audio_muted"></i>
                       <i class="fa fa-microphone-slash" aria-hidden="true" v-else></i>
                   </div>
                   <div class="text">
                       <template v-if="!audio_muted"> Mute Audio </template>
                       <template v-else> Unmute Audio </template>
                   </div>
               </div>
               <div class="option">
                   <div class="icon">
                       <i class="fa fa-desktop" aria-hidden="true"></i>
                   </div>
                   <div class="text">
                       Share Screen
                   </div>
               </div>
               <div class="option">
                   <div class="icon">
                       <i class="fas fa-file-pdf"></i>
                   </div>
                   <div class="text">
                       Open Materal
                   </div>
               </div>
               <div class="option">
                   <div class="icon">
                        <i class="fas fa-sign-out-alt"></i>
                   </div>
                   <div class="text">
                       End Lecture
                   </div>
               </div>
            </div>
        </div>
        <div class="student-area"></div>
        <div class="doubt-area"></div>
    </div>
</template>
<script>
import { 
    create_room, 
    upload_faculty_ice_candidate,
    upload_offer,
    participant_listener,
    add_participant_ice_candidate_listener
} from '../services/video_calling'
export default {
    data() {
        return{
            pc:"",
            faculty:{},
            subject:"Maths",
            batch:"B1",
            year:1,
            screen_share:"",
            webcam:"",
            audio_muted:"",
            video_muted:"",
            localStream:"",
            screenStream:"",
            connections:{},
            faculty_peer:"",
            configuration : {
                iceServers: [
                    {
                    urls: [
                        'stun:stun1.l.google.com:19302',
                        'stun:stun2.l.google.com:19302',
                    ],
                    },
                ],
                iceCandidatePoolSize: 3,
            },

        }
    },
    async created() {
        this.faculty = JSON.parse(localStorage.getItem('user'))
        this.screen_share = JSON.parse(localStorage.getItem('screen_share'))
        this.video_muted = JSON.parse(localStorage.getItem('video_muted'))
        this.audio_muted = JSON.parse(localStorage.getItem('audio_muted'))
        if(!this.video_muted) await this.open_webcam(this.audio_muted)
        if(this.screen_share) await this.share_screen(this.audio_muted)
       console.log("testing")
        await create_room(this.faculty.uid,this.faculty.displayName,this.subject,this.batch,this.year,"9:00","9:50")   

        this.pc = await this.newPeerConnection()
        await this.add_participants_listener()
      
    },
    methods: {
        async newPeerConnection(){
            let pc = new RTCPeerConnection(this.configuration)
            await this.add_tracks(pc)
            await this.add_ice_candidates_listener(pc)
            await this.create_offer(pc)
            return pc
        },
        async add_participant_ice_candidates(participantId,candidate){
            console.log("adding remote ice candidates",candidate)
            await this.connections[participantId].pc.addIceCandidate(new RTCIceCandidate(candidate));
        },
        async add_participants(participantId,data){
            console.log("Adding Participant...",data)
            
            this.connections[participantId] = {pc:this.pc,remoteStream:new MediaStream()}
            this.connections[participantId].pc.addEventListener('track', event => {
                console.log('Got remote track from ',participantId);
                event.streams[0].getTracks().forEach(track => {
                    console.log('Add a track to the remoteStream:', track);
                    this.connections[participantId].remoteStream.addTrack(track);
                });
            })
            await this.connections[participantId].pc.setRemoteDescription(new RTCSessionDescription(data.answer))

            await add_participant_ice_candidate_listener(this.faculty.uid,participantId,this.add_participant_ice_candidates)

            this.pc = await this.newPeerConnection()

            console.log("Participant Added...")
        },
        async add_participants_listener(){
            console.log("Adddi ng listerner")
            await participant_listener(this.faculty.uid,this.add_participants)
            
        },
        async create_offer(pc){
            let offer = await pc.createOffer({offerToReceiveAudio: 1,offerToReceiveVideo: 1})
            await pc.setLocalDescription(offer)
            await upload_offer(this.faculty.uid,offer)
        },
        async add_ice_candidates_listener(pc){
            if(Object.keys(this.connections).length == 0){
                pc.addEventListener('icecandidate',async event => {
                    if (!event.candidate) {
                        console.log('Got final candidate!');
                        return;
                    }
                    console.log('Got candidate: ',event.candidate.toJSON());
                    await upload_faculty_ice_candidate(this.faculty.uid,event.candidate.toJSON())
                });
            }
        },
        async add_tracks(pc){
           if(this.screen_share){
                this.screenStream.getTracks().forEach(async track=>{
                   await pc.addTrack(track,this.screenStream)
                })
            }
            else if(!this.video_muted){
                this.localStream.getTracks().forEach(async track=>{
                    await pc.addTrack(track,this.localStream)
                })
            }
        },
        async open_webcam(audio_muted){
            localStorage.setItem('video_muted',false)
            this.localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:!audio_muted})
        },
        async share_screen(audio_muted){
            console.log("Sharing screem")
            this.screenStream = await navigator.mediaDevices.getDisplayMedia({video:true,audio:!audio_muted})            
        },
        close_webcam(){

            localStorage.setItem('webcam',false)
            this.localStream.getTracks().forEach(track=>{track.stop()})
            this.localStream = null
        },

        async toggle_video(){
            this.video_muted = !this.video_muted
            if (!this.video_muted){ 
                let stream = await navigator.mediaDevices.getUserMedia({video:true,audio:!this.audio_muted})
                this.localStream = stream.clone()

                this.localStream.getTracks().forEach(track=>{
                    console.log(track)
                })
            }
            else{
                this.localStream.getTracks().forEach(track=>{
                    if(track.kind == "video") track.stop()
                })
                this.localStream.getTracks().forEach(track=>{
                    console.log(track)
                })
            }
         }
    }
}
</script>
<style  scoped>
.container{
    height: 100%;
    position: relative;
    overflow-y: hidden;
}
.faculty-area{
    width: 75%;
    height: 100%;
    background-color: #707070;
    position: relative;
}
.faculty-stream{
    height: 100%;
    width: 100%;
}
.faculty-stream video{
    height: 100%;
    width: 100%;
    object-fit: fill;
}

.stream-controls  {
    position: absolute;
    bottom:0;
    left: 0;
    height: 10%;
    width: 100%;
    transform: translateY(100%);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    transition: .2s transform;
}
.toggle-tray{
    position: absolute;
    bottom: 99%;
    left:50%;
    transform: translateX(-60%);
    padding:.25rem 1rem;
    background-color: #00248654;
}
.stream-controls::after{
    position: absolute;
    content: "";
    width: 100%;
    height:5px;
    bottom:100%;
    left:0;
}
.toggle-tray i{
    font-size: 2rem !important;
    transition: .6s transform;
}
.stream-controls:hover{
    transition: .3s transform;
    transform: translateY(0);
}
.stream-controls:hover .toggle-tray i{
    transition: .6s transform;
    transform: rotateX(180deg);
}
.option{
    background-color: #00248654;
    padding: 0.25rem 4rem;
    /* border-right: 2px solid #757575; */
}
.option .icon{
    text-align: center;
    /* height: 3.5rem; */
}
.icon i{
    color: #ffffff;
    font-size: 3.5rem;
}
.option .text{
    color: #ffffff;
    width: 100%;
    font-size: 1.6rem;
    
}
.option:hover{
    cursor: pointer;
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