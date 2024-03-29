var tetris={
	OFFSET:15,//保存容器的内边距
	CSIZE:26,//保存每个格子的宽高
	pg:null,//保存游戏容器div
	shape:null,//保存正在下落的主角图形
	nextShape:null,//保存下一个备胎图形
	interval:600,//保存图形下落的时间间隔 速度(数值越大 下落的速度越慢)	
	timer:null,//保存当前动画的序号
	wall:null,//保存所有已经停止下落的方块的二维数组
	RN:20,//总行数
	CN:10,//总列数
	lines:0,//保存消除的总行数
	score:0,//保存当前得分
	SCORES:[0,10,30,60,100],
		// 0  1  2  3   4
	state:1,//保存游戏状态
	RUNNING:1,//运行状态
	GAMEOVER:0,//游戏结束
	PAUSE:2,//暂停状态
	start:function(){
		this.state=this.RUNNING;//重置游戏状态
		this.lines=0;this.score=0;//重置游戏行数和分数
		//将wall初始化为空数组
		this.wall=[];
		//从r从0开始，到RN结束 每次增1
		for(var r=0;r<this.RN;r++){
			//设置wall中的r位置为CN个空数组 new Array(CN)
			this.wall[r]=new Array(this.CN);
		}
		//找到class为playground的div保存在pg属性中
		this.pg=
		  document.getElementsByClassName("playground")[0];
		//随机生成主角图形，保存在shape中
		this.shape=this.randomShape();
		//生成备胎图形
		this.nextShape=this.randomShape();
		//调用paintShape绘制主角图形
		this.paint();
		//启动周期性定时器 设置任务函数为moveDown 时间间隔为interval
		this.timer=setInterval(this.moveDown.bind(this),this.interval);
		//为当前页面绑定键盘按下事件
		document.onkeydown=function(e){
			switch(e.keyCode){//判断键盘号
				//如果是37:左移
				case 37:this.state==this.RUNNING&&this.moveLeft();break;
				//如果是39:右移
				case 39:this.state==this.RUNNING&&this.moveRight();break;
				//如果是40:下移
				case 40:this.state==this.RUNNING&&this.moveDown();break;
				//如果是32 就一落到底
				case 32:this.state==this.RUNNING&&this.hardDrop();break;
				//如果是38 调右转方法
				case 38:this.state==this.RUNNING&&this.rotateR();break;
				//如果是90 调左转方法
				case 90:this.state==this.RUNNING&&this.rotateL();break;
				//如果是80 调暂停方法
				case 80:this.state==this.RUNNING&&this.pause();break;
				//如果是67 调用继续方法
				case 67:this.state==this.PAUSE&&this.myContinue();break;
				//如果是81 调用结束方法
				case 81:this.gameOver();break;
				//如果是83 调用结束方法
				case 83:this.state==this.GAMEOVER&&this.start();break;
			}
		}.bind(this);
	},
	//结束方法
	gameOver:function(){
		this.state=this.GAMEOVER;
		clearInterval(this.timer);
		this.timer=null;
		this.paint();
	},
	//暂停方法
	pause:function(){
		this.state=this.PAUSE;
		clearInterval(this.timer);
		this.timer=null;
		this.paint();
	},
	//继续方法
	myContinue:function(){
		this.state=this.RUNNING;
		this.timer=setInterval(
			this.moveDown.bind(this),this.interval	
		);
		this.paint();
	},
	canRotate:function(){
		//遍历主角图形中的每个cell
		for (var i=0;i<this.shape.cells.length ;i++ )
		{
			var cell=this.shape.cells[i];
			//如果r<0或r>RN或c<0或c>=CN或wall中和cell相同位置有格
			if (cell.r<0||cell.r>=this.RN
				||cell.c<0||cell.c>=this.CN
				||this.wall[cell.r][cell.c]!==undefined)
			{return false;}//返回false
		}//(遍历结束)
		return true;//返回true
	},
	rotateR:function(){//顺时针旋转
		this.shape.rotateR();
		if (!this.canRotate())//如果不可以旋转
		{
			this.shape.rotateL();
		}else{//否则
			this.paint();
		}
	},
	rotateL:function(){//逆时针旋转
		this.shape.rotateL();
		if (!this.canRotate())//如果不可以旋转
		{
			this.shape.rotateR();
		}else{//否则
			this.paint();
		}
	},
	hardDrop:function(){//就一落到底
		//只要可以下落 就反复
		while(this.canDown()){
			this.shape.moveDown();//调用shape的moveDown方法
			//调用this.shape.moveDown()效率更高
		}
		this.paint();//重绘一切
	},
	canLeft:function(){
		//遍历shape中的每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将当前cell临时存储在变量cell中
			var cell=this.shape.cells[i];
			//如果cell的C已经等于0或者在wall中cell左侧有格
			if(cell.c==0||this.wall[cell.r][cell.c-1]!==undefined){
				//或者wall中的cell的下方位置不等于undefined
				return false;//返回false
			}
		}//(遍历结束)
		return true;//返回true
	},
	moveLeft:function(){//专门负责左移一次
		//如果可以左移
		if(this.canLeft()){
			//让shape左移一次
			this.shape.moveLeft();
			this.paint();//重绘一切
		}
		
	},
	canRight:function(){
		//遍历shape中的每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将当前cell临时存储在变量cell中
			var cell=this.shape.cells[i];
			//如果cell的c已经等于this.CN-1
			if(cell.c==this.CN-1||this.wall[cell.r][cell.c+1]!==undefined){
				//或者wall中的cell的右侧位置不等于undefined
				return false;//返回false
			}
		}//(遍历结束)
		return true;//返回true
	},
	moveRight:function(){//专门负责右移一次
		//如果可以右移
		if (this.canRight())
		{//让shape右移一次
			this.shape.moveRight();
			this.paint();//重绘一切	
		}
	},
	canDown:function(){//能否下降
		//遍历shape中的每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将当前cell临时存储在变量cell中
			var cell=this.shape.cells[i];
			//如果cell的r已经等于19
			if(cell.r==this.RN-1||this.wall[cell.r+1][cell.c]!==undefined){
				//或者wall中的cell的下方位置不等于undefined
				return false;//返回false
			}
		}//(遍历结束)
		return true;//返回true
	},



	moveDown:function(){//负责将图形下落一次
		if(this.canDown()){//如果可以下落
			//调用Shape的moveDown方法
			this.shape.moveDown();
		}else{//否则
			//调用landIntoWall 将shape放入wall中
			this.landIntoWall();
			var ln=this.deleteRows();
			this.ln+=ln;//累加本次删除的行数
			this.score+=this.SCORES[ln];
			if(!this.isGameOver()){//如果游戏没有结束
				//调用randomShape方法 随机生成图形 保存在shape中
				this.shape=this.nextShape;//备胎转正
				//新建备胎图形
				this.nextShape=this.randomShape();
			}else{//否则
				//修改游戏的状态为GAMEOVER
				this.state=this.GAMEOVER;
				//停止定时器 清空timer
				clearInterval(this.timer);
				this.timer=null;
			}
		}
		//调用paintShape，绘制主角图形
		this.paint();//重绘一切
	},

