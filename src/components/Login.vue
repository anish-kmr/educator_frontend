
<template>
    <div class="login-container">
        <div class="account-type-container">
            <h1>Choose Account type</h1>
            <div class="account-options">
                <div class="teacher-account"  @click="account_type='faculty'" :class="{selected:account_type == 'faculty'}">
                    <span>Teacher</span>
                </div>
                <div class="student-account" @click="account_type='student'" :class="{selected:account_type == 'student'}">
                    <span>Student</span>
                </div>
            </div>

            <div class="back-btn">
                <i class="fas fa-arrow-left"></i>
                <a @click="slidePage()">Back</a>
            </div>
        </div>
        <div class="loginform-container">
            <div class="form-box">
                <div class="form-header">
                    <h4 class="form-heading">{{form_visible | capitalize}} </h4>
                    <div class="toggle-form">
                        <span  @click="showLogin()" :class="{form_selected:form_visible == 'login'}">Login</span>
                        <span  @click="showSignup()" :class="{form_selected:form_visible == 'signup'}">Signup</span>
                    </div>
                </div>
                <form  v-if="form_visible == 'login'">
                    <div class="form-group">
                        <div class="input">
                            <div class="icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <input type="text" name="email" placeholder="Email" id="email" v-model="login.email">
                        </div>
                    </div>
                    <div class="form-group">
                            <div class="input">
                                <div class="icon">
                                    <i class="fas fa-key"></i>
                                </div>
                                <input type="password" name="password" placeholder="Password" id="password" v-model="login.password">
                                <div class="show-password" @click="toggleVisibility">
                                    <i class="fas fa-eye" v-if="password_visible"></i>
                                    <i class="fas fa-eye-slash" v-else></i>
                                </div>
                            </div>
                        <router-link to="/student/forgotpassword" class="sm-text" >
                            Forgot Password?
                        </router-link>
                    </div>
                    <div class="form-group">
                        <div class="submit-btn">
                            <button class="btn" @click="authenticate">Login</button>
                        </div>
                    </div>
                </form>

                <signup v-else :account_type="account_type" :toggleVisibility="toggleVisibility"></signup>

                <div class="break"  v-if="form_visible == 'login'">
                    <span class="or">OR</span>
                </div>

                <div class="other-login-methods" v-if="form_visible == 'login'">
                    <div class="login-with-google">
                        <button>
                            <div class="google-icon">
                                <img src="../assets/google-icon.png" alt="">
                            </div>
                            <h3>
                                Sign in With Google
                            </h3>
                        </button>
                    </div>
                </div>
            </div> 
        </div>
        <loading :isLoading="isLoading" />
    </div>
</template>

<script>
import Loading from './Loading.vue'

import Signup from './Signup.vue'
import { authenticateStudent, authenticateFaculty } from '../services/auth'
export default {
    props:['slidePage'],
    data() {
        return {
            isLoading:false,
            form_visible:"login",
            account_type:"",
            login:{
                email:"",
                password:"",
            },
            
            password_visible:true,
        }
    },
    components:{
        'signup':Signup,
        'loading':Loading
    },
    filters: {
        capitalize(value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        }
    },
    methods: {
        authenticate(ev){
            this.isLoading=true
            ev.preventDefault()
            console.log("Authenticating....")
            if(this.account_type === "faculty"){
                authenticateFaculty(this.login.email,this.login.password)
                .then(res=>{
                    console.log("res of faculty login ",res)
                    if(res.data.signedIn){
                        localStorage.setItem('user',JSON.stringify(res.data.user))
                        localStorage.setItem('role',"Faculty")
                        if(res.data.user.scheduleFilled){
                            this.isLoading = false
                            this.$router.push('/dashboard')
                        }else{
                            this.isLoading = false
                            this.$router.push('/schedule')
                        }
                    }
                    else this.isLoading = false
                }).catch(err=>{
                    console.log(err)
                    this.isLoading=false
                    alert("Network/Server Error")
                })
            }
            else if(this.account_type === "student"){
                authenticateStudent(this.login.email,this.login.password)
                .then(res=>{
                    console.log("res of faculty login ",res)
                    if(res.data.signedIn){
                        localStorage.setItem('id',JSON.stringify(res.data.user))
                        localStorage.setItem('role',"Student")
                        this.isLoading=false
                        this.$router.push('/dashboard')
                    }
                    else this.isLoading = false
                }).catch(err=>{
                    console.log(err)
                    this.isLoading=false
                    alert("Network/Server Error")
                })
            }
            else{
                alert("Select account type ")
                this.isLoading = false
            }

        },
        toggleVisibility(){
            if(this.password_visible) document.getElementById("password").type="text";
            else  document.getElementById("password").type="password";
            this.password_visible=!this.password_visible;
        },
        showLogin(){
            this.form_visible = "login"
        },
        showSignup(){
            this.form_visible = "signup"
        }

    },
}
</script>

