<template>
  <span :class="type">{{type}} </span>
</template>

<script>
  export default {
    name: "Type",
    props: {
      type: String
    }
  }
</script>

<style scoped lang="scss">
  .Object {
    font-weight: bold;
    color: black;
  }

  .String {
    font-weight: bold;
    color: deepskyblue;
  }

  .Integer {
    font-weight: bold;
    color: lawngreen;
  }

</style>
