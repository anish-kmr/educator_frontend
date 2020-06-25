<template>
    <div>
        <app-header></app-header>
        <sidebar></sidebar>
        <div class="main-area">
            <timeline></timeline>
            <div class="section">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'
import Timeline from '../components/Timeline.vue'
export default {
    components: { 
        'app-header':Header,
        'sidebar':Sidebar ,
        'timeline':Timeline    
    }
}
</script>

<style scoped>
.main-area{
    width: calc(100% - 5rem);
    height: calc(100vh - 5rem);
    transform: translateX(5rem);
}
.section{
    width: 100%;
    height: calc(100% -  5rem);
}
</style>