/*定义格子类型Cell*/
//定义构造函数Cell 只接受2个参数 r c
function Cell(r,c){
	//为当前对象添加r属性 值为变量r
	this.r=r;
	//为当前对象添加c属性 值为变量c
	this.c=c;
	//为当前对象添加src属性 值为""
	this.src="";
}

/*抽象公共父类型Shape*/
//定义父类型构造函数 定义参数src cells
function Shape(src,cells,states,orgi){
	//为当前对象添加属性src 值为变量src
	//为当前图形添加属性cells 值为变量cells
	this.cells=cells;
	//遍历当前对象cells中的每一个cell对象，设置其src属性为当前对象的属性
	for (var i=0;i<this.cells.length ;i++ )
	{
		this.cells[i].src=src;
	}
	//将四个格子中的参照格单独存储
	this.orgCell=this.cells[orgi];
	this.states=states;
	this.statei=0;//保存每个图形图像所处的旋转状态

}

//定义Shape类型原型对象，保存所有图形共有方法
Shape.prototype={
  IMGS:{//统一保存所有图形中图片的路径
    T:"img/T.png",
	O:"img/O.png",
	I:"img/I.png",
	J:"img/J.png",
	L:"img/L.png",
	S:"img/S.png",
	Z:"img/Z.png"},
  moveLeft:function(){
    //遍历当前图形中的每个cell
    for(var i=0;i<this.cells.length;i++){
      this.cells[i].c--;//将当前cell的c-1
    }
  },
  moveRight:function(){
    //遍历当前图形中的每个cell
    for(var i=0;i<this.cells.length;i++){
      this.cells[i].c++;//将当前cell的c+1
    }
  },
  moveDown:function(){
    //遍历当前图形中的每个cell
    for(var i=0;i<this.cells.length;i++){
      this.cells[i].r++;//将当前cell的r+1
    }
  },
  rotateR:function(){//顺时针旋转
    this.statei++;//将当前对象的statei+1
    //如果statei等于states的length，就改回0
    this.statei==this.states.length
                          &&(this.statei=0);
    this.rotate();
  },
  rotate:function(){//旋转
    //获得states中statei位置的状态对象state
    var state=this.states[this.statei];
    //遍历当前图形中每个cell(i=0,1,2,3)
    for(var i=0;i<this.cells.length;i++){
      //设置当前格的r等于orgCell的r+state的ri
      this.cells[i].r=this.orgCell.r+state["r"+i];
      //设置当前格的c等于orgCell的c+state的ci
      this.cells[i].c=this.orgCell.c+state["c"+i];
    } 
  },
  rotateL:function(){
    this.statei--;//将当前对象的statei-1
    //如果statei等于states的length，就改回0
    this.statei==-1&&
          (this.statei=this.states.length-1);
    this.rotate();
  }
}

//定义状态类型 描述图形的一种旋转状态
function State(){//arguments:[0 1  2 3  4 5  6 7]
							//r0c0 r1c1 r2c2 r3c3
	for (var i=0;i<4 ;i++ )
	{
		this["r"+i]=arguments[2*i];
		this["c"+i]=arguments[2*i+1];
	}
}


/*定义T图形的类型*/
//定义构造函数T 不需要参数
function T(){
	//借用构造函数Shape 传入参数值this.IMGS.T,[
	Shape.call(this,this.IMGS.T,[
	//为当前对象添加cells属性 值为[
		//实例化第一个cell对象 传入位置0,3
		new Cell(0,3),
		//实例化第二个cell对象 传入位置0,4
		new Cell(0,4),
		//实例化第三个cell对象 传入位置0,5
		new Cell(0,5),
		//实例化第四个cell对象 传入位置1,4
		new Cell(1,4)
	//]
	],
	[//states  r0 c0  r1c1   r2c2   r3c3
      new State(0,-1,  0,0,  0,+1,  +1,0),
      new State(-1,0,  0,0,  +1,0,  0,-1),
      new State(0,+1,  0,0,  0,-1,  -1,0),
      new State(+1,0,  0,0,  -1,0,  0,+1)
    ],
    1
	);
}
//让T类型的原型继承Shape类型的原型
Object.setPrototypeOf(T.prototype,Shape.prototype);

