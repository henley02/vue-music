// 需要运行的模块 npm run serve hd_aa index
let moduleList = ['index'];
if (moduleList.length === 0) {
  console.log('请输入至少一个模块');
}
console.log(process.env.NODE_ENV);
let pages = {};
moduleList.forEach(module => {
  if (module.split('_').length > 1) {
    let front = module.split('_')[0];
    let behind = module.split('_')[1];
    pages[front + '/' + behind] = {
      'entry': `src/module/${front}/${behind}/main.js`
    };
  } else {
    pages[module] = {
      'entry': `src/module/${module}/main.js`
    };
  }
});
console.log(pages);

var axios = require('axios');
var bodyParser = require('body-parser');
module.exports = {
  pages,
  // pages: {
  //   index: {
  //     entry: 'src/module/index/main.js'
  //   }
  // },
  configureWebpack: {
    resolve: {
      alias: {
        'public': '@/public',
        'index': '@/module/index',
        'hd': '@/module/hd'
      }
    }
  },
  lintOnSave: undefined,
  devServer: {
    open: true,
    https: false,
    host: 'localhost',
    port: 8080,
    // 添加一个before方法
    before(app) {
      app.use(bodyParser.urlencoded({ extended: true }));
      // 歌单列表处理
      app.get('/api/getDiscList', (req, res) => {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query  // 这是请求的query
        }).then((response) => {
          // response是api地址返回的，数据在data里。
          res.json(response.data);
        }).catch((e) => {
          console.log(e);
        });
      });
      // 音乐文件url处理信息获取
      app.post('/api/getPurlUrl', bodyParser.json(), (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
        axios.post(url, req.body, {
          headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data);
        }).catch((e) => {
          console.log(e);
        });
      });
      // 获取歌词
      app.get('/api/lyric', (req, res) => {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          let ret = response.data;
          if (typeof ret === 'string') {
            var reg = /^\w+\(({[^()]+})\)$/;
            var mathes = ret.match(reg);
            if (mathes) {
              ret = JSON.parse(mathes[1]);
            }
          }
          res.json(ret);
        }).catch((e) => {
          console.log(e);
        });
      });
      // 歌单详情数据
      app.get('/api/getCdInfo', (req, res) => {
        const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          let ret = response.data;

          if (typeof ret === 'string') {
            let reg = /^\w+\(({.+})\)$/;
            const matches = ret.match(reg);
            if (matches) {
              ret = JSON.parse(matches[1]);
            }
          }
          res.json(ret);
        }).catch(e => {
          console.log(e);
        });
      });
      // 搜索
      app.get('/api/search', (req, res) => {
        const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          let ret = response.data;

          if (typeof ret === 'string') {
            let reg = /^\w+\(({.+})\)$/;
            const matches = ret.match(reg);
            if (matches) {
              ret = JSON.parse(matches[1]);
            }
          }
          res.json(ret);
        }).catch(e => {
          console.log(e);
        });
      });
    }
  }
};
