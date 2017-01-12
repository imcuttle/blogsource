var qn = require("qn");

//要上传的空间
bucket = 'images';

//上传到七牛后保存的文件名
key = 'my-nodejs-logo.png';

var fs = require('fs');
var buf = fs.readFileSync('./source/images/ER.png');

var client = qn.create({
  accessKey: 'XeevN74qnAiua6V3jPFkhWYBPk_uboa2BQ-Ekq4z',
  secretKey: 'WC0nPp--StcAaNTIzB54sWr5RxejVe7i0hDzzmbx',
  bucket: 'images',
  origin: 'http://obu9je6ng.bkt.clouddn.com',
  // timeout: 3600000, // default rpc timeout: one hour, optional
  // if your app outside of China, please set `uploadURL` to `http://up.qiniug.com/`
  // uploadURL: 'http://up.qiniu.com/',
});

// upload a stream
client.upload(buf, function (err, result) {
  console.log(result);
  // {
  //   hash: 'FvnDEnGu6pjzxxxc5d6IlNMrbDnH',
  //   key: 'FvnDEnGu6pjzxxxc5d6IlNMrbDnH',
  //   url: 'http://qtestbucket.qiniudn.com/FvnDEnGu6pjzxxxc5d6IlNMrbDnH',
  //   "x:filename": "foo.txt",
  // }
});

