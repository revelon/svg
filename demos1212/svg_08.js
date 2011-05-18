// namespaces prefixes
var svgns = "http://www.w3.org/2000/svg";
var xlinkns = "http://www.w3.org/1999/xlink";

var maxzoom = -200;
var zoom = 280;
var eyez = -500;

var centerx = 125;
var centery = 75;

var timer;
var currentEvent = "nothing";

var basecos = Math.cos(1*(Math.PI/180));
var basesin = Math.sin(1*(Math.PI/180));

myPoint = new Array();
myLine = new Array();

function createPoint(name, x, y, z){
 	myPoint[name]= new Array();
	myPoint[name].x=x;
 	myPoint[name].y=y;
 	myPoint[name].z=z;
}	


function createLine(name, p1, p2, link){
 	myLine[name]= new Array();
	myLine[name].p1=p1;
 	myLine[name].p2=p2;
 	myLine[name].link=link;
}	


function initsvg(evt){

     svgDocument = document;
	svgObj = svgDocument.documentElement;

	createPoint("p1",0,0,0);
	createPoint("p2",50,50,-50);
	createPoint("p3",-50,50,50);
	createPoint("p4",20,70,-50);
	createPoint("p5",-45,40,-50);
	createPoint("p6",0,0,70);
	createPoint("p7",0,80,10);
	createPoint("p8",10,-60,-40);
	createPoint("p9",-40,-30,40);
	createPoint("p10",40,-60,-40);
	createPoint("p11",-25,-25,40);
	createPoint("p12",-40,-75,40);	
	createPoint("p13",-125,-111,80);
	createPoint("p14",-100,-140,80);
	createPoint("p15",-40,90,90);
	createPoint("p16",-90,90,-80);


	createLine("L1", "p1", "p2", "www.google.com");
	createLine("L2", "p1", "p3", "www.linux.com");
	createLine("L3", "p1", "p4", "www.mysql.com");
	createLine("L4", "p1", "p5", "www.perl.com");
	createLine("L5", "p1", "p6", "www.yahoo.com");
	createLine("L6", "p1", "p8", "www.mywebstuff.com");
	createLine("L7", "p1", "p9", "www.svgx.org");
	createLine("L8", "p1", "p10", "www.leo.org");
	createLine("L9", "p1", "p11", "www.adobe.com");
	createLine("L10", "p1", "p12", "www.w3c.org");
	createLine("L11", "p12", "p13", "www.mozilla.org");
	createLine("L12", "p12", "p14", "www.openoffice.org");
	createLine("L13", "p3", "p15", "www.redhat.com");
	createLine("L14", "p5", "p16", "www.apache.org");

	renderWorld();
	domefirst();

}


function domefirst(){

	timer = setTimeout("doWorld()", 10);

}

function renderWorld(){
	
	var i;
	var line;
	var link;
	var textBlock;
	var textlink;
	
	var u1, Dx1, Dy1;
	var u2, Dx2, Dy2;

	var depth = zoom * (eyez - maxzoom) / 100 + eyez;

	for(i in myLine){

		u1 = (depth - eyez)/(myPoint[myLine[i].p1].z - eyez);
		Dx1 =  (u1 * myPoint[myLine[i].p1].x) + centerx;
	 	Dy1 =  (u1 * myPoint[myLine[i].p1].y) + centery;

		u2 = (depth - eyez)/(myPoint[myLine[i].p2].z - eyez);
		Dx2 =  (u2 * myPoint[myLine[i].p2].x) + centerx;
	 	Dy2 =  (u2 * myPoint[myLine[i].p2].y) + centery;

		line = svgDocument.createElementNS(svgns, "line");
		line.setAttribute("id", i);
		line.setAttribute("x1", Dx1);
		line.setAttribute("y1", Dy1);
		line.setAttribute("x2", Dx2);
		line.setAttribute("y2", Dy2);
		line.setAttribute("stroke", "#FFFFFF");
		line.setAttribute("opacity", "0.5");
		svgDocument.getElementById("world").appendChild(line);

		textBlock = svgDocument.createTextNode(myLine[i].link);
		textlink = svgDocument.createElementNS(svgns, "text");
		textlink.setAttribute("id", "link" + i);
		textlink.setAttribute("x", Dx2);
		textlink.setAttribute("y", Dy2);
		textlink.setAttribute("fill", "#FFFFFF");
		textlink.setAttribute("font-size", "12");
		textlink.appendChild(textBlock);
	
		svgDocument.getElementById("world").appendChild(textlink);

		
	}

	
}