/*定义O图形的类型*/
//定义构造函数T 不需要参数
function O(){
	//借用构造函数Shape 传入参数值this.IMGS.O,[
	Shape.call(this,this.IMGS.O,[
	//为当前对象添加cells属性 值为[
		//实例化第一个cell对象 传入位置0,4
		new Cell(0,4),
		//实例化第二个cell对象 传入位置0,5
		new Cell(0,5),
		//实例化第三个cell对象 传入位置1,4
		new Cell(1,4),
		//实例化第四个cell对象 传入位置1,5
		new Cell(1,5)
	//]
	],
	[new State(0,-1,  0,0,  +1,-1,  +1,0)],
    1	
	);
}
//让O类型的原型继承Shape类型的原型
Object.setPrototypeOf(O.prototype,Shape.prototype);
/*定义I图形的类型*/
//定义构造函数I 不需要参数
function I(){
	//借用构造函数Shape 传入参数值this.IMGS.I,[
	Shape.call(this,this.IMGS.I,[
	//为当前对象添加cells属性 值为[
		//实例化第一个cell对象 传入位置0,4
		new Cell(0,3),
		//实例化第二个cell对象 传入位置0,5
		new Cell(0,4),
		//实例化第三个cell对象 传入位置1,4
		new Cell(0,5),
		//实例化第四个cell对象 传入位置1,5
		new Cell(0,6)
	//]
	],
	[new State(0,-1,  0,0,  0,+1,  0,+2),
     new State(-1,0,  0,0,  +1,0,  +2,0)],
    1	
	);
}
//让O类型的原型继承Shape类型的原型
Object.setPrototypeOf(I.prototype,Shape.prototype);
/*定义S图形的类型*/
//定义构造函数S 不需要参数
function S(){//S:04 05 13 14 orgi:3 2个状态
	//借用构造函数Shape 传入参数值this.IMGS.S,[
	Shape.call(this,this.IMGS.S,[
	//为当前对象添加cells属性 值为[
		//实例化第一个cell对象 传入位置0,4
		new Cell(0,4),
		//实例化第二个cell对象 传入位置0,5
		new Cell(0,5),
		//实例化第三个cell对象 传入位置1,4
		new Cell(1,3),
		//实例化第四个cell对象 传入位置1,5
		new Cell(1,4)
	//]
	],
	[new State(-1,0,  -1,1,  0,-1,  0,0),
     new State(0,1,  1,1,  -1,0,  0,0)],
    3	
	);
}
//让S类型的原型继承Shape类型的原型
Object.setPrototypeOf(S.prototype,Shape.prototype);

/*定义Z图形的类型*/
//定义构造函数Z 不需要参数
function Z(){//Z:03 04 14 15 orgi:2 2个状态
	//借用构造函数Shape 传入参数值this.IMGS.S,[
	Shape.call(this,this.IMGS.Z,[
	//为当前对象添加cells属性 值为[
		//实例化第一个cell对象 传入位置0,4
		new Cell(0,3),
		//实例化第二个cell对象 传入位置0,5
		new Cell(0,4),
		//实例化第三个cell对象 传入位置1,4
		new Cell(1,4),
		//实例化第四个cell对象 传入位置1,5
		new Cell(1,5)
	//]
	],
	[new State(-1,-1,  -1,0,  0,0,  0,1),
     new State(-1,1,  0,1,  0,0,  1,0)],
    2	
	);
}
//让O类型的原型继承Shape类型的原型
Object.setPrototypeOf(Z.prototype,Shape.prototype);


/*定义L图形的类型*/
//定义构造函数L 不需要参数
function L(){//L:04 14 24 25 orgi:1 4个状态
	//借用构造函数Shape 传入参数值this.IMGS.S,[
	Shape.call(this,this.IMGS.L,[
	//为当前对象添加cells属性 值为[
		//实例化第一个cell对象 传入位置0,4
		new Cell(0,4),
		//实例化第二个cell对象 传入位置0,5
		new Cell(1,4),
		//实例化第三个cell对象 传入位置1,4
		new Cell(2,4),
		//实例化第四个cell对象 传入位置1,5
		new Cell(2,5)
	//]
	],
	[new State(-1,0,  0,0,  1,0,  1,1),
     new State(0,1,  0,0,  0,-1,  1,-1),
	 new State(1,0,  0,0,  -1,0,  -1,-1),
	 new State(0,-1,  0,0,  0,1,  -1,1)
		],
    1	
	);
}
//让L类型的原型继承Shape类型的原型
Object.setPrototypeOf(L.prototype,Shape.prototype);


/*定义J图形的类型*/
//定义构造函数J 不需要参数
function J(){//J:03 04 05 15 orgi:1 4个/状态
	//借用构造函数Shape 传入参数值this.IMGS.S,[
	Shape.call(this,this.IMGS.J,[
	//为当前对象添加cells属性 值为[
		//实例化第一个cell对象 传入位置0,4
		new Cell(0,3),
		//实例化第二个cell对象 传入位置0,5
		new Cell(0,4),
		//实例化第三个cell对象 传入位置1,4
		new Cell(0,5),
		//实例化第四个cell对象 传入位置1,5
		new Cell(1,5)
	//]
	],
	[new State(0,-1,  0,0,  0,1,  1,1),
     new State(-1,0,  0,0,  1,0,  1,-1),
	 new State(0,1,  0,0,  0,-1,  -1,-1),
	 new State(1,0,  0,0,  -1,0,  -1,1)
		],
    1	
	);
}
//让J类型的原型继承Shape类型的原型
Object.setPrototypeOf(J.prototype,Shape.prototype);


