<template>
  <div id="information">
    <div id="information-bar">
      <div></div>
    </div>
    <fieldset>
      <div>
        <TheStateData/>
        <TheSearchData/>
      </div>
      <TheComboData/>
    </fieldset>
  </div>
</template>

<script>
import TheStateData from './TheStateData'
import TheSearchData from './TheSearchData'
import TheComboData from './TheComboData'

export default {
  name: 'TheInformation',
  components: {
    TheStateData,
    TheSearchData,
    TheComboData,
  },
}
</script>

<style lang="scss">
#information {
  position: relative;
  width: 98%;
  margin-left: 1%;

  > fieldset {
    position: absolute;
    bottom: 18px;
    width: 96%;
    box-sizing: border-box;
    margin: 0 auto;
    padding: 12px 12px 8px;
    position: relative;
    background: rgba(0, 10, 10, 0.89);
    color: rgb(0,227,255);
    border: 2px solid rgb(47,112,128);
    opacity: 0.9;
    border-radius: 6px 6px 0 0;
    box-shadow: 0px -30px 50px -30px rgb(1,136,202) inset;

    > div:first-child {
      display: flex;
      align-items: flex-end;

      #state,
      #search-data {
        flex-grow: 1;
        flex-basis: 47%;
      }
    }

    fieldset {
      overflow: hidden;
      margin: 0;
      padding: 10px;
      box-sizing: border-box;
      border: 1px solid rgb(0,227,255);
      border-radius: 5px;
      transition: 0.6s width;

      .ok, .maximum {
        color: white;
        text-shadow: 0 0 2px #07f7e7;
      }

      .danger {
        color: white;
        font-weight: bold;
        text-shadow: 0 0 3px red;
        animation-name: danger;
        animation-duration: 0.25s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        animation-direction: alternate;
      }
    }
  }
  
  #information-bar {
    width: 100%;
    height: 20px;
    position: absolute;
    bottom: 0;
    border-radius: 4px;
    background: black;
    background: linear-gradient(to bottom, black 0px, #484444 7px, black 20px);

    div {
      width: 97%;
      height: 4px;
      margin: 0 auto;
      background: rgb(199,224,254);
      box-shadow: 0px -10px 20px 15px rgb(36,84,145);
      border-radius: 3px;
    }
  }
}

@keyframes danger {
  100% {
    color: red;
  }
}
</style>