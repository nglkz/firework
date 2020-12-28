resize();
window.addEventListener("resize",resize);
var c = document.querySelector("#firework");
var ctx = c.getContext("2d");
var fwList = [];

ctx.fillRect(0,0,c.width,c.height);

function FireWork(posX,posY,boomPoint,color,size){
	this.size=size;
	this.posX = posX;
	this.g = 1;//重力基数
	this.cir = 0;//重力系数
	this.height = 0.1;//未爆前高度
	this.boomPoint = boomPoint;//爆炸高度
	this.ballAlpha=0;
	this.rgb = this.getColor(color);
	this.w = Math.random()*35+220;//火药亮度
	this.hz = 7;
	this.lr = 0;
	this.disCount = 0;
	this.isDone = 0;

	this.big={
		rotate:new Array(size),
		speed:new Array(size),
		dist:new Array(size).fill(1),
		alpha:new Array(size).fill(1),
		light:new Array(size).fill(0.3),//泛光 透明度
		darkness:new Array(size),
		one:new Array(size).fill(0.5),//线性 闪烁线性参
		flower:new Array(size)
	};
	for(let x=0;x<size;x++){
		this.big.rotate[x]=(Math.random()*100>>0)/100;
		this.big.speed[x]=Math.random()*5;
		this.big.flower[x]=Math.random()<0.5?(5-this.big.speed[x])/4:0.1;
		this.big.darkness[x]=Math.random()*0.0005+0.0015;
	};
	// this.big.flower.sort();

	
}
FireWork.prototype.getColor = function(str){
	var arr= str.split('');
	var color={
		r:parseInt(arr.slice(1,3).join(''),16),
		g:parseInt(arr.slice(3,5).join(''),16),
		b:parseInt(arr.slice(5,7).join(''),16),
	}
	return color;
}

FireWork.prototype.fire = function(){
	this.ballAlpha+=0.01;
	if(this.height>this.boomPoint-300 && this.height<this.boomPoint-150){
		this.lr+=0.01;
	}
	if(this.height>this.boomPoint-150 && this.lr>0){
		this.lr-=0.01;
		// this.ballAlpha-=0.15;
	}
	let x = Math.cos(Math.PI*2/this.boomPoint*this.height*this.hz)*this.lr;
	ctx.save();

	ctx.translate(this.posX,c.height);

	var ballcolor=ctx.createRadialGradient(x,-this.height,0,x,-this.height,3);
	ballcolor.addColorStop(0,"white");
	// ballcolor.addColorStop(0.1,"gold")
	ballcolor.addColorStop(1,"rgba(255,255,255,0)");
	ctx.fillStyle=ballcolor;
	// ctx.fillStyle= 'rgba(255,255,150,'+this.ballAlpha+')';
	// ctx.strokeStyle = 'rgba(255,255,150,'+this.ballAlpha+')';
	ctx.beginPath();
	ctx.arc(x,-this.height,3,0,Math.PI*2,false);
	// ctx.fillRect(x,-this.height,20,20);
	ctx.closePath();
	ctx.fill();
	ctx.restore();
	this.height+=2;
}

FireWork.prototype.boom = function(){

	let X,Y;
	ctx.save();
	ctx.translate(this.posX,c.height-this.boomPoint);
	// ctx.shadowBlur=12;
	// ctx.shadowColor=this.color;
	for(let count = 0; count < this.big.rotate.length; count++){
		if(this.w>255)this.big.one[count]=-this.big.one[count];
		if(this.w<220)this.big.one[count]=-this.big.one[count];
		this.w+=this.big.one[count];
		let dist=this.big.dist[count];
		let speed=this.big.speed[count];
		let arc=this.big.rotate[count];

		X=(Math.cos(Math.PI*2*arc)*dist);
		Y=(Math.sin(Math.PI*2*arc)*dist);

		//打印点
		ctx.beginPath();
		// 颜色
		let pre=this.big.flower[count]*0.3
		let color=ctx.createRadialGradient(X,Y+this.g,0,X,Y+this.g,this.big.flower[count]+4);
		// color.addColorStop(0,this.color);
		color.addColorStop(0,"rgba("+this.w+","+this.w+","+this.w+","+this.big.alpha[count]+")")
		color.addColorStop(pre+0.1,"rgba("+this.w+","+this.w+","+this.w+","+this.big.light[count]+")");
		color.addColorStop(pre+0.3,"rgba("+this.rgb.r+","+this.rgb.g+","+this.rgb.b+","+this.big.light[count]+")");
		color.addColorStop(1,"rgba("+this.rgb.r+","+this.rgb.g+","+this.rgb.b+",0)");
		ctx.fillStyle=color;
		ctx.arc(X,Y+this.g,this.big.flower[count]+5,0,Math.PI*2,false);
		ctx.fill();

		// ctx.arc(X,Y+this.g,this.big.flower[count],0,Math.PI*2,false);
		// ctx.lineTo(X,Y+this.g);
		// ctx.lineTo(X+4,Y+this.g+4);
		// ctx.fill();
		// ctx.stroke();

		if(this.big.speed[count]>0.1){
			this.big.speed[count]*=0.985;
		}
		this.big.dist[count]+=this.big.speed[count];
		if(this.g>15){
			this.big.alpha[count]-=this.big.darkness[count]*2;
			this.big.light[count]-=this.big.darkness[count];
		}
		if(this.big.alpha[count]<=0){
			this.big.darkness[count] = 0;
			this.disCount++;
			if(this.disCount===this.size){
				this.isDone=1;
			}
		}
	}
	ctx.restore();
	this.cir=this.cir>=1?1:this.cir+0.003;
	this.g+=Math.sin(Math.PI/2*this.cir)*1;
	
	// this.g+=0.7;
}
FireWork.prototype.flash = function(){
	ctx.save();
	ctx.translate(this.posX,c.height-this.boomPoint);

	let boomColor = ctx.createRadialGradient(0,0,0,0,0,500)
	boomColor.addColorStop(0,"white");
	boomColor.addColorStop(1,"rgba(0,0,0,0)");
	ctx.fillStyle=boomColor;
	ctx.beginPath();
	ctx.arc(0,0,500,0,Math.PI*2,false);
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}

