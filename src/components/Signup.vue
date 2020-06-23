<template>
    <form class="signup"> 
        <div class="form-group">
            <div class="input">
                <div class="icon">
                    <i class="fas fa-user"></i>
                </div>
                <input type="text" name="username" placeholder="Username" id="username" v-model="signup.name">
            </div>
        </div>

        <div class="form-group multi-group" v-if="account_type=='student'">
            <div class="form-group-half input">

                 <div class="icon">
                    <i class="fa fa-users"></i>
                </div>
                <input type="text" id="firstname" placeholder="Batch" v-model="signup.batch">
            </div>
            <div class="form-group-half input">
                 <div class="icon">
                    <i class="fas fa-calendar"></i>
                </div>
                <input type="number" id="lastname" placeholder="Year" v-model="signup.year">
            </div>
        </div>

         <!-- <div class="form-group">
            <div class="input">
                <div class="icon">
                    <i class="fa fa-mobile" aria-hidden="true"></i>
                </div>
                <input type="phone" name="pnumber" placeholder="Phone Number" id="pnumber" v-model="signup.phoneNumber">
            </div>
        </div> -->

        <div class="form-group">
            <div class="input">
                <div class="icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <input type="text" name="email" placeholder="Email" id="email" v-model="signup.email">
            </div>
        </div>

        <div class="form-group">
            <div class="input">
                <div class="icon">
                    <i class="fas fa-key"></i>
                </div>
                <input type="password" name="password" placeholder="Password" id="password" v-model="signup.password">
                <div class="show-password" @click="toggleVisibility">
                    <i class="fas fa-eye" v-if="password_visible"></i>
                    <i class="fas fa-eye-slash" v-else></i>
                </div>
            </div>
        </div>
        <div class="form-group ">
            <div class="submit-btn">
                <button class="btn" @click="create_account">Create Account</button>
            </div>
        </div>
        <loading :isLoading="isLoading"/>
    </form>
</template>


<script>
import Loading from './Loading.vue'
import { createFaculty , createStudent} from '../services/auth'

export default {
    props:['toggleVisibility','account_type'],
    data() {
        return {
            isLoading: false,
            password_visible:false,
            signup:{
                name:"",
                email: "",
                password:"",
                batch:"",
                year:""
            },
        }
    },
    components:{'loading':Loading},
    methods: {
        create_account(ev){
            this.isLoading = true
            ev.preventDefault();
            
            //Create account 
            console.log("User ",this.signup)

            let name = this.signup.name;
            let email = this.signup.email;
            let password = this.signup.password;
            let batch = this.signup.batch;
            let year = this.signup.year;

            if(this.account_type === "faculty"){

                createFaculty(name,email, password)
                .then(res=>{
                    console.log("res is ",res)
                    if(res.data.created){
                        localStorage.setItem("id",res.data.user.uid)
                        localStorage.setItem("name",res.data.user.displayName)
                        localStorage.setItem("role","Faculty")
                        this.$router.push('/faculty/schedule')
                    }
                    this.Loading = false
                })
                .catch(err=>{
                        this.Loading=false
                })
            }
            else if(this.account_type === "student"){
                createStudent(name,batch,year,email,password)
                .then(res=>{
                    console.log("res of student",res)
                    if(res.created){
                        localStorage.setItem("id",res.data.user.uid)
                        localStorage.setItem("name",res.data.user.displayName)
                        localStorage.setItem("role","Faculty")
                        this.$router.push('/dashboard')
                    }
                    this.Loading = false
                })
                .catch(err=>{
                    this.Loading = false
                })
            }

        }
    },
}
</script>

<style scoped>
@import '../assets/css/login.css';
.form-group label{
    font-size: 1.6rem;
    font-weight: bolder;
    display: inline-block;
    margin-bottom:.8rem;
}
.signup .btn{
    margin-top: 4rem;
}

</style>