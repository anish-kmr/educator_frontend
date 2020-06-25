<template>
    <div id="sidebar">
        <div class="logo-container">
        </div>
        <div class="nav">
            <ul>
                <li>
                    <router-link to="">
                        <div class="icon">
                            <img src="../assets/classes.png" alt="">
                        </div>
                    </router-link>
                </li>
                <li>
                    <router-link to="">
                        <div class="icon assignment-icon">
                            <img src="../assets/assignment.png"  alt="">
                        </div>
                    </router-link>
                </li>
                <li>
                    <router-link to="">
                        <div class="icon ">
                            <img src="../assets/sm.png"  alt="">
                        </div>
                    </router-link>
                </li>
                
            </ul>
        </div>
    </div>
</template>

<style scoped>

#sidebar{
    height: 100%;
    width:5rem;
    /* border-right: 2px solid #e2e2e2; */
    background-color: #ffffff;
    position: fixed;
    top:0;
    left:0;z-index: 2;
}
#sidebar::before{
    content: "";
    position: absolute;
    top:7.5px;
    right:0px;
    width:2px;
    height: 37px;
    background-color:#e9e9e9;
}
#sidebar::after{
    content: "";
    position: absolute;
    top:55px;
    right:0px;
    width:2px;
    height: calc(100% - 55px);
    background-color:#e9e9e9;
}
.logo-container{
    width: 100%;
    height: 50px;
    position: relative;
}
.logo-container::after{
    content: "";
    position: absolute;
    top:100%;
    left:15%;
    width:75%;
    height: 2px;
    background-color:#e9e9e9;
}

ul>li{
    margin-top: 2rem;
}

ul>li a{
    display: block;
}
.icon{
    border-radius: 50%;
    margin: 0 auto;
    background-color: #002486;
    width: 3.5rem;
    height: 3.5rem;
    text-align: center;
    padding-top: .3rem;
}
.icon img{
    
    width: 2.8rem;
    height: 2.8rem;
}

</style>