var fw1 = new FireWork(c.width*Math.random(),0,380,randomColor(),300);
var fw2 = new FireWork(c.width*Math.random(),0,450,randomColor(),300);
var fw3 = new FireWork(c.width*Math.random(),0,500,randomColor(),300);
var fw4 = new FireWork(400,0,510,"#e7c6c1",500);
var fw5 = new FireWork(500,0,500,"#d3beca",300);
var fw6 = new FireWork(600,0,450,"#d3beca",300);
var fw7 = new FireWork(700,0,380,"#d3beca",300);
fwList.push(fw1,fw2,fw3);
// fwList.push(fw4);

mainLoop();


function mainLoop(){
	ctx.fillStyle='rgba(0,0,0,.05)';
	ctx.fillRect(0,0,c.width,c.height);
	for(let x=0; x<fwList.length; x++){
		if(fwList[x].height<fwList[x].boomPoint){
			fwList[x].fire();
			if(fwList[x].height>fwList[x].boomPoint){
				getData();
				// play();
				fwList[x].flash();
			}
		}else{
			fwList[x].boom(fwList[x]);
		}

		if(fwList[x].isDone){
			fwList.splice(x,1);
		}
		if(fwList.length<3){
			let x_center = c.width*Math.random();
			fwList.push(new FireWork(x_center,0,Math.random()*200+350,randomColor(),350))
		}
	}
	// ctx.save();
	// ctx.beginPath();
	// ctx.shadowColor="red";
	// ctx.shadowBlur=100;
	// // ctx.strokeStyle="rgba(10,101,10,0.1)";
	// ctx.fillStyle="rgba(0,0,0,0.1)";
	// ctx.rect(200,300,500,200);
	// ctx.stroke()
	// ctx.fill();
	// ctx.closePath();
	// ctx.restore();
	window.requestAnimationFrame(mainLoop);
}

function resize(){
	var body = document.querySelectorAll("body")[0];
	var canvas = document.querySelector("#firework");
	canvas.setAttribute("width",body.clientWidth);
	canvas.setAttribute("height",body.clientHeight);
	// console.log("body:"+body.clientHeight);
	// console.log("canvas:"+canvas.height);
}

console.log("done!!!");

function randomColor(){
	let rs="#";
	for(let x=0;x<3;x++){
		rs+=Math.ceil(Math.random()*105+150).toString(16);
	}
	return rs;
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;
function play(){
	var audioCtx = new AudioContext();
	var oscillator = audioCtx.createOscillator();
	var gainNode = audioCtx.createGain();
	oscillator.connect(gainNode);
	gainNode.connect(audioCtx.destination);
	oscillator.type = 'triangle';
	oscillator.frequency.value = 60.00;
	gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
	gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
	oscillator.start(audioCtx.currentTime);
	// gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 1);
	gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
	oscillator.stop(audioCtx.currentTime + 1.01);
}
function getData() {
	var audioCtx= new AudioContext;
	var source = audioCtx.createBufferSource();
	var request = new XMLHttpRequest();
	request.open('GET', './vol/boom.wav', true);
	request.responseType = 'arraybuffer';


	request.onload = function() {
		var audioData = request.response;
		
		audioCtx.decodeAudioData(audioData, function(buffer) {
			source.buffer = buffer;
			source.connect(audioCtx.destination);
			source.start();
			// source.loop = true;
		},

		function(e){"Error with decoding audio data" + e.err});

	}
	request.send();
}
