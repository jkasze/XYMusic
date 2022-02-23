import { XYEventStore } from '../event_store/index'
import { getSongDetail, getSongLyric } from '../service/api_player'
import { parseLyric } from '../utils/parse-lyric'

const audioContext = wx.getBackgroundAudioManager()

const playerStore = new XYEventStore({
  state: {
    isFirstPlay: false,
    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: '',

    isPlaying: false,

    playModeIndex: 0, // 0:循环播放 1:单曲循环 3:随机播放
    playListSongs: [],
    playListIndex: 0
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      if (ctx.id == id && !isRefresh) {
        this.dispatch('changeMusicPlayStatusAction', true)
        return
      }
      ctx.id = id

      // 修改播放的状态
      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.lyricInfos = []
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ''

      // 请求歌曲详情
      getSongDetail(id).then((res) => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })

      // 请求歌词信息
      getSongLyric(id).then((res) => {
        const lyricString = res.lrc.lyric
        const lyrics = parseLyric(lyricString)
        ctx.lyricInfos = lyrics
      })

      // 播放对应id的歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = id
      audioContext.autoplay = true

      // 监听audioContext一些事件
      if (!ctx.isFirstPlay) {
        this.dispatch('setupAudioContextListenerAction')
        ctx.isFirstPlay = false
      }
    },

    setupAudioContextListenerAction(ctx) {
      // 1. 监听歌曲可以播放
      audioContext.onCanplay(() => {
        audioContext.play()
      })

      // 2. 监听时间改变
      audioContext.onTimeUpdate(() => {
        const currentTime = audioContext.currentTime * 1000

        ctx.currentTime = currentTime

        if (!ctx.lyricInfos.length) return
        let i = 0
        for (; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i]
          if (currentTime < lyricInfo.time) {
            break
          }
        }
        // 设置当前歌词的索引和内容
        const currentIndex = i - 1
        if (ctx.currentLyricIndex !== currentIndex) {
          const currentLyricInfo = ctx.lyricInfos[currentIndex]
          ctx.currentLyricIndex = currentIndex
          ctx.currentLyricText = currentLyricInfo.text
        }
      })

      audioContext.onEnded(() => {
        this.dispatch('changeNewMusicAction')
      })

      audioContext.onPlay(() => {
        ctx.isPlaying = true
      })

      audioContext.onPause(() => {
        ctx.isPlaying = false
      })

      audioContext.onStop(() => {
        ctx.isPlaying = false
        ctx.isStoping = true
      })
    },

    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying

      if (ctx.isFirstPlay && ctx.isStoping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = currentSong.name
        ctx.isStoping = false
      }

      if (ctx.isPlaying) {
        audioContext.play()
      } else {
        audioContext.pause()
      }
    },

    changeNewMusicAction(ctx, isNext = true) {
      let index = ctx.playListIndex

      switch (ctx.playModeIndex) {
        case 0: {
          index = isNext ? index + 1 : index - 1
          if (index === -1) index = ctx.playListSongs.length - 1
          if (index === ctx.playListSongs.length) index = 0
          break
        }
        case 1: {
          break
        }
        case 2:
          {
            index = Math.floor(Math.random() * ctx.playListSongs.length)
            break
          }
          defalult: break
      }


      let currentSong = ctx.playListSongs[index]
      if (!currentSong) {
        currentSong = ctx.currentSong
      } else {
        ctx.playListIndex = index
      }

      this.dispatch('playMusicWithSongIdAction', { id: currentSong.id, isRefresh: true })
    }
  }
})
export { audioContext, playerStore }
