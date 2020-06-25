<template>
    <div>
        <app-header></app-header>

        <div class="schedule-container tt-body">
            <!-- <div class="scroll-left prev"><i class="fa fa-chevron-left"></i></div> -->
            <div class="days">
                <div class="item"  v-for="(schedule,day) in schedule" :key="day">
                    <div class="day-name">
                        <h4>{{day}}</h4>
                    </div>
                   <div class="card schedule-item" v-for="(lecture,i) in schedule" :key="i">
                       <div class="time">
                           <select name="time-select" id="time-select"  v-model="lecture.time">
                               <option v-for="time in timings" :key="time">{{time}}</option>
                           </select>
                       </div>
                       <div class="subject">
                           <textarea placeholder="Subject" v-model="lecture.subject"></textarea>
                       </div>
                       <div class="batch-year">
                           <div class="batch">
                                <select name="batch-select" v-model="lecture.batch">
                                    <option v-for="batch in batches" :key="batch"  :value="batch">{{batch}}</option>
                                </select>
                            </div>
                            <div class="year">
                                <select name="year-select" v-model="lecture.year">
                                    <option v-for="(intYear,year) in years" :key="year"  :value="intYear">{{year}}</option>
                                </select>
                            </div>
                       </div>
                       
                   </div>
                   <div class="card  add-lecture" @click="add_lecture(day)">
                       <div class="add-icon"><i class="fa fa-plus-circle"></i></div>
                   </div>

                </div>
            </div>

           
        </div> 
        <div class="next">
            <p>You need to fill the time table to Get Started</p>
            <a @click="save_schedule"> Finish </a>
        </div> 
        <loading :isLoading="isLoading" />
    </div>
</template>

<script>
import Loading from '../components/Loading.vue'
import Header from '../components/Header.vue'
import { upload_schedule } from '../services/schedule'
export default {
    data(){
        return {
            isLoading: false,
            timings:["9:00-9:50","10:00-10:50","11:00-11:50","12:00-12:50","13:00-13:50","14:00-14:50","15:00-15:50","16:00-16:50"],
            schedule:{
                "Monday":[],
                "Tuesday":[],
                "Wednesday":[],
                "Thursday":[],
                "Friday":[],
                "Saturday":[]
            },
            years:{"1st Year":1,"2nd Year":2,"3rd Year":3,"4th Year":4},
            batches:["B1","B2","B3","B4","B5", "B6","B7", "B8"]
            
        }
    },
    components:{
        'loading':Loading,
        'app-header':Header
    },
    methods: {
        save_schedule(ev){
            this.isLoading = true
            ev.preventDefault()
            let schedules =[]
            for(let day in this.schedule) {
                let lectures = this.schedule[day]
                lectures.forEach(lecture =>{
                    console.log("lecture ",lecture)
                    if(lecture.subject == null || lecture.batch == null || lecture.year == null || lecture.time==null){
                        this.isLoading = false
                        alert(`${lecture.day} has some unfilled values.Either Delete lecture or fill.`)
                        return false
                    }
                    schedules.push(lecture)
                })
            }
            //Ccall save schedule api
            console.log("schedule",schedules    )
            let faculty = JSON.parse(localStorage.getItem('user')) 
            upload_schedule(faculty.uid,faculty.displayName,schedules).then(res=>{
                if(res.data.saved != schedules.length){
                    alert(`${res.data.failed} Lectures were not saved. Please check schedules in dashboard  `)
                }
                this.isLoading = false
                this.$router.push('/dashboard')
            }).catch(err=>{
                this.isLoading=false
                console.log("error ",err)
            })



        },
        add_lecture(day){
            console.log("Adding lecture on ",day)
            this.schedule[day].push({day:day,subject:null,batch:this.batches[0],year:1,time:this.timings[0]})
        }
    },
}
</script>


<style scoped>
.schedule-container{
    padding:1.5rem 4rem;
    overflow-y: auto;
}
.days{
    height: 78vh;;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}
.day-name h4{
    font-size: 2.5rem;
    color: #707070;
}
.item{
    display: flex;
    flex-direction: column;
    text-align: center;
    font-size: 1.6rem;
    margin: 1rem;
}
.card{
    width: 15rem;
    height: 15rem;
    margin-top: 1.5rem;
    text-align: center;
    position: relative;
    border-radius: 10px;
}
.schedule-item{
    background-color: #5ca9f1d5;
    display: grid;
    grid-template-rows: 15% auto 25%;
}
.schedule-item select{
    background:none;
    -webkit-appearance: none;
    -moz-appearance: none;
    color:white;
    outline: none;
    text-align-last: center;
    width: 100%;
    
}
option{color:black;text-indent: 50%;}
.time select{
    font-size: 1.6rem;
    font-weight: bold;
}
.batch select, .year select{
    font-size: 1.8rem;
}

.time{
    text-align: center;
    width:100%;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 2px;
    background-color: #002486;
}
.subject{
    text-align: center;
    display:flex;
    align-items: center;
    justify-content: center;
    padding-top: 1rem;
}
.subject textarea{
    height: max-content;
    resize: none;
    width: 90%;
    background:none;
    font-size: 2rem;
    color:#efefef;
    word-wrap: break-all;
    text-align: center;
}
.subject textarea::placeholder{
    color:#dfdfdf
}
.batch,.year{
    display: inline-block;
    width: 45%;
}
.add-lecture{
    background-color: #efefef;
    display: grid;
    grid-template-rows: 100%;
}
.add-lecture:hover{
    cursor: pointer;
}

.add-icon{
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    border-radius: 50%;
}
.add-icon i{
    font-size: 2.4rem;
    color: #707070;
}
.next {
    position: relative;
    padding-top: 1.5rem;
    padding-left: 3rem;
}
.next p{
    color:#707070;
    font-size: 2rem;
}
.next a{
    position: absolute;
    top:1.5rem;
    right:3rem;
    padding:1rem 4rem;
    font-size: 2rem;
    color:#efefef;
    background-color: #002486;
}
</style>


