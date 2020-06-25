<template>
    <div id="timeline">
        <div class="day-select-item">
            <div class="day-select">
                <select v-model="selected_day">
                    <option v-for="day in days" :value="day" :key="day">{{day}}</option>
                </select>
                <div class="down-icon">
                    <i class="fa fa-angle-down" aria-hidden="true"></i>
                </div>
            </div>
        </div>
        
        <template v-if="schedules && Object.keys(schedules) != 0">
            <div class="timeline-item" v-for="lecture in schedules[selected_day]" :key="lecture.startTime">
                <div class="subject">{{lecture.subject}}</div>
                <div class="time">{{lecture.startTime}}-{{lecture.endTime}}</div>
            </div>
        </template>
        <template v-else>
            <div class="timeline-item skeleton-item loader" v-for="i in 3" :key="i">                       
                 <content-loader
                    :speed="1"
                    primaryColor="#cccccc"
                    secondaryColor="#ecebeb"
                >
                    <rect x="100" y="25" rx="6" ry="4" width="250" height="15" /> 
                    <rect x="100" y="100" rx="6" ry="4" width="250" height="15" /> 
                    
                 </content-loader>
            </div>
        </template>
        

    </div>
</template>

<script>
import { ContentLoader } from 'vue-content-loader';
import { get_faculty_schedules } from '../services/schedule'
export default {
    data(){
        return {
            days: [ "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            selected_day:"Monday",
            schedules:{}
        }
    },
    components:{
            ContentLoader

    },
    async mounted() {
        let faculty = JSON.parse(localStorage.getItem('user'))
        console.log("faculty ",faculty)
        let facultyId = faculty.uid
        get_faculty_schedules(facultyId).then(res=>{
            this.schedules = res.data.schedules
            console.log("schedule",this.schedules)
        })
    }

}
</script>

<style scoped>
.loader{
    height: 100%;
    width:12rem;
    height: 100%;
    
}
.loader>*{
    width:12rem;
}
#timeline{
    width: calc(100%);
    height: 5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #f8f8f8;
}
.day-select-item{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 2rem;
    border-right: 2px solid #eeeeee;
    
}
.day-select{position: relative;}
.day-select select{
    padding: .5rem 1rem;
    font-size: 1.6rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 10rem;
    /* padding-right: 3rem; */
    outline: none;
    background-color: #002486;
    color:white
}
.day-select select::-ms-expand{display: none;}
.day-select .down-icon{
    position: absolute;
    top:50%;
    right:.8rem;
    transform: translateY(-50%);
}

option{
    background-color: #eeeeee;
    color:#292929;
}
.down-icon i{
    color:white;
    font-size: 1.6rem;
}
.timeline-item{
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    align-items: center;
    padding:1rem 4rem;
    position: relative;
}
.skeleton-item::after{display: none !important;}
.skeleton-item::before{display: none !important;}


/* .timeline-item::before{
    content:"";
    position: absolute;
    top:50%;
    left: 5%;
    height:1px;
    width: 90%;
    background-color: #f0efef;
}*/
.timeline-item::after{
    content:"";
    position: absolute;
    top:10%;
    left: 100%;
    height:80%;
    width: 1.5px;
    background-color: #eeeeee; 
}
.timeline-item>div{
    text-align: center;
    color: #707070;
}
.subject{
    font-size: 1.8rem;
    margin-bottom: .8rem;
}
.time{
    font-size: 1.4rem;
}

</style>