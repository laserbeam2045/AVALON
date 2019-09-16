<template>
  <div>
    <audio v-for="(sound, index) in sounds" :key=index :id=sound.id>
      <source :src="require(`../assets/sound/${sound.name}`)" type="audio/mp3">
    </audio>
  </div>
</template>

<script>
import Vue from 'vue'

// 効果音を再生する関数
Vue.prototype.$playSound = function(id) {
  const audio = document.getElementById(id);
  audio.volume = 0.2;
  if (typeof(audio.currentTime) != 'undefined') {
    audio.currentTime = 0;
  }
  audio.play();
}

export default {
  name: 'TheSoundsData',
  data: function() {
    return {
      sounds: [
        {
          id: 'sound-button',
          name: 'button.mp3'
        },
        {
          id: 'sound-on',
          name: 'Cyber17-1.mp3',
        },
        {
          id: 'sound-off',
          name: 'Cyber18-1.mp3',
        },
        {
          id: 'sound-alert',
          name: 'alert.mp3',
        },
      ],
    }
  },
}
</script>