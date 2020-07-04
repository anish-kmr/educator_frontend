<template>
    <div class="container"> 
                
        <div class="faculty-area">
            <div class="faculty-stream" :class="{novideo:novideo}">
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
               
               <div class="option" @click="toggle_audio">
                   <div class="icon">
                       <i class="fa fa-microphone" aria-hidden="true"  v-if="!audio_muted"></i>
                       <i class="fa fa-microphone-slash" aria-hidden="true" v-else></i>
                   </div>
                   <div class="text">
                       <template v-if="!audio_muted"> Mute Audio </template>
                       <template v-else> Unmute Audio </template>
                   </div>
               </div>
               <div class="option" @click="toggle_screen_share" >
                   <div class="icon">
                       <i class="fa fa-desktop" aria-hidden="true"></i>
                   </div>
                   <div class="text">
                       Share Screen
                   </div>
               </div>
               <!-- <label class="option" @click="embed_material">
                   <div class="icon">
                       <i class="fas fa-file-pdf"></i>
                   </div>
                   <div class="text">
                       Open Materal
                       <input type="file" style="display:none" id="source" @change="embed_material">
                   </div>
               </label> -->
               <div class="option end-lecture-option" @click="end_lecture">
                   <div class="icon">
                        <i class="fas fa-sign-out-alt"></i>
                   </div>
                   <div class="text">
                       End Lecture
                   </div>
               </div>
            </div>
        </div>
        <div class="doubt-area"></div>

        <div class="all-students" :class="{all_students_shown:all_students_shown}">
            <div class="show-all-students" :class="{hidden:all_students_shown}"  @click="all_students_shown=!all_students_shown">
                <div class="icon">
                    <i class="fas fa-chevron-left"></i>
                </div>
            </div>
            <div class="students-video">
                <div class="student" v-for="(obj,id) in connections" :key="id">
                    <div class="name">{{id}}</div>
                    <video :src-object.prop.camel="obj.remoteStream" autoplay ></video>
                </div>
            </div>
             <div class="hide-all-students" :class="{hidden:!all_students_shown}" @click="all_students_shown=!all_students_shown">
                <div class="icon">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { 
    create_room, 
    upload_faculty_ice_candidate,
    upload_offer,
    participant_listener,
    add_participant_ice_candidate_listener,
    send_video_mute_event,
    send_audio_mute_event,
    delete_room
} from '../services/video_calling'
export default {
    data() {
        return{
            material_src:"",
            material_open:true,
            all_students_shown:false,
            novideo:true,
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
            local_video_track:null,
            local_audio_track:null,
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
            // this.open_webcam(true)
        this.faculty = JSON.parse(localStorage.getItem('user'))
        this.screen_share = JSON.parse(localStorage.getItem('screen_share'))
        this.video_muted = JSON.parse(localStorage.getItem('video_muted'))
        this.audio_muted = JSON.parse(localStorage.getItem('audio_muted'))
        if(!this.video_muted) await this.open_webcam(this.audio_muted)
        if(this.screen_share) await this.share_screen(this.audio_muted)
       console.log("testing")
        await create_room(this.faculty.uid,this.faculty.displayName,this.subject,this.batch,this.year,"9:00","9:50")   
        send_video_mute_event(this.faculty.uid,this.video_muted&&this.screen_share)
        send_audio_mute_event(this.faculty.uid,this.audio_muted)

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
            console.log("adding remote ice candidates")
            await this.connections[participantId].pc.addIceCandidate(new RTCIceCandidate(candidate));
        },
        async add_participants(participantId,data){
            console.log("Adding Participant...",data)
            
            this.connections[participantId] = {pc:this.pc,remoteStream:new MediaStream()}
            this.connections[participantId].pc.addEventListener('track', event => {
                console.log('Got remote track from ',participantId);
                event.streams[0].getTracks().forEach(track => {
                    console.log('Add a track to the remoteStream:');
                    this.connections[participantId].remoteStream.addTrack(track);
                });
            })
            await this.connections[participantId].pc.setRemoteDescription(new RTCSessionDescription(data.answer))

            await add_participant_ice_candidate_listener(this.faculty.uid,participantId,this.add_participant_ice_candidates)

            this.pc = await this.newPeerConnection()

            console.log("Participant Added...")
        },
        async add_participants_listener(){
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
                    console.log('Got candidate: ');
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
                    this.local_video_track = this.localStream.getVideoTracks()[0]
                    await pc.addTrack(track,this.localStream)
                })
            }
        },
        async open_webcam(audio_muted){
            localStorage.setItem('video_muted',false)
            this.localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:!audio_muted})
            this.novideo = false
        },
        async share_screen(audio_muted){
            console.log("Sharing screem")
            this.screenStream = await navigator.mediaDevices.getDisplayMedia({video:true,audio:!audio_muted})
        },
        close_webcam(){
            this.localStream.getTracks().forEach(track=>{track.stop()})
            if(this.screen_share) this.screenStream.getTracks().forEach(track=>{track.stop()})
            this.localStream = null
            this.screenStream = null
        },

        async toggle_video(){
            this.video_muted = !this.video_muted
            if (!this.video_muted){ 
                this.localStream.addTrack(this.local_video_track)
                this.novideo = false
                for(let pid in this.connections){

                    this.connections[pid].pc.getSenders().forEach(sender=>{
                        sender.replaceTrack(this.local_video_track)
                    })
                }
                send_video_mute_event(this.faculty.uid,false)
            }
            else{
                this.local_video_track = this.localStream.getVideoTracks()[0]
                this.localStream.removeTrack(this.local_video_track)
                this.novideo = true
                for(let pid in this.connections){
                    this.connections[pid].pc.getSenders().forEach(sender=>{
                        if(sender.track.kind =="video"){
                            this.connections[pid].pc.removeTrack(sender)
                            console.log("removed video track")
                        }
                    })
                }
                send_video_mute_event(this.faculty.uid,true)
            }
        },
        async toggle_audio(){
            this.audio_muted = !this.audio_muted
            if (!this.audio_muted){ 
                this.localStream.addTrack(this.local_audio_track)
                for(let pid in this.connections){

                    this.connections[pid].pc.getSenders().forEach(sender=>{
                        sender.replaceTrack(this.local_audio_track)
                    })
                }
                send_audio_mute_event(this.faculty.uid,false)
            }
            else{
                this.local_audio_track = this.localStream.getAudioTracks()[0]
                this.localStream.removeTrack(this.local_audio_track)

                for(let pid in this.connections){
                    this.connections[pid].pc.getSenders().forEach(sender=>{
                        if(sender.track.kind =="audio"){
                            this.connections[pid].pc.removeTrack(sender)
                            console.log("removed audio track")
                        }
                    })
                }
                send_audio_mute_event(this.faculty.uid,true)
            }
        },
        async toggle_screen_share(){
            this.screen_share = !this.screen_share
            console.log("Sharing screen ? ",this.screen_share)
            if(this.screen_share){
                await this.share_screen(this.audio_muted)
                console.log("Inside ",this.connections)
                for(let pid in this.connections){
                    this.connections[pid].pc.getSenders().forEach(sender=>{
                        console.log("sender",sender)
                        if(sender.track.kind == "video"){
                            sender.replaceTrack(this.screenStream.getVideoTracks()[0])
                        }
                    })
                }
            
            }
            else{
                for(let pid in this.connections){
                    this.connections[pid].pc.getSenders().forEach(sender=>{
                        if(sender.track.kind == "video"){
                            sender.replaceTrack(this.local_video_track)
                        }
                    })
                }
            }
        },
        async end_lecture(){
            let ended = await delete_room(this.faculty.uid)
            this.local_video_track = null
            this.local_audio_track = null
            this.close_webcam()
            for(let pid in this.connections){
                this.connections[pid].remoteStream.getTracks().forEach(track=>{track.stop()})
                this.connections[pid].pc.close()
            }
            console.log("conns",this.connections)
            
        }
       
    }
}
</script>
<style  scoped>
.container{
    height: 100%;
    position: relative;
    overflow-y: hidden;
    overflow-x: hidden ;
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

/* .novideo{background-color: #707070 !important;} */
/* .novideo video{display:none} */

.stream-controls  {
    position: absolute;
    bottom:0;
    left: 0;
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
    bottom: 100%;
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
.toggle-tray i,.show-all-students i,.hide-all-students i{
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
.end-lecture-option i,.end-lecture-option .text{
    color:#da4242
}
.option:hover{
    cursor: pointer;
}
.all-students{
    position: absolute;
    top:0;
    left : 100%;
    /* min-width: 30rem; */
    max-width: 100%;
    width: max-content;
    height: 100%;
    background-color: #242424f1;
    transition: .7s transform ease-in-out;
    padding:1rem  0rem;
}
.show-all-students,.hide-all-students{
    position: absolute;
    top:50%;
    left:0;
    padding: 1rem .25rem;
    background-color: #002486a6 ;
    transform: translate(-100%,-50%);
}
.hide-all-students{left:100%}
.all_students_shown{
    transition: transform .7s;
    transform: translateX(-100%) !important;
}

.students-video{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}
.student{
    max-width:25rem;
    position: relative;
    margin:.5rem; 
    /* outline: 2px solid red; */
    /* background-color: #2163af; */
}
.student .name{
    position: absolute;
    bottom:0;
    left:0;
    background-color: #002486a6;
    color:#ececec;
    width: 100%;
    text-align: center;
    padding: .25rem 0;
    font-size: 1.6rem;
}
.left i{
    animation: .4s rotate_left forwards !important;
}
.right i {
    /* transition: .4s transform; */
    animation: .4s rotate_right  forwards !important;
}
.student video{
    /* outline: 2px solid red; */
    height: 100%;  
    width: 100%;
    object-fit: fill;   
}

.hidden{display: none !important;}

@keyframes rotate_right{
    from{transform:rotateY(0deg)}
    to{transform:rotateY(180deg)}
}
@keyframes rotate_left{
    from{transform:rotateY(180deg)}
    to{transform:rotateY(0deg)}
}
</style>