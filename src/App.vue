<template>
  <div id="app">
    <main>
      <section class="player">
        <div class="cover-wrapper">
          <img v-bind:class="coverObject" :src="current.cover" />
        </div>
        <div class="song-details">
          <h2 class="song-title">
            {{ current.title }}
          </h2>
          <p class="artist">{{ current.artist }}</p>
          <KProgress
            :show-text="false"
            class="progress-bar-wrapper"
            v-bind:percent="current.percent"
            :color="['#df83f1', '#82279f', '#53cfe0']"
          />
          <div class="timer">
            <p class="start">{{ currentlyTimer }}</p>
            <p class="end">
              {{ current.totalTimer }}
            </p>
          </div>
        </div>
        <div class="controls">
          <button class="prev" @click="prev" v-if="songs.length > 1">
            <font-awesome-icon icon="step-backward" />
          </button>
          <button class="play" v-if="!isPlaying" @click="play">
            <font-awesome-icon icon="play" />
          </button>
          <button class="pause" v-else @click="pause">
            <font-awesome-icon icon="pause" />
          </button>
          <button class="next" @click="next" v-if="songs.length > 1">
            <font-awesome-icon icon="step-forward" />
          </button>
        </div>
        <div class="footer">
          <p>Powered by Soundcloud</p>
          <a
            href="https://github.com/Davigl/vue-music-player"
            alt="Give a Star"
            title="Give a Star"
          >
            <font-awesome-icon :icon="['fab', 'github']" />
          </a>
        </div>
      </section>
    </main>
    <section class="playlist">
      <h3>Now Playing <span> 🎵 </span></h3>
      <ul>
        <li v-for="song in songs" :key="song.src" class="song">
          <div class="cover-playlist">
            <img class="cover" :src="song.cover" />
          </div>
          <div class="details" @click="play(song)">
            <h2 class="song-title">
              {{ song.title }}
            </h2>
            <p class="artist">{{ song.artist }}</p>
            <KProgress
              v-if="song.isPlaying"
              :color="['#df83f1', '#82279f', '#53cfe0']"
              :show-text="false"
              class="progress-bar-wrapper"
              v-bind:percent="song.percent"
            />
          </div>
          <div class="actions">
            <button @click="removeSongFromPlaylist(song)" class="delete">
              <font-awesome-icon icon="times" />
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import KProgress from "k-progress";

import { formatTimer } from "./helpers/timer";
import { deleteElement, threatSongs, shuffleArray } from "./helpers/utils";
import songs from "./mocks/songs";

export default {
  components: { KProgress },
  name: "App",
  data() {
    return {
      current: {},
      coverObject: { cover: true, animated: false },
      index: 0,
      isPlaying: false,
      currentlyTimer: "00:00",
      songs: shuffleArray(songs),
      player: new Audio()
    };
  },
  methods: {
    listenersWhenPlay() {
      this.player.addEventListener("timeupdate", () => {
        var playerTimer = this.player.currentTime;

        this.currentlyTimer = formatTimer(playerTimer);
        this.current.percent = (playerTimer * 100) / this.current.seconds;
        this.current.isPlaying = true;
      });
      this.player.addEventListener(
        "ended",
        function() {
          this.next();
        }.bind(this)
      );
    },
    setCover() {
      this.coverObject.animated = true;

      setTimeout(() => {
        this.coverObject.animated = false;
      }, 1000);
    },
    setCurrentSong() {
      this.current = this.songs[this.index];
      this.play(this.current);
      this.setCover();
    },
    play(song) {
      if (typeof song.src !== "undefined") {
        this.current.isPlaying = false;
        this.index = this.songs.indexOf(this.current);
        this.current = song;
        this.player.src = this.current.src;
      }

      this.player.play();
      this.isPlaying = true;

      this.setCover();
      this.listenersWhenPlay();
    },
    pause() {
      this.player.pause();
      this.isPlaying = false;
    },
    next() {
      this.current.isPlaying = false;
      this.index = this.songs.indexOf(this.current);
      this.index++;
      if (this.index > this.songs.length - 1) {
        this.index = 0;
      }
      this.setCurrentSong();
    },
    prev() {
      this.current.isPlaying = false;
      this.index = this.songs.indexOf(this.current);
      this.index--;
      if (this.index < 0) {
        this.index = this.songs.length - 1;
      }
      this.setCurrentSong();
    },
    removeSongFromPlaylist(song) {
      if (this.songs.length > 1) {
        if (this.index > 0) {
          this.index--;
        }
        this.current.isPlaying = false;
        this.songs = deleteElement(this.songs, song);
        this.setCurrentSong();
      }
    }
  },
  mounted() {
    this.songs = threatSongs(this.songs);
    this.current = this.songs[this.index];
    this.player.src = this.current.src;
  }
};
</script>

<style>
@import "./assets/styles/main.css";
</style>
