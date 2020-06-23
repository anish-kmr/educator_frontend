<template>
    <div id="parent">
        <div id="homepage" :class="{slideHome:loginVisible}">
            <div class="left-section section"></div>
            <div class="right-section section">
                <div class="controls">
                    <div class="login-btn">
                        <a @click="slidePage()">Login</a>
                        <i class="fas fa-arrow-right"></i>
                    </div>
                </div>
            </div>
            <!-- <div class="logo">
                <a href="#">Educator</a>
            </div> -->    
        </div>
        <div id="login" :class="{slideLogin:loginVisible}">
            <login :slidePage="slidePage"></login> 
        </div>
    </div>

</template>

<script>
import Login from '../components/Login.vue'
export default {
    data() {
        return {
            loginVisible:false
        }
    },
    components:{
        'login':Login
    },
    watch:{
        $route (to, from){
            console.log("from",from)
            if(to.path === "/") this.loginVisible = false;
            if(to.path === "/login") this.loginVisible = true;
        }
    } ,
    created() {
        if(this.$router.currentRoute.path == "/login") this.loginVisible = true
        else if(this.$router.currentRoute.path == "/") this.loginVisible = false
    },
    methods:{
        slidePage(){
            if(this.$router.currentRoute.path == "/login"){
                this.loginVisible = false
                this.$router.push('/')
            }
            else if(this.$router.currentRoute.path == "/"){
                this.loginVisible = true
                this.$router.push('/login')
            }
            
            // setTimeout(()=>{
            //     },1000)
        }
    }
}
</script>
<style scoped>
#parent{position: relative; width: 100vw;height: 100vh;overflow: hidden;}
.slideLogin{transform:translateX(0) !important;}
.slideHome{transform: translateX(-100vw) !important;}
#homepage{
    transition: 0.7s all ease-in-out;
    width: 100vw;
    height: 100vh;       
}
#login{
    transition: 0.7s all ease-in-out;
    transform: translateX(100vw);
    width: 100vw;
    height: 100vh;
    position: absolute;
    top:0;
}
.section{
    position: absolute;
    width: 100vw;
    height: 100vh;
}
.left-section{
    clip-path: polygon(0 0, 55% 0, 45% 100%, 0 100%);
    background-image: url('../assets/7.jpg');
    background-position: left;
    background-repeat: no-repeat;
    background-size: 56% 100%;
    background-color:#1277fb;
}
.right-section{
    clip-path: polygon(100% 0, 55% 0, 45% 100%, 100% 100%);
    background-color: #002486;
}

.controls{
    position: absolute;
    right:0rem;
    bottom:10%;
    padding: 1rem;
}
.login-btn{
    position: relative;
    display: flex;
    align-items: center;
    
}
.login-btn i{
    position: absolute;
    right: 3rem;
    margin-left: 2rem;
    margin-right: 2rem;
    color:#efefef;
    font-size: 3.5rem;
    animation: right 2s infinite;
    transition: .3s all;
}
.login-btn a{
    margin-right: 12rem;
    padding: 1rem 3rem;
    font-size: 3rem;
    color:#d6cece;
    border-radius:8px;
    background-color:#8f00ff ;
}
.login-btn:hover{
    cursor: pointer;
}
/* .login-btn a:hover ~ i{
    animation: none;
    cursor:pointer
} */


@keyframes right {
    from{right:3rem}
    15%{right:0rem}
    30%{right:3rem}
    45%{right:0}
    60%{right:3rem}
    100%{right:3rem}
}

</style>