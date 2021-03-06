---
title: 「项目拾遗」几个计算机图形学的前端程序
datetime: 2016-05-10 18:39:47
categories: [前端]
tags: [js,canvas,threejs]
cover: /images/gif1.gif
---

# 前言
这是一篇不太正规的「计算机图形学论文」，其实论文谈不上，因为根本上不到研究的层次，就是自己瞎捣鼓。
主要介绍了几个与图形学相关的程序，皆采用前端技术实现，点击即可查看。

- [简单的绘图程序](http://moyuyc.github.io/htm/painter/)
- [三次贝赛尔曲线应用-绘制平面动态花瓣](http://moyuyc.github.io/2016/04/26/canvas%E7%BB%98%E5%88%B6%E5%B9%B3%E9%9D%A2%E8%8A%B1%E7%93%A3/)
- [动态绘制三次贝赛尔曲线](/htm/bezier.html)
- [三维几何体的基本变换与组合变换应用](http://moyuyc.xyz/play_3d/play_3d_demo1.html)

<!--more-->
# 主要内容
## 简单的绘图程序
### 介绍
主要运用HTML5 canvas API与相关图形学知识实现的绘图程序（还包括部分图像处理功能，不介绍）。
能够选择图形类型（Pen/Line/Circle）,画笔颜色（随机生成）,画笔宽度, 图形对象拖拽移动，图形种子填充算法。

### 演示图片

<img src="/images/gif1.gif" alt="img" width="1142" height="747" />

### 代码解释
`Shape.js ： 主要包含一些图形类`

点类代码

```
Point: function (x, y) {
    this.x = x;
    this.y = y;
    this.distance = function (p) {
        p = p?p:new Shape.Point(0,0);
        return Math.sqrt(Math.pow(p.x-this.x,2)+Math.pow(p.y-this.y,2));
    };
    this.move = function(offsetX,offsetY){
        this.x+=offsetX;this.y+=offsetY;
    };
    this.draw = function (paint, color, linewidth) {
        this.color = color?color:this.color;
        this.linewidth = linewidth?linewidth:this.linewidth;
        paint.strokeStyle = this.color ? this.color : 'black';
        paint.lineWidth = this.linewidth!=null ? this.linewidth : 1;
        paint.beginPath();
        paint.moveTo(this.x, this.y);
        paint.lineTo(this.x + 1, this.y + 1);
        paint.stroke();
        paint.save();
        return this;
    }
}
```

线段类代码

```
Line: function (p1, p2) {
    this.sp = p1;
    this.ep = p2;
    //this.color;this.linewidth;
    this.move = function(offsetX,offsetY){
        this.sp.x+=offsetX;this.sp.y+=offsetY;
        this.ep.x+=offsetX;this.ep.y+=offsetY;
    };
    // 不足：未考虑线宽，用户较难选中
    this.isIn = function (point) {
        var x = point.x, y = point.y;
        if((y-this.sp.y)*(x-this.ep.x)==(y-this.ep.y)*(x-this.sp.x))
            return true;
        return false;
    };
    // 中点划线法
    this.draw = function (paint, color, linewidth) {
        this.color = color?color:this.color;
        this.linewidth = linewidth!=null?linewidth:this.linewidth;
        color = this.color; linewidth = this.linewidth;
        var ep = this.ep, sp = this.sp,
            dX = ep.x - sp.x,
            dY = ep.y - sp.y,
            a = sp.y - ep.y,
            b = ep.x - sp.x;
        if (Math.abs(dX) >= Math.abs(dY)) {
            if (dX >= 0 && dY >= 0) {
                var d = b + 2 * a, d1 = 2 * a, d2 = 2 * (a + b);
                new Shape.Point(sp.x, sp.y).draw(paint, color, linewidth);
                for (var x = sp.x + 1, y = sp.y; x < ep.x; x++) {
                    if (d >= 0) d = d + d1;
                    else {
                        y++;
                        d = d + d2;
                    }
                    new Shape.Point(x, y).draw(paint, color, linewidth);
                }
            }
            else if (dX >= 0 && dY <= 0) {
                var d = -b + a << 1, d1 = (a - b) << 1, d2 = a << 1;
                new Shape.Point(sp.x, sp.y).draw(paint, color, linewidth);
                for (var x = sp.x + 1, y = sp.y; x < ep.x; x++) {
                    if (d >= 0) {
                        y--;
                        d = d + d1;
                    }
                    else d = d + d2;
                    new Shape.Point(x, y).draw(paint, color, linewidth);
                }
            }
            else if (dX <= 0 && dY <= 0) {
                var d = -b - 2 * a, d1 = -2 * a, d2 = -2 * (a + b);
                new Shape.Point(sp.x, sp.y).draw(paint, color, linewidth);
                for (var x = sp.x - 1, y = sp.y; x > ep.x; x--) {
                    if (d >= 0) d = d + d1;
                    else {
                        y--;
                        d = d + d2;
                    }
                    new Shape.Point(x, y).draw(paint, color, linewidth);
                }
            }
            else {
                var d = b - 2 * a, d1 = 2 * (b - a), d2 = -2 * a;
                new Shape.Point(sp.x, sp.y).draw(paint, color, linewidth);
                for (var x = sp.x - 1, y = sp.y; x > ep.x; x--) {
                    if (d >= 0) {
                        y++;
                        d = d + d1;
                    }
                    else d = d + d2;
                    new Shape.Point(x, y).draw(paint, color, linewidth);
                }
            }
        }
        else {
            if (dX >= 0 && dY >= 0) {
                var d = a + 2 * b, d1 = 2 * (a + b), d2 = 2 * b;
                new Shape.Point(sp.x, sp.y).draw(paint, color, linewidth);
                for (var x = sp.x, y = sp.y + 1; y < ep.y; y++) {
                    if (d >= 0) {
                        x++;
                        d = d + d1;
                    }
                    else {
                        d = d + d2;
                    }
                    new Shape.Point(x, y).draw(paint, color, linewidth);
                }
            }
            else if (dX >= 0 && dY <= 0) {
                var d = a - 2 * b, d1 = -2 * b, d2 = 2 * (a - b);
                new Shape.Point(sp.x, sp.y).draw(paint, color, linewidth);
                for (var x = sp.x, y = sp.y - 1; y > ep.y; y--) {
                    if (d >= 0)      d = d + d1;
                    else {
                        x++;
                        d = d + d2;
                    }
                    new Shape.Point(x, y).draw(paint, color, linewidth);
                }

            }
            else if (dX <= 0 && dY <= 0) {
                var d = -a - 2 * b, d1 = -2 * (a + b), d2 = -2 * b;
                new Shape.Point(sp.x, sp.y).draw(paint, color, linewidth);
                for (var x = sp.x, y = sp.y - 1; y > ep.y; y--) {
                    if (d >= 0) {
                        x--;
                        d = d + d1;
                    }
                    else               d = d + d2;
                    new Shape.Point(x, y).draw(paint, color, linewidth);
                }

            }
            else {
                var d = -a + 2 * b, d1 = 2 * b, d2 = 2 * (b - a);
                new Shape.Point(sp.x, sp.y).draw(paint, color, linewidth);
                for (var x = sp.x, y = sp.y + 1; y < ep.y; y++) {
                    if (d >= 0)           d = d + d1;
                    else {
                        x--;
                        d = d + d2;
                    }
                    new Shape.Point(x, y).draw(paint, color, linewidth);
                }
            }
        }
        return this;
    }
}
```

圆类代码

```
Circle: function (cp, r) {
    this.cp = cp;
    this.r = r;
    this.move = function(offsetX,offsetY){
        this.cp.x+=offsetX;this.cp.y+=offsetY;
    };
    //this.color;this.linewidth;
    this.isIn = function (point) {
        var x = point.x, y = point.y;
        return (x-this.cp.x)*(x-this.cp.x)+(y-this.cp.y)*(y-this.cp.y)<=this.r*this.r;
    };
    // 八分法画圆
    this.draw = function (paint, color, linewidth) {
        this.color = color?color:this.color;
        this.linewidth = linewidth?linewidth:this.linewidth;
        color = this.color; linewidth = this.linewidth;
        //console.log(color);
        var r = this.r, cp = this.cp,
            d = 1 - r, p = new Shape.Point(0, r);
        while (p.x <= p.y) {
            new Shape.Point(cp.x + p.x, cp.y + p.y).draw(paint, color, linewidth);
            new Shape.Point(cp.x + p.x, cp.y - p.y).draw(paint, color, linewidth);
            new Shape.Point(cp.x - p.x, cp.y + p.y).draw(paint, color, linewidth);
            new Shape.Point(cp.x - p.x, cp.y - p.y).draw(paint, color, linewidth);
            new Shape.Point(cp.x + p.y, cp.y + p.x).draw(paint, color, linewidth);
            new Shape.Point(cp.x + p.y, cp.y - p.x).draw(paint, color, linewidth);
            new Shape.Point(cp.x - p.y, cp.y + p.x).draw(paint, color, linewidth);
            new Shape.Point(cp.x - p.y, cp.y - p.x).draw(paint, color, linewidth);
            p.x++;
            if (d < 0) d = d + 2 * p.x + 1;
            else {
                p.y--;
                d = d + 2 * p.x - 2 * p.y + 1;
            }
        }
        return this;
    };
    //种子填充算法 深度优先搜索，基于栈，isam表示是否含动画填充效果
    this.dfsFill = function (paint,p,color,isam) {
        isam = isam || false;
        var stack = [p],hashmap = {},container=[];
        while (stack.length !== 0){
            p = stack.pop();
            if(isam)
                container.push(p);
            else
                p.draw(paint,color);
            [new Shape.Point(p.x,p.y-1), new Shape.Point(p.x-1,p.y), new Shape.Point(p.x,p.y+1), new Shape.Point(p.x+1,p.y)]
                .forEach(ele=>{
                    if(this.isIn(ele) && !hashmap[ele]) {
                        stack.push(ele);
                        hashmap[ele] = hashmap[ele]+1 || 0;
                    }
                });
        }
        console.log(hashmap);
        if(isam) {
            var animate = requestAnimationFrame;
            animate(function () {
                if (!container.length) return;
                container.shift().draw(paint, color);container.shift().draw(paint, color);
                container.shift().draw(paint, color);container.shift().draw(paint, color);
                container.shift().draw(paint, color);container.shift().draw(paint, color);
                container.shift().draw(paint, color);container.shift().draw(paint, color);
                animate(arguments.callee);
            })
        }
    };
    //种子填充算法 广度优先搜索，基于队列。
    this.bfsFill = function (paint,p,color,isam) {
        isam = isam || false;
        var queue = [p],hashmap = {},container=[];
        while (queue.length !== 0){
            p = queue.shift();
            if(isam)
                container.push(p);
            else
                p.draw(paint,color);
            [new Shape.Point(p.x,p.y-1), new Shape.Point(p.x-1,p.y), new Shape.Point(p.x,p.y+1), new Shape.Point(p.x+1,p.y)]
                .forEach(ele=>{
                    if(this.isIn(ele) && !hashmap[ele]) {
                        queue.push(ele);
                        hashmap[ele] = hashmap[ele]+1 || 0;
                    }
                });
        }
        console.log(hashmap);
        if(isam) {
            var animate = requestAnimationFrame;
            animate(function () {
                if (!container.length) return;
                container.shift().draw(paint, color);container.shift().draw(paint, color);
                container.shift().draw(paint, color);container.shift().draw(paint, color);
                container.shift().draw(paint, color);container.shift().draw(paint, color);
                container.shift().draw(paint, color);container.shift().draw(paint, color);
                animate(arguments.callee);
            })
        }
    }
}
```

路径类代码

```
Path: function (points) {
    this.ps = points;
    this.move = function(offsetX,offsetY){
        for(var i = 0;i<this.ps.length;i++){
            this.ps[i].x+=offsetX;
            this.ps[i].y+=offsetY;
        }
    };
    this.isIn = function (point) {
        var p = this.ps[0];
        for(var i=1;i<this.ps.length;i++){
            if(new Shape.Line(p,this.ps[i]).isIn(point))
                return true;
            p = this.ps[i];
        }
        return false;
    };
    // 调用canvas提供的api
    this.draw = function (paint,color,linewidth) {
        this.color = color?color:this.color;
        this.linewidth = linewidth?linewidth:this.linewidth;
        color = this.color; linewidth = this.linewidth;
        //console.log(color);
        var arr = this.ps;
        if(arr.length==0)  return;
        paint.beginPath();
        paint.strokeStyle = color ? color : 'black';
        paint.lineWidth = linewidth ? linewidth : 1;
        paint.moveTo(arr[0].x,arr[0].y);
        for(var i =1;i<arr.length;i++){
            paint.lineTo(arr[i].x,arr[i].y);
        }
        paint.stroke();
        return this;
    }
}
```

`canvas.js: 包含其他一些对事件的绑定或者对控件的控制等代码`

选中图形进行拖动函数

```
dragMoveHandle = function () {
    var f1 = function(e){
    var x = e.offsetX, y = e.offsetY;
    var v = Tool.getInFirstShape(new Shape.Point(x,y));
    if(v){
	var f2 = function (e2) {
	    if(e2.buttons==1){
		var offsetx = e2.offsetX-x, offsety = e2.offsetY-y;
		x=e2.offsetX; y = e2.offsetY;
		v.move(offsetx,offsety);
		Tool.refresh();
	    }
	},f3 = function (e3) {
	    var offsetx = e3.offsetX-x, offsety = e3.offsetY-y;
	    v.move(offsetx,offsety);
	    Tool.refresh();
	    // e3.stopPropagation();
	    $(this).off('mousemove',f2).off('mouseup',f3);
	};
	$(paint.canvas).on('mousemove',f2).on('mouseup',f3).off('mousedown',f1);
    }else
	$('[role=opType-item]').removeClass('active');
}
$(paint.canvas).on('mousedown',f1)
}
```

关于Tool对象

```
Tool = {
    getInFirstShape : function(p){
        var f = function(d){
            for(var i =0;i< d.length;i++){
                if(d[i].isIn(p))//点p是否在d[i]图形对象中？
                    return d[i];
            }
            return false;
        };
        var r;
        for(var d in paint.data)
            //paint.data 表示存在于画布中的所有图形对象
            if((r=f(paint.data[d]))!=false)
                return r;
    },
    // 重新绘制
    refresh : function () {
        paint.clearRect(0,0,paint.canvas.width,paint.canvas.height);
        for(var i =0;i<paint.data.Paths.length;i++)
            paint.data.Paths[i].draw(paint);
        for(var i =0;i<paint.data.Lines.length;i++)
            paint.data.Lines[i].draw(paint);
        for(var i =0;i<paint.data.Circles.length;i++)
            paint.data.Circles[i].draw(paint);
    }
}
```

### 不足之处
1. 对于`Line`的`isIn`方法，未考虑到线宽的因素，用户很难准确选中线段
2. 对于拖动图形的事件处理逻辑较复杂。
3. 对于图形类中未使用到`js`中的原型与原型继承，降低了代码复用度。

## 三次贝赛尔曲线应用-绘制平面动态花瓣
### 介绍
主要运用HTML5 canvas API与相关图形学知识实现的平面动态花瓣绘制。

### 演示图片

<img src="/images/gif2.gif" alt="img" width="992" height="604" />

### 代码解释

- 核心代码
```javascript
function Flower(c,petals,size,x,y,rotate){
	this.c = c || [255,255,255];
	this.petals = petals || 4;
	this.size = size || 5;
	this.x = x || 0;
	this.y = y || 0;
	this.rotate = rotate || 0;
}
Flower.prototype.draw = function(){
	var _rad = this.size,_num_pts=this.petals,_x=this.x,_y=this.y,c=this.c;
	ctx.save();
	ctx.shadowBlur = 30; //阴影程度
	ctx.lineWidth = 1;
	ctx.shadowColor = utils.rgba(c[0],c[1],c[2],1); //阴影颜色
	ctx.fillStyle = utils.rgba(c[0],c[1],c[2],.6); //填充颜色
	c2 = c.map((x)=>Math.floor(x/1.6));           //lambda表达式写法
	ctx.strokeStyle = utils.rgba(c2[0],c2[1],c2[2],1);  //边框颜色
	var pts = [];
	var _a = this.rotate+(tick*1);
	for (var i = 0 ; i <= _num_pts ; i++){//增量法提高效率
		pts.push({x:utils.P2L(_rad, _a).x,y:utils.P2L(_rad, _a).y}); //P2L将极坐标转换为平面坐标
		_a += (360/_num_pts);
	}
	for (var i = 1 ; i<= _num_pts; i+=2){
		idx= i%_num_pts;
		ctx.beginPath();//开始绘制
		ctx.moveTo(_x,_y);//起点为(_x,_y)
		ctx.bezierCurveTo(_x+pts[i-1].x,_y+pts[i-1].y,_x+pts[idx+1].x,_y+pts[idx+1].y,_x,_y);//绘制贝塞尔曲线
		ctx.stroke();//闭合图形边框
		ctx.fill();//填充图形
	}
	ctx.restore();
}
HTMLCanvasElement.prototype.magicBg = function(){
	var ctx = this.getContext('2d');
	if(!this.grd){
		//实现从画布中心往外呈圆形扩散，渐变。
		this.grd=ctx.createRadialGradient(this.width/2,this.height/2,0,this.width/2,this.height/2,Math.min(this.width,this.height)/1.2);
		this.grd.addColorStop(0,"rgba(255,255,255,.25)");
		this.grd.addColorStop(1,this.utils.rgba(200+this.utils.randomInt(56),200+this.utils.randomInt(56),200+this.utils.randomInt(56),.65));
	}
	ctx.save();
	ctx.clearRect(0,0,this.width,this.height);
	ctx.fillStyle = this.grd;
	ctx.fillRect(0,0,this.width,this.height);
	ctx.restore();
}
```
- Flower对象解释

|参数 | 说明 |默认| 类型 |
|----|-----|------|----|
|`c`|花瓣的颜色|[255,255,255]|Array|
|`petals`|花瓣个数|4|Number|
|`size`|半径大小|5|Number|
|`x`   |中心 x 坐标|0|Number|
|`y`   |中心 y 坐标|0|Number|
|`rotate`|绕中心旋转角度|0|Number(单位：度)|

- `Flower.draw` 方法解释

|变量|说明|
|----|---------|
|`_rad`|radix，对应`size`|
|`_num_pts`|对应`petals`|
|`_x`|对应`x`|
|`_y`|对应`y`|
|`c`|对应`c`|

- 关于贝塞尔曲线，[参考资料](http://bbs.csdn.net/topics/390358020)

<img src="/images/bezier3.gif" alt="IMG" width="240" height="100" />
<center>图：三次贝塞尔曲线动态绘制效果</center>
<img src="http://obu9je6ng.bkt.clouddn.com/FqrMRZZXMInLzy27Mc6CCWwHrC_v?imageslim" alt="ClipboardImage" width="746" height="725" />
<center>图：花瓣与其贝塞尔曲线控制点</center>
- 怎么使用？
1.	`<script src='drawflower.js'></script>`
2.	`canvas.drawFlower(option);`

```javascript
//default option
{
	animate:false,
	rotate:90,
	randomSize:true,
	randomColor:true,
	randomPetals: true,
	pos:{
		x:this.width/2,
		y:this.height/2
	}
}
```
or
```javascript
{
	animate:true,
	rotate:-20,
	randomSize:false,
	size:10,
	randomColor:false,
	color:[100,100,100],
	randomPetals: false,
	petals:6,
	pos:{
		x:0,
		y:0
	}
}
```

## 动态绘制三次贝赛尔曲线
### 介绍
应用canvas API, 事件绑定, 达到动态绘制三次贝赛尔曲线效果。

### 演示图片

<img src="/images/gif3.gif" alt="img" width="792" height="649" />

### 代码解释
自己定义的`Pos` `Rect` `Circle` 类
```javascript
function Pos(x,y){this.x=x;this.y=y;}
function Circle(p,r){this.p=p;this.r=r;}
Circle.prototype.draw = function(sty){
    ctx.save();
    ctx.strokeStyle=sty||'blue';
    ctx.beginPath();
    ctx.arc(this.p.x, this.p.y, this.r, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.restore();
}
// p is in Circle?
Circle.prototype.around=function(p){
    return (p.x-this.p.x)*(p.x-this.p.x)+ (p.y-this.p.y)*(p.y-this.p.y)<=this.r*this.r;
}
function Rect(p,w,h){this.p=p;this.w=w;this.h=h;};
Rect.prototype.draw = function (style) {
    ctx.save();
    ctx.strokeStyle=style||'blue';
    var v = this.w>>> 1,t = this.h>>>1;
    ctx.strokeRect(this.p.x-v, this.p.y-t,this.w,this.h);
    ctx.restore();
}
// p is in Rect?
Rect.prototype.around = function (p) {
    var v = this.w>>> 1,t = this.h>>>1;
    return p.x>=this.p.x-v && p.x<=this.p.x+v && p.y>=this.p.y-t && p.y<=this.p.y+t;
}
```

初始化
```javascript
var midP = new Pos(window.innerWidth>>>1,window.innerHeight>>>1),
    sP = new Circle(new Pos(midP.x-100,midP.y-100),4),
    cP1= new Rect(new Pos(midP.x-80,midP.y+10),8,8),
    cP2= new Rect(new Pos(midP.x+80,midP.y+20),8,8),
    eP = new Circle(new Pos(midP.x+100,midP.y+100),4);
```

绘制三次贝塞尔曲线
```javascript
function drawBezier(ps){
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(ps[0].x,ps[0].y);
    ctx.bezierCurveTo(ps[1].x,ps[1].y,ps[2].x,ps[2].y,ps[3].x,ps[3].y);
    ctx.stroke();
    // 自己实现的绘制虚线方法
    ctx.dashedLineTo(ps[0].x,ps[0].y,ps[1].x,ps[1].y);
    ctx.dashedLineTo(ps[3].x,ps[3].y,ps[2].x,ps[2].y);
    ctx.restore();
}
```

`ctx.dashedLineTo`方法
```javascript
CanvasRenderingContext2D.prototype.dashedLineTo = function (fromX, fromY, toX, toY, pattern) {
    // default interval distance -> 5px
    if (typeof pattern === "undefined") {
        pattern = 5;
    }
    // calculate the delta x and delta y
    var dx = (toX - fromX);
    var dy = (toY - fromY);
    var distance = Math.floor(Math.sqrt(dx*dx + dy*dy));
    var dashlineInteveral = (pattern <= 0) ? distance : (distance/pattern);
    var deltay = (dy/distance) * pattern;
    var deltax = (dx/distance) * pattern;

    // draw dash line
    this.beginPath();
    var f = 1;
    while (dashlineInteveral-->0){
        if(f) {
            this.lineTo(fromX, fromY);
        } else {
            this.moveTo(fromX, fromY);
        }
        fromX += deltax; fromY += deltay; // 增量法
        f = 1-f;
    }
    this.stroke();
};
```

鼠标事件绑定处理
```javascript
canvas.addEventListener('mousedown', function (e1) {
    var p1 = new Pos(e1.offsetX,e1.offsetY),c;
    [sP,cP1,cP2,eP].every(ele=>{
        if(ele.around(p1)){
            c = ele;
            return false;
        }
        return true;
    });
    if(c){
        c.draw('red');
        canvas.addEventListener('mousemove',function (e) {
            this.mousemove = arguments.callee;
            if(e.buttons===1){// left mouse pressed down
                var pos = new Pos(e.offsetX,e.offsetY);
                c.p = pos;
                rePaint([c]);
                c.draw('red');
            }
        });
    }
})
canvas.addEventListener('mouseup', function (e) {
    this.removeEventListener('mousemove',this.mousemove);
    rePaint();
});
```

`rePaint(ignores)` 重新绘制函数
```javascript
// ignores 为跳过不重绘的点(Circle/Rect)
function rePaint(ignores){
    ctx.save();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(ignores==null){
        cP1.draw();
        cP2.draw();
        sP.draw();
        eP.draw();
    }
    else {
        [sP,cP1,cP2,eP].forEach(el=>{
            if(ignores.indexOf(el)==-1)
                el.draw();
        });
    }
    drawBezier([sP.p,cP1.p,cP2.p,eP.p]);
    ctx.restore();
}
```

## 三维几何体的基本变换与组合变换应用
### 介绍
运用前端WebGL框架[threejs](http://three.org)，结合相关矩阵变换知识完成。

### 演示图片

<img src="/images/gif4.gif" alt="img" width="1920" height="995" />

### 代码解释
[三维基本变换组合变换文档参考下载](/htm/4三维基本变换5组合变换.doc)

1. 基本变换之平移变换
    <img src="http://obu9je6ng.bkt.clouddn.com/FlInRAsxX_jMvJHaZQvaKK0vF2O8?imageslim" alt="ClipboardImage" width="586" height="156" />

    ```javascript
    var matD = new THREE.Matrix4();
    //thressjs 封装的API，产生平移变换矩阵
    matD.makeTranslation(myctls[0].x,myctls[0].y,myctls[0].z);
    // mesh为几何体，将其矩阵与平移变换矩阵相乘
    mesh.matrix.multiply(matD);
    ```

2. 基本变换之比例变换
    <img src="http://obu9je6ng.bkt.clouddn.com/FpnmgsA3Km1IRwmog3nOD45TsJRb?imageslim" alt="ClipboardImage" width="531" height="141" />

    ```javascript
    matD.makeScale(myctls[1].x,myctls[1].y,myctls[1].z);
    mesh.matrix.multiply(matD);
    ```

3. 组合变换之关于任意向量旋转

    ```javascript
    var v3 = myctls[2].vector.toVector3();
    matD.makeRotationAxis(v3.normalize(),myctls[2].degree/360*Math.PI)
    mesh.matrix.multiply(matD);
    ```

4. ...

# 总结
1. 学习巩固了相关图形学的知识。
2. 学习了相关前端技术对图形的处理方法。
3. 对于WebGL简单入门了，以后可以往更酷炫的3D效果靠近。

