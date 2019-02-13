import { getLyric } from 'index/api/song';
import { ERR_OK } from 'index/api/config';
import { Base64 } from 'js-base64';

export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }

  async getLyric() {
    if (this.lyric) {
      return;
    }
    let res = await getLyric(this.mid);
    if (res.retcode === ERR_OK) {
      this.lyric = Base64.decode(res.lyric);
    }
  }
};

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: ''
  });
}

function filterSinger(singer) {
  let ret = [];

  if (!singer) {
    return '';
  }
  singer.forEach(item => {
    ret.push(item.name);
  });
  return ret.join('/');
}
