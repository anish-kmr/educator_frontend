<template>
    <div>
        <app-header></app-header>

        <div class="schedule-container">
            <table>
                <thead>
                    <tr>
                        <th></th>
                       <th v-for="(time,i) in timings" :key="`time-${i}`"> {{time}} </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(daySchedule,day) in schedule" :key="day">
                        <td class="dayname">{{day}}</td>
                        <td v-for="(obj,time) in schedule[day]" :key="`${day}-${time}`" class="data-cells">
                            <div class="cell" :id="`fill-${day}-${time}`">
                                <div class="input-fields">
                                    <div class="field">
                                        <input type="text" name="subject" placeholder="Subject" v-model="schedule[day][time].subject">
                                    </div>
                                    <div class="field">
                                        <input type="text" name="batch" placeholder="Batch" v-model="schedule[day][time].batch">
                                    </div>
                                    <div class="field">
                                        <input type="text" name="year" placeholder="Year" v-model="schedule[day][time].year">
                                    </div>
                                </div>
                            </div>
                            <div class="empty-cell" :id="`empty-${day}-${time}`" @click="toggleCell(day,time)">
                                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                
                            </div>
                        </td>

                    </tr>
                </tbody>

            </table>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import Header from '../components/Header.vue'
export default {
    data(){
        return {
            timings:["9:00-9:50","10:00-10:50","11:00-11:50","12:00-12:50","1:00-1:50","2:00-2:50","3:00-3:50","4:00-4:50"],
            schedule:{},
            days:["Monday","Tuesday", "Wednesday","Thursday", "Friday","Saturday"]
        }
    },
    
    created() {
        this.days.forEach(day => {
            console.log(day)
            let daySchedule={}
            for(let i=0;i<this.timings.length;i++){
                daySchedule[this.timings[i]] = {'visible':false,subject:null,batch:null,year:null}        
            }
            this.schedule[day] = daySchedule
        })
        // alert("hello")
        console.log(this.schedule)
    },
    methods: {
        toggleCell(day,time){
            console.log("clicked",day,time)
            this.schedule[day][time].visible = true
            document.getElementById(`empty-${day}-${time}`).style.display="none"
            document.getElementById(`fill-${day}-${time}`).style.display="block"
        }
    },
    components: {
        'app-header':Header
    }
}
</script>


<style scoped>
.empty-cell:hover{
    cursor: pointer;
}
.cell{display: none;}
.schedule-container{
    padding:2rem;
    max-height:calc(800vh-40px);
    height: 84vh;
}
table{
    border-radius:5px;
    width: 100%;
    height: 100%;
    border-spacing: 1px;
    border-collapse: collapse;
    
}
.data-cells{
    width:calc((100%-10rem)/8);
}
td:not(.dayname){
    margin-left: 5px;
    vertical-align: middle ;
    background-color: #d6d6d6;
    /* border-radius: 8px; */
    position: relative;
}
td:not(.dayname)::after{
    content: "";
    position: absolute;
    top:5%;
    right:0;
    height:90%;
    width: 2px;
    background-color: #b4b4b4;
}
td:not(.dayname)::before{
    content: "";
    position: absolute;
    bottom: 0;
    left:5%;
    width:90%;
    height: 2px;
    background-color: #b6b6b6;
}
/* td>*{width: 100%;height: 100%;} */
table th,.dayname{
    padding: 1rem;
    color:white;
font-size: 1.6rem;
background-color: #002486;

}
.dayname{
    width:6rem;
}
.empty-cell{
    text-align: center;
    font-size: 1.8rem;
    color:#2c2c2c
}
.field{
    text-align: center;
}
.field:nth-child(z)
.field input{
    display: inline-block;
    background-color: transparent;
    border-bottom: 1px dotted grey;
    text-align: center;
    margin: 0 auto;
}
.field input[name=subject]{
    width:80%;
}

.field input[name=batch],.field input[name=year]{
    
    display: inline;
    /* outline: 2px solid red; */
}
</style>