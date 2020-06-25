<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

*{
  margin:0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
  box-shadow: none;
  font-family: fantasy;
  border: none;
  list-style-type: none;
}

html {
    font-size: 62.5%
}

@media only screen and (max-width: 37.5em) {
    html {
        font-size: 56.25%;
    }
}

@media only screen and (max-width: 56.25em) {
    html {
        font-size: 50%;
    }
}

@media only screen and (min-width: 112.5em) {
    html {
        font-size: 75%
    }
}

/* Custom checkbox */
/* .checkbox-container{
    position: relative;
} */
input[type="checkbox"],input[type="radio"]{
    visibility: hidden;
}
.custom-checkbox,.custom-radio{
    position: absolute;
    z-index: 99;
    top: 0;
    left: 0px;
    width: 18px;
    height: 18px;
    background-color: #b8b8b8;
    transition: .2s all;
}
.label:hover{
    cursor: pointer;
}
.label:hover .custom-checkbox{
    background-color: #707070;
}

input[type="checkbox"]:checked~ .custom-checkbox{
    background-color: #1447b6 !important;
}
input[type="radio"]:checked~ .custom-radio{
    background-color: #f1f1f1 !important;
    border:1px solid #1447b6
}
input[type="checkbox"]:checked~  .custom-checkbox::after, input[type="radio"]:checked~ .custom-radio::after{
    display: block;
}
.custom-checkbox::after{
    display: none;
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 10px;
    height:6px;
    border-bottom: 3px solid white;
    border-left: 3px solid white;
	-webkit-transform: rotate(-45deg); 
	-ms-transform: rotate(-45deg); 
	transform: rotate(-45deg); 
}
.custom-radio{
  border-radius: 50%;
}
.custom-radio::after{
  display: none;
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 10px;
    height:10px;
    border-radius: 50%;
    background-color: #1447b6;
	
}
</style>