/*
	moveDown:function(){//下落一次
    if(this.canDown()){//如果canDown
      //调用shape的moveDown方法
      this.shape.moveDown();
    }else{//否则
      this.landIntoWall();//落入墙中
      var ln=this.deleteRows();//删除行
      this.ln+=ln;//累加本次删除的行数
      this.score+=this.SCORES[ln];//累加得分
			if(!this.isGameOver()){//如果游戏没有结束
				this.shape=this.nextShape;
				this.nextShape=this.randomShape();
			}else{//否则
				//修改游戏状态为GAMEOVER
				this.state=this.GAMEOVER;
				//停止定时器，清除timer
				clearInterval(this.timer);
				this.timer=null;
			}
    }
	 this.paint();//重绘主角图形
  },
*/

	isGameOver:function(){//判断游戏是否结束
		//遍历备胎图形中的每个cell
		for(var i=0;i<this.nextShape.cells.length;i++){
			var cell=this.nextShape.cells[i];
			//判断wall中和cell相同位置是否有格
			if(this.wall[cell.r][cell.c]!==undefined){return true;}
				//就返回true
		}//(遍历结束)
		return false;//返回false
	},
	paintState:function(){//绘制状态图片
		//如果游戏状态为GAMEOVER
	/*	if(this.state==this.GAMEOVER){
			//新建img元素
			var img=new Image();
			//设置img的src为game-over.png
			img.src="img/game-over.png";
			//将img追加到pg中
			this.pg.appendChild(img);
		}else if(this.state==this.PAUSE){//否则 如果游戏的状态为
			img.src="img/pause.png";
			this.pg.appendChild(img);
		}
	*/
		//如果游戏状态不是RUNNING
		if(this.state!==this.RUNNING){
		  var img=new Image();//创建img
		  //设置img的src为:
			//如果是GAMEOVER,为game-over.png
			//否则，为pause.png
		  img.src=this.state==this.GAMEOVER?
				  "img/game-over.png":"img/pause.png";
		  //将img追加到pg中
		  this.pg.appendChild(img);
		}
	
	},
	paintScore:function(){//将lines和score添加到span
		//设置id为lines的元素的内容为lines属性
		document.getElementById("lines").innerHTML=this.lines;
		//设置id为score的元素的内容为score属性
		document.getElementById("score").innerHTML=this.score;		
	},
	deleteRows:function(){//遍历所有行 检查能否消除
		//自底向上遍历wall中的每一行 同时声明变量ln=0
		for(var r=this.RN-1,ln=0;r>=0;r--){
			//如果r行为空行或者ln==4 就退出循环
			if(this.wall[r].join("")==""||ln==4){break;}//如果ln等于4 退出循环
			//如果当前行满格 
			if(this.isFull(r)){
				//调用deleteRow，删除当前行
				this.deleteRow(r);
				//r留在原地
				r++;
				//ln+1
				ln++;	
			}	
		}//(遍历结束)
		return ln;//返回ln
	},
	deleteRow:function(r){//消除第r行
		//r从delr开始 到>=0结束 每次r-1
		for(;r>0;r--){
			//将wall中r-1行赋值给wall中的r行
			this.wall[r]=this.wall[r-1];
			//创建一个CN个元素的空数组赋值给wall中的r-1行
			this.wall[r-1]=new Array(this.CN);
			//遍历wall中的r行的每个格
			for(var c=0;c<this.CN;c++){
				if(this.wall[r][c]!==undefined){
					this.wall[r][c].r++;
				}
			}//(遍历结束)
				//如果wall中的r-2行是空行 就退出循环
				if(this.wall[r-2].join("")==""){break;}
		}
	},
	isFull:function(r){//判断第r行是否满格
		//定义正则
		//var reg=/^,|,,|,$/;
		//返回wall中r行转为字符串后 用search查找是否reg 与-1比较的结果
		return String(this.wall[r]).search(/^,|,,|,$/)==-1;//说明没找到 是满格行
	},
	randomShape:function(){//专门随机创建一个图形
		//return new O();
		//在0~6之间生成随机数 保存在变量r中
		var r=Math.floor(Math.random()*(6+1));
		switch(r){//判断r
			//如果是0 返回一个新的O类型的图形对象
			case 0:
				return new O();
			//如果是1 返回一个新的I类型的图形对象
			case 1:
				return new I();		
			//如果是2 返回一个新的T类型的图形对象
			case 2:
				return new T();	
			//如果是3 返回一个新的S类型的图形对象
			case 3:
				return new S();
			//如果是4 返回一个新的Z类型的图形对象
			case 4:
				return new Z();
			//如果是5 返回一个新的Z类型的图形对象
			case 5:
				return new L();
			//如果是5 返回一个新的Z类型的图形对象
			case 6:
				return new J();
		}
	},
	landIntoWall:function(){//专门负责将主角放入wall中
		//遍历shape中的每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将当前cell临时存储在变量cell中
			var cell=this.shape.cells[i];
			//将当前cell赋值为wall中的相同位置
			this.wall[cell.r][cell.c]=cell;
		}
	},
	paintWall:function(){//专门绘制wall中的所有方块
		//创建文档片段frag
		var frag=document.createDocumentFragment();
		//自底向上遍历wall中每行的每个cell
		for(var r=this.RN-1;r>=0&&this.wall[r].join("")!="";r--){
			//将当前格子 保存在变量cell中
			for (var c=0;c<this.CN ;c++ )
			{
				var cell=this.wall[r][c];
				if(cell){//如果cell有效
					//创建一个新的Image对象，保存在变量img中
					var img=new Image();
					//设置img的src为cell的src
					img.src=cell.src;
					//设置img的top为OFFSET+cell的r*CSIZE
					img.style.top=this.OFFSET+cell.r*this.CSIZE+"px";
					//设置img的left为OFFSET+cell的c*CSIZE
					img.style.left=this.OFFSET+cell.c*this.CSIZE+"px";
					//将img追加到frag下
					frag.appendChild(img);
					
				}
			}
			
		}//(遍历结束)
		pg.appendChild(frag);//将frag追加到pg中
	},
	paint:function(){//重绘一切
		//定义正则/<img[^>]*>/g
		var reg=/<img[^>]*>/g;
		//清除pg中所有的img元素 用正则 结果保存在pg的内容中
		pg.innerHTML=pg.innerHTML.replace(reg,"");
		//调用paintShpae绘制主角图形
		this.paintShape();
		this.paintWall();//绘制wall
		this.paintScore();//重绘成绩
		this.paintNext();//重绘备胎图形
		this.paintState();//绘制状态图片
	},
	paintNext:function(){//绘制备胎图形
		//创建文档片段 保存在变量frag中
		var frag=document.createDocumentFragment();
		//创建备胎图形nextShape中的每个cell对象
		for (var i=0;i<this.nextShape.cells.length ;i++ )
		{
			var img=this.paintCell(
				this.nextShape.cells[i],frag//绘制当前格
			);
			//将img的top+CSIZE
			img.style.top=
				 parseFloat(img.style.top)+this.CSIZE+"px";
			//将img的left+10个CSIZE
			img.style.left=parseFloat(img.style.left)+this.CSIZE*10+"px";
		}//(遍历结束)
		
		this.pg.appendChild(frag);//将frag追加到pg上
	},
	paintCell:function(cell,frag){//绘制一个格
		var img=new Image();//创建img元素
		img.src=cell.src;//设置img的src为cell的src
		//设置img的宽为CSIZE
		img.style.width=this.CSIZE+"px";
		//设置img的top为OFFSET+cell的r*CSIZE
		img.style.top=this.OFFSET+cell.r*this.CSIZE+"px";
		//设置img的left为OFFSET+cell的c*CSIZE
		img.style.left=this.OFFSET+cell.c*this.CSIZE+"px";
		//将img追加到frag下
		frag.appendChild(img);
		return img;//负责返回新建的img对象
	},
	paintShape:function(){//专门绘制主角图形
		//创建文档片段 保存在变量frag中
		var frag=document.createDocumentFragment();
		//遍历shape的cells数组中的每个cell对象
		for (var i=0;i<this.shape.cells.length ;i++ ){
			//将当前格子 保存在变量cell中
			var cell=this.shape.cells[i];
			//创建一个新的Image对象，保存在变量img中
			var img=new Image();
			//设置img的src为cell的src
			img.src=cell.src;
			//设置img的top为OFFSET+cell的r*CSIZE
			img.style.top=this.OFFSET+cell.r*this.CSIZE+"px";
			//设置img的left为OFFSET+cell的c*CSIZE
			img.style.left=this.OFFSET+cell.c*this.CSIZE+"px";
			//将img追加到frag下
			frag.appendChild(img);
		}//(遍历结束)
		//将img追加到id为pg的元素下
		pg.appendChild(frag);
	}
}
window.onload=function(){tetris.start();}


