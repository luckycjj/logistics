<template>
    <div id="pdf">
      <div id="title" v-title data-title="PDF预览"></div>
      <iframe :src="pdf"></iframe>
    </div>
</template>

<script>
    export default {
      name: "pdf",
      data(){
        return{
          pdf:"http://47.97.214.8/image/image/Temp/111.pdf"
        }

      }
    }
</script>

<style scoped>
  iframe{
    position: fixed;
    top:1.3rem;
    bottom:0;
    height: 100%;
    width:100%;
  }
</style>
