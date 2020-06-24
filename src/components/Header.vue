<template>
    <div id="header" class="logged_in" >

        <div class="nav">
            <ul>
                <li>
                    <h4>{{user.displayName}}</h4>
                </li>
                <li>
                    <div class="profile-icon" @click="toggleDrop">
                        <img src="../assets/student.jpg" alt="">
                    </div>
                    <transition name = "slide">
                    <div class="profile-dropdown" v-if="dropped">
                        <ul>
                            <li>
                                <div class="drop-icon">
                                    <i class="fas fa-cog"></i>
                                </div>
                                <h2>Settings</h2>
                            </li>
                            <li>
                                <div class="drop-icon">
                                    <i class="fas fa-sign-out-alt"></i>
                                </div>
                                <h2 @click="logout">Logout</h2>
                            </li >
                        </ul>
                    </div>
                    </transition>
                </li>
            </ul>
        </div>
       
        
        
    </div>
    
</template>


<script>
export default {
    data(){
        return{
            user:{},
            role:"",
            dropped:false,
        }
    },
    created(){
        this.user = JSON.parse(localStorage.getItem('user'))
        this.role =  localStorage.getItem('role')
        
    },
    methods: {
        logout(){
            localStorage.clear()
            this.$router.push("/")
        },
        toggleDrop(){
            this.dropped=!this.dropped;
        }
    },
}
</script>

<style scoped>

#header{
    position: relative;
    min-height: 40px;
    height: 6vh;
    width: 100%;
    border-bottom: 2px solid #e2e2e2;
}

.nav{
    display: inline-block;
    position: absolute;
    right:0;
    height: 100%;
    font-size: 2rem;
    font-weight: bolder;
    margin-right: 1rem;
    
}
.nav>ul{
    height: 100%;;
    display: grid;
    grid-template-columns: repeat(4,max-content);
}
.nav>ul>li{
    margin-right: 1.5rem;
}
.nav>ul>li>h4,.profile-icon{
    position: relative;
    top:55%;
    transform:translateY(-50%);
    color: #2e2e2e;
}
.nav>ul li:hover{
    cursor: pointer;
    
}

.profile-icon img{
    border:1px solid #707070;
    vertical-align: bottom;
    border-radius: 50%;
    width: 30px;
    height: 30px;

}
.profile-dropdown{
    transition: .3s all;
    position: absolute;
    top: 100%;
    right:0px;
    transform: translateY(8px);
    background-color: #707070;
    min-width: 150px;
    border-radius: 5px;
    padding:.4rem;
    z-index: 999;
}
.profile-dropdown::before{
    content:"";
    position: absolute;
    width:0px;
    height:0px;
    border:10px solid  transparent;
    border-bottom: 12px solid #707070;
    top:-20px;
    right:12%;
}
.profile-dropdown ul li{
    display: grid;
    padding: .5rem;
    grid-template-columns: 30px auto;
    align-items: center;
}
.profile-dropdown .drop-icon{
    color:#f5f5f5;
    text-align: center;
}
.profile-dropdown h2{
    padding-left: .8rem;
    line-height: 2rem;
    font-size: 1.2rem;
    color:#f5f5f5;
}

</style>