function doWorld(){

	doEvent();

	var i;
	var line;
	var textlink;

	var u1, Dx1, Dy1;
	var u2, Dx2, Dy2;

	var depth = zoom * (eyez -maxzoom) / 100 + eyez;
	
	for(i in myLine){

		u1 = (depth - eyez)/(myPoint[myLine[i].p1].z - eyez);
		Dx1 =  (u1 * myPoint[myLine[i].p1].x) + centerx;
	 	Dy1 =  (u1 * myPoint[myLine[i].p1].y) + centery;

		u2 = (depth - eyez)/(myPoint[myLine[i].p2].z - eyez);
		Dx2 =  (u2 * myPoint[myLine[i].p2].x) + centerx;
	 	Dy2 =  (u2 * myPoint[myLine[i].p2].y) + centery;

 		line = svgDocument.getElementById(i);	
		line.setAttribute("x1", Dx1);
		line.setAttribute("y1", Dy1);
		line.setAttribute("x2", Dx2);
		line.setAttribute("y2", Dy2);

		textlink = svgDocument.getElementById("link" + i);
		textlink.setAttribute("x", Dx2);
		textlink.setAttribute("y", Dy2);

	}

	setTimeout("doWorld()", 10);

	
}


function setEvent(eventin){
	currentEvent = eventin;
}

function doEvent(){

	var mysin;
	var mycos;
	

	if (currentEvent == "callZoomIn"){
		if(zoom <= 400){
			zoom = zoom + 1;
		}
	}

	if (currentEvent == "callZoomOut"){
		if(zoom >= 175){
			zoom = zoom - 1;
		}
	}

	if (currentEvent == "callXmin"){
		mysin = -basesin;
		mycos = basecos;
		rotateXaxis(mysin, mycos);
	}

	if (currentEvent == "callXmax"){
		mysin = basesin;
		mycos = basecos;

		rotateXaxis(mysin, mycos);
	}

	if (currentEvent == "callYmin"){
		mysin = -basesin;
		mycos = basecos;

		rotateYaxis(mysin, mycos);
	}

	if (currentEvent == "callYmax"){
		mysin = basesin;
		mycos = basecos;

		rotateYaxis(mysin, mycos);
	}

	if (currentEvent == "callZmax"){
		mysin = basesin;
		mycos = basecos;

		rotateZaxis(mysin, mycos);
	
	}

	if (currentEvent == "callZmin"){
		mysin = -basesin;
		mycos = basecos;
	
		rotateZaxis(mysin, mycos);
	}


}


function rotateXaxis(mysin, mycos){

	var tmp;

	for(i in myPoint){

		tmp = (mysin * myPoint[i].y) + (mycos * myPoint[i].z);
 
		myPoint[i].y = (mycos * myPoint[i].y)  - (mysin * myPoint[i].z);
		myPoint[i].z = tmp;
	}


}




function rotateYaxis(mysin, mycos){
	var tmp;

	for(i in myPoint){

		tmp = - (mysin * myPoint[i].x) + (mycos * myPoint[i].z);
		myPoint[i].x = (mycos * myPoint[i].x) + (mysin * myPoint[i].z);
		myPoint[i].z = tmp;

	}


}


function rotateZaxis(mysin, mycos){

	var tmp;

	for(i in myPoint){

		tmp = (mysin *  myPoint[i].x) + (mycos *  myPoint[i].y)
 		myPoint[i].x = (mycos * myPoint[i].x) - (mysin * myPoint[i].y);
 		myPoint[i].y = tmp;

	}

	
}


