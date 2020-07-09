<template>
     <div class="doubts-area">
        <div class="doubt-header">
            <h3>Ask Your Doubts</h3>
        </div>
        <div class="doubt-body">
            <div :class="{received:doubt.senderId != user.uid, sent:doubt.senderId == user.uid,faculty_message:roomId==doubt.senderId}" v-for="doubt in conversation" :key="doubt.key"> 
                <div class="user-icon" v-if="doubt.senderId != user.uid ">
                    <img src="@/assets/student.jpg" alt="">
                </div>
                <div class="message">
                    {{doubt.message}}
                    <div class="message-details">
                        <span class="name">{{doubt.senderName | youfilter}}</span>
                    </div>
                </div>
            </div>
            
            <!-- <div class="sent" v-for="i in 3 " :key="i">
                <div class="message">I have a doubt.Plz answer? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore, quod! </div>
            </div> -->
        </div>
        <form class="doubt-input">
            <div class="input">
                <input type="text" v-model="doubt_text" placeholder="Answer Doubts here">
            </div>
            <button class="ask-btn" @click="ask_doubt"> 
                <i class="fas fa-comment-dots"></i>
            </button>
        </form>
    </div>
</template>

<script>
import { send_message,message_listener } from '../services/chat'
export default {
    props: ['roomId'],
    data(){
        return{
            role:"",
            user:null,
            conversation:[],
            doubt_text:"",
        }
    },
    filters:{
        youfilter(name){
            let user = JSON.parse(localStorage.getItem('user'))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
            if(name == user.displayName) return "You"
            else return name
        }
    },
    created() {
        this.role = localStorage.getItem('role')
        this.user = JSON.parse(localStorage.getItem('user'))  
        message_listener(this.roomId,this.update_conversation)
    },
    methods: {
        update_conversation(data){
            console.log("conv data",data)
            let doubt = data.val()
            doubt.key = data.key 
            this.conversation.push(doubt)
        },
        ask_doubt(ev){
            ev.preventDefault()
            if(this.doubt_text.trim() == "") alert("Message empty")
            else{
                send_message(this.roomId,this.user.uid,this.user.displayName,this.doubt_text)
                console.log("Sent doubt ",this.doubt_text)
                this.doubt_text=""
            }
        },  
    },

}
</script>

<style scoped>

.doubts-area{
    height: 100%;
    width: 100%;
}
.doubt-header{
    /* border-top-left-radius: 5px; */
    /* border-top-right-radius: 5px; */
    height: 3rem;
    padding: .5rem 1rem;
    font-size: 1.4rem;
    color:#cecece;
    background-color: #002486;
}
.doubt-body{
    width: 100%;
    height:calc(100% - 4rem);
    background-color: #dddddd;
    padding:1rem 0.5rem;
    padding-bottom: 2rem;
    overflow-y: auto;
}
.received{
    display: flex;
    margin-bottom: 1rem;
    padding-right: 2rem;
}
.user-icon{margin-right: .5rem;}
.user-icon img{
    border:1px solid #707070;
    vertical-align: bottom;
    border-radius: 50%;
    width: 25px;
    height: 25px;
}
.received .message,.sent .message{
    position: relative;
    font-size: 1.4rem;
    padding:.5rem 1rem;
    border-radius: 5px;
    border-top-left-radius: 0;
    color:#ececec;
    background-color: #002486;    
}

.sent{
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
    padding-left:3rem;
}
.sent .message{
    width: max-content;
    border-top-left-radius: 5px;
    border-top-right-radius: 0;
    background-color: #a8a8a8;
    color: #333333;
}

.faculty_message .message{
    background-color: #eb4a00 !important;
    color:#ececec
}
.sent .message-details .name{
    color:#5f5c5c;
    font-size: 1.2rem;
}
.received .message-details .name{
    color:#a8a8a8;
    font-size: 1.2rem;
}
.faculty_message .message-details .name{
    color:#d8d8d8;
}

/* .received .message::before{
    content: "";
    position: absolute;
    top:0;
    left:0px;
    transform: translateX(-100%);
    width: 0px;
    height: 0px;
    border:3px solid transparent;
    border-top: 3px solid #002486;
    border-right: 3px solid #002486;
    
} */

.doubt-input{
    position: absolute;
    width: 100%;
    height: 4rem;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #dddddd;
}
.input{width: 85%;}
.input input{
    padding:.5rem .5rem;
    width: 100%;
    /* background-color: #e6e6e6; */
}
.ask-btn{
    padding:0rem .5rem;
    padding-left: 1rem;
}
.ask-btn i{
    font-size: 2rem;
    color:#002486
}



</style>