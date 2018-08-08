<template>
  <div id="site">
    <router-view/>
  </div>
</template>

<script>
    export default {
        name: "site"
    }
</script>

<style scoped>
  #site{
    width:100%;
    height:auto;
    top:1.3rem;
    bottom:0;
    position: absolute;
    overflow: scroll;
    margin-top: 0.03125rem;
  }
</style>
