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

</style>