<style scoped>
@import '../assets/css/login.css';
.login-container{
    width: 100%;
    height: 100%;
    position: relative;
    display: grid;
    overflow-y: auto;
    grid-template-columns: 25vw auto;
}
.account-type-container{
    background-color: #002486;
    height: 100%;
    padding:1rem;
    display: grid;
    grid-template-rows: 10% auto 10%;
    gap:3rem
}
.loginform-container{
    position: relative;
    height: 100%;
}
.account-type-container h1{
    padding:1rem;
    /* padding-top: 6zrem; */
    font-size: 3rem;
    color:white;
}
.account-options{
    
    height: 100%;
    
}
.student-account,.teacher-account{
    margin: 0 auto;
    position: relative;
    width:22.5rem;
    height:22.5rem;
    background-image: url('../assets/student.jpg');
    background-position: 50% 50%;
    background-size: contain;
    background-repeat: no-repeat;
    
}
.teacher-account{
    background-image: url('../assets/teacher.png');
    margin-bottom: 3rem;
}
.teacher-account span, .student-account span{
    position: absolute;
    bottom:0;
    left:1rem;
    font-size: 1.8rem;
    color:white;
}

.selected{
    border:2px solid white;
    position: relative;
}
.selected::after{
    content: "";
    position: absolute;
    bottom:0;
    right:0;
    width: 50px;
    height: 50px;
    background-image:url('../assets/check.png') ;
    background-position: 50% 50%;
    background-size: 40px;
    background-repeat: no-repeat;
    
    background-color: white;
    /* background-color: #218d00; */
}


.back-btn{
    position: fixed;
    bottom:0;
    left:0;
    display: flex;
    align-items: center;
    margin-top: 6rem;
    
}
.back-btn i{
    position: absolute;
    left: 0;
    margin-left: 2rem;
    margin-right: 2rem;
    color:#efefef;
    font-size: 2.5rem;
    animation: right 2s infinite;
    transition: .3s all;
}
.back-btn a{
    margin-left: 4rem;
    padding: 1rem 3rem;
    font-size: 2.5rem;
    color:#d6cece;
    border-radius:8px;
    /* background-color:#8f00ff ; */
}
.back-btn:hover{
    cursor: pointer;
}




.form-box{
    width:50rem ;
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    padding:1rem 4rem;
    margin: 0 auto;
    box-shadow: 0 0 10px #707070;
}
.form-header{
    margin:1.2rem auto
}
.form-header >*{
    width: 49%;
    display: inline-block;
}
.form-header .toggle-form{
    text-align: right;
}
.toggle-form span{
    font-size: 1.4rem;
    padding:1rem;
    display: inline-block;
    border-radius: 5px;;
    
}
.toggle-form span:hover{
    cursor: pointer;
}
.form_selected{
    font-weight: bold;
   color:white;
   background-color: #002486;

}
.form-heading{
    font-size: 3rem;
    font-weight: 700;
    text-align: left;
    color:#4e4c4c;
    margin-top: 2rem;;
    margin-bottom:5rem;
}

.break{
    position: relative;
    margin:4rem auto;
    text-align: center;
}
.or{
    font-size: 2rem;
    color:#707070
}
.or::before,.or::after{
    content: '';
    width:45%;
    position: absolute;
    top:50%;
    left:0;
    border-radius: 5px;
    border:1px solid #d8d7d7;
}
.or::after{
    left:55%;
}

.other-login-methods{
    margin:0 auto;
    margin-bottom: 3rem;
    position: relative;

}
.login-with-google{
    text-align: center;
    text-align-last: left;
}
.google-icon{
    padding:1rem 1.5rem;
    border-right: 2px solid #cccccc;
    display: inline-block;
    /* outline: 2px solid red;; */
}
.login-with-google button h3{
    font-size: 2rem;
    margin-left: 2rem;
    display: inline-block;
    font-weight: 500 !important;
}
.login-with-google img{
    width: 25px;
    height: auto;

}
.login-with-google button{
    width: 100%;
    font-size:2rem;
    background-color: #f6f6f6;
    box-shadow: 0 0 5px #707070;
    color: #909090;
    padding: .5rem 0 !important;

}

.sm-text{
    display: block;
    font-size: 1.4rem;
    text-align: right;
    margin-top: .4rem;
}



</style>
