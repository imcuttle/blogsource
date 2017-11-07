---
title: 毕设周记三
datetime: 2017-04-16 09:00:42
categories:
tags:
cover:
keywords:
---

题目：刷脸签到系统  
姓名：余聪  
学号：19130126

主要完成了 nodejs 调用 opencv 的工作；后续利用 javascript 进行样本的预处理（灰化，级联分类器检测，裁剪等），样本的训练与人脸的对比识别...


## 知识点介绍 
- nodejs 调用 C/C++   
需要使用 [`C/C++ Addons`](https://nodejs.org/api/addons.html)   。图像处理最强大的库 opencv 便是用 C++ 实现的，这就不得不需要 nodeJs 与 C++ 之前通信，通过 nodeJs 调用 opencv 的方法，node-opencv 便是利用 nan （解决平台间兼容性问题，将异步事件驱动封装）与 v8 （javascript 对应的数据类型与 C++映射） ，通过 node-gyp 工具，将 C++ 打包成 一个动态链接库 *.node，通过 require 即可调用。


- 人脸识别流程  
人脸识别实际包括构建人脸识别系统的一系列相关技术，包括人脸图像采集、人脸定位、人脸识别预处理、身份确认以及身份查找等。上一步已经完成了人脸的采集； 人脸定位也就是人脸的检测，在一张图片中，找出人脸的位置。通过一些特征提取的方法，如HOG特征，LBP特征，Haar特征，训练得到级联分类器，分类器对图像的任意位置和任意尺寸的部分(通常是正方形或长方形)进行分类，判定是或不是人脸。opencv源码中提供了一些常用的分类器（XML）。人脸识别预处理也就是对图像进行灰化，人脸检测，得到统一大小的人脸图片；然后便是识别了，对样本训练生成特征脸后，对于输入的人脸进行预处理后，得到其特征脸权重向量，计算向量距离，找到最小距离的样本人脸。

- 特征脸  
特征脸（Eigenface）是指用于机器视觉领域中的人脸识别问题的一组特征向量。这些特征向量是从高维矢量空间的人脸图像的协方差矩阵计算而来。一组特征脸 可以通过在一大组描述不同人脸的图像上进行主成分分析（PCA）获得。任意一张人脸图像都可以被认为是这些标准脸的组合。另外，由于人脸是通过一系列向量（每个特征脸一个比例值）而不是数字图像进行保存，可以节省很多存储空间。可以看到特征脸的生成是需要整个样本数据的，所以如果用户修改了样本数据，需要对全部样本重新训练，得到一组全新的特征脸。

- PCA  
主成分分析（Principal components analysis，PCA）是一种分析、简化数据集的技术。主成分分析经常用于减少数据集的维数，同时保持数据集中的对方差贡献最大的特征。这是通过保留低阶主成分，忽略高阶主成分做到的。这样低阶成分往往能够保留住数据的最重要方面。


## 工作

整合了数据库和 opencv 后，系统架构如下：
<img src="https://ooo.0o0.ooo/2017/04/16/58f2ca8f8c500.jpg" width="448" height="385"/>

### opencv 环境安装

由于开发平台是 OSX ，而 OSX 有 Homebrew 神器

```bash
# 安装 Homebrew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# 设置 Homebrew镜像代理，国内下载加速
cd "$(brew --repo)"
git remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git
brew update
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles' >> ~/.bash_profile
source ~/.bash_profile

# 安装 opencv
brew tap homebrew/science
brew install opencv
```

### node addons尝试
node addons 是在 node 环境调用 C 系列接口的方法，已经有人用该方法写过 node-opencv，并在此基础上我还加上了 `CircleLBP` `RectLBP` `ToThreeChannels` `PCA` 算法。其中 `ToThreeChannels` 是将 单通道（灰）或者 RGBA 通道变成 RGB 通道。

```c++
NAN_METHOD(Matrix::ToThreeChannels) {
  Nan::HandleScope scope;
  Matrix *self = Nan::ObjectWrap::Unwrap<Matrix>(info.This());
  cv::Mat image;

  if (self->mat.channels() == 3) {
    image = self->mat;
  } else if (self->mat.channels() == 1) {
    cv::Mat myimg = self->mat;
    cv::cvtColor(myimg, image, CV_GRAY2RGB);
  } else if(self->mat.channels() == 4){
    cv::Mat myimg = self->mat;
    cv::cvtColor(myimg, image, CV_BGRA2RGB);
  } else {
    Nan::ThrowError("those channels are not supported");
  }

  self->mat = image;
  info.GetReturnValue().Set(Nan::Null());
}
```

### 图片预处理（人脸检测...）

通道统一 -> 灰化 -> 级联分类器检测人脸 -> 人脸尺寸统一 -> 保存

经过多次尝试后，对于学生证件照，最终比较得出，采用 LBP 级联分类器，窗口放大 1.95 倍左右效果较好。（测试数据在 `backend/data/summary.json`）

<img src="https://ooo.0o0.ooo/2017/01/22/5884929797559.jpg" alt="" width="770" height="436">

<img src="https://ooo.0o0.ooo/2017/01/22/588492ae5471e.jpg" alt="" width="770" height="436">

### 识别算法测试与确定

比较 opencv 中三种人脸识别算法，Eigen、Fisher、LBPH。数据在`backend/cpptest` 中


<table border="0"><caption><em>opencv 人脸识别算法比较</em></caption><tbody><tr><th rowspan="2" style="text-align: center;">算法/时间(ms)</th><th colspan="2">实验1</th><th colspan="2">实验2</th><th colspan="2">实验3</th></tr><tr><td>训练</td><td>预测</td><td>训练</td><td>预测</td><td>训练</td><td>预测</td></tr><tr><th>Eigen</th><td>0.030648</td><td>0.010711</td><td>0.025524</td><td>0.011132</td><td>0.029332</td><td>0.007791</td></tr><tr><th>Fisher</th><td>0.040043</td><td>0.0089</td><td>0.039244</td><td>0.007145</td><td>0.033777</td><td>0.008276</td></tr><tr><th>LBPH</th><td>0.035812</td><td>0.071586</td><td>0.034822</td><td>0.075267</td><td>0.03204</td><td>0.067166</td>
</tr></tbody></table>

综合比较可以得出，效率 Eigen > Fisher > LBPH
所以采用Eigen（特征脸）算法

### 学生信息接口（爬虫）

该系统还需要获取到学生的个人信息，比如通过学号和密码验证是否正确等等。在同一届的同学中，已经有一位同学研究教务系统比较透彻了，而且做了一个[查南师](http://njnu.chaiziyi.com.cn/)网站，所以我只需要爬取该网站的接口即可。

### 图片预处理指令解释
```bash
# location: gp-njnu-photos-backend/package.json
# usage: (cd gp-njnu-photos-backend && npm run $scriptName)

# 图片预处理
# detect face, then gray, save
# eg.  $ npm run grayface 2013 191301
#      $ npm run grayface 2013
#      $ npm run grayface
# npm run grayface year classno


# 样本训练并写入文件。
# after read grayface images, then train and save it
# eg.  $ node pretreat/train_save.js -f --args 2013
#      $ node pretreat/train_save.js -f --args 2013 191301
# -f：force 重新训练，不论是否已存在训练数据
# --args year classno 训练哪一年哪一班级的图片

```

### 数据解释

在 `gp-njnu-photos-backend/data` 目录中
```
data/
├── cache.json  # 由于学生的数据和身份验证需要通过查南师网站，其中中转的服务器较多，所以在本服务器做了个缓存数据，过7天将会清理该缓存。
├── face-recognizer/
│   ├── 2013-011301.yaml    # 特征脸数据
│   ├── 2013-011302.yaml  
│   └── facesNumObj.json    # 保存每个学号对应多少张人脸
├── face-recognizer.json    # 保存每年级每个班级对应的学生照片的路径地址
├── haarcascade_eye_tree_eyeglasses.xml  # 一系列分类器数据
├── haarcascade_eye.xml
├── haarcascade_frontalface_alt_tree.xml
├── haarcascade_frontalface_alt.xml
├── haarcascade_frontalface_alt2.xml
├── haarcascade_frontalface_default.xml
├── haarcascade_fullbody.xml
├── haarcascade_lefteye_2splits.xml
├── haarcascade_lowerbody.xml
├── haarcascade_mcs_eyepair_big.xml
├── haarcascade_mcs_eyepair_small.xml
├── haarcascade_mcs_lefteye.xml
├── haarcascade_mcs_mouth.xml
├── haarcascade_mcs_nose.xml
├── haarcascade_mcs_righteye.xml
├── haarcascade_mcs_upperbody.xml
├── haarcascade_profileface.xml
├── haarcascade_righteye_2splits.xml
├── haarcascade_upperbody.xml
├── hogcascade_cars_sideview.xml
├── images/         # 预处理后的样本，真正的样本数据
│   ├── 2013/
│   ├── 2015/
│   └── 2016/
├── students.json   # 不同分类器不同参数的比对
└── summary.json    # 每个年级每个班级学生学号的集合
```

## 总结

由于核心算法调用的为开源的 opencv 方法，适用性不是特别高，准确率有待提高。

