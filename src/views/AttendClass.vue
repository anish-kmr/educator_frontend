<template>
    <div class="container">
        <div class="faculty-area">
            <div class="faculty-stream" :class="{novideo:novideo}">
                <video :src-object.prop.camel="remoteStream" autoplay ></video>
            </div>
        </div>
        <div class="chat-box">
            <chat-box :roomId="roomId" />
        </div>
        <div class="student-area">
            <div class="student-stream">
                <video :src-object.prop.camel="localStream" autoplay ></video>
            </div>
        </div>
    </div>
</template>
<script>
import ChatBox from '../components/ChatBox.vue'
import {
    get_offer,
    upload_participant,
    add_faculty_ice_candidates_listener,
    upload_student_ice_candidate,
    listen_video_mute_event,
    listen_audio_mute_event
} from '../services/video_calling'

import { send_message,message_listener } from '../services/chat'
export default {
    data(){
        return{
            roomId:"",
            conversation:[],
            doubt_text:"",
            novideo:true,
            student:{},
            student_peer:null,
            remoteStream: new MediaStream(),
            localStream:null,
            remote_video_track:null,
            remote_audio_track:null,
            lecture:{
                facultyName:"Anish",
                facultyId:"MRn5Kga60tUwKGrrfsyKerwbcJ03",
                subject:"Maths",
                startTime:"9:00",
                endTime:"9:50",
                batch:"B1",
                year:1
            },
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
    components:{
        'chat-box':ChatBox
    },
    filters:{
        youfilter(name){
            let student = JSON.parse(localStorage.getItem('user'))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
            if(name == student.displayName) return "You"
            else return name
        }
    },
    async created() {
        this.remoteStream.onremovetrack = (ev)=>{
            console.log("track removed")
        }
        this.remoteStream.onaddtrack = (ev)=>{
            console.log("track added")
        }
        this.remoteStream.onactive = (ev)=>{
            console.log("track active")
        }
        this.remoteStream.oninactive = (ev)=>{
            console.log("track inactive")
        }
        this.roomId = this.lecture.facultyId
        this.student = JSON.parse(localStorage.getItem('user'))
        await this.open_webcam()
        await message_listener(this.lecture.facultyId,this.update_conversation)
        
        
        this.student_peer = await new RTCPeerConnection(this.configuration)
        await this.add_track()
        let offer = await get_offer(this.lecture.facultyId)
        console.log("offer")
        await this.add_ice_candidates_listener()
        await this.add_track_listener()

        await this.student_peer.setRemoteDescription( new RTCSessionDescription(offer))
        let answer = await this.student_peer.createAnswer()
        await this.student_peer.setLocalDescription(answer)
        await upload_participant(this.lecture.facultyId,this.student,answer)
        await add_faculty_ice_candidates_listener(this.lecture.facultyId,this.add_faculty_ice_candidates)

        
    },
    methods: {
        update_conversation(data){
            console.log("conv data",data)
            let doubt = data.val()
            doubt.key = data.key 
            this.conversation.push(doubt)
        },
        ask_doubt(){
            if(this.doubt_text.trim() == "") alert("Message empty")
            else{
                send_message(this.lecture.facultyId,this.student.uid,this.student.displayName,this.doubt_text)
                console.log("Sent doubt ",this.doubt_text)
            }
        },
        toggle_host_video(ismute){
            console.log("toggliong host video",ismute)
            if (ismute){
                this.remote_video_track = this.remoteStream.getVideoTracks()[0]
                this.remoteStream.removeTrack(this.remote_video_track)
                this.novideo = true
            }else{
                if(this.remote_video_track) this.remoteStream.addTrack(this.remote_video_track)
                this.novideo=false
            }
        },
        toggle_host_audio(ismute){
            console.log("toggliong host video",ismute)
            if (ismute){
                this.remoteStream.getTracks().forEach(track=>{
                    if(track.kind === "audio") track.stop()
                    
                })
            }
        },
        async add_faculty_ice_candidates(candidate){
            console.log('Adding remote ice candidate');
            await this.student_peer.addIceCandidate(new RTCIceCandidate(candidate));
        },
        async add_track_listener() {
            listen_video_mute_event(this.lecture.facultyId,this.toggle_host_video)
            listen_audio_mute_event(this.lecture.facultyId,this.toggle_host_audio)
            this.student_peer.addEventListener('track', event => {
                console.log('Got remote track:');
                event.streams[0].getTracks().forEach(track => {
                    track.addEventListener('ended',()=>{
                        console.log("Ended")
                    })
                    console.log('Add a track to the remoteStream:',track);                   
                    this.remoteStream.addTrack(track);
                });
                this.novideo = false
            });
        },
        async add_ice_candidates_listener(){
            this.student_peer.addEventListener('icecandidate',async event=>{
                if (!event.candidate) {
                    console.log('Got final candidate!');
                    return;
                }
                console.log('Got candidate: ');
                await upload_student_ice_candidate(this.lecture.facultyId,this.student.uid,event.candidate.toJSON())
            })
        },
        async add_track(){
            this.localStream.getTracks().forEach(track =>{
                console.log("Adding track to localstream")
                this.student_peer.addTrack(track,this.localStream)
            })
        },
        async open_webcam(){
            this.localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:true})
        },

        close_webcam(){
            this.localStream.getTracks().forEach(track=>{track.stop()})
            this.localStream = null
        }
    }
}
</script>
<style scoped>
.container{
    height: 100%;
    position: relative;
    overflow-y: hidden;
}
.faculty-area{
    width: 75%;
    height: calc(100% - 1rem);
    background-color: #707070;
    position: relative;
}
.faculty-stream{
    height: 100%;
    width: 100%;
}
.novideo{background-color: #707070 !important;}
.novideo video{display:none}

.faculty-stream video{
    height: 100%;
    width: 100%;
    object-fit: fill;
}
.student-area{
    position: absolute;
    bottom:1rem;
    right:0;
    margin: 0 .5rem;
    width:calc(25% - 1rem);
    height:30%;
    background-color: #ececec;
}

.student-stream{
    height: 100%;
    width: 100%;
}
.student-stream video{
    height: 100%;
    width: 100%;
    object-fit: fill;
}
.chat-box{
    position: absolute;
    top:0;
    right:.5rem;
    z-index: 99999;
    height: calc(70% - 2rem);
    width: calc(25% - 1rem);
}


</style>