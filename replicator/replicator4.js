xmlns="http://www.w3.org/2000/svg"
xlink="http://www.w3.org/1999/xlink"
ddns="http://www.someurl.net/ddns"
root=document.documentElement
root.setAttribute("onclick","monitor(evt)")
function monitor(evt){
	var T=evt.target
	var P=evt.target.attributes
	var L=P.length
	alert("evt.target is:"+T.nodeName+"\nlast member of attribute list"+P.item(L-1).nodeName+":"+P.item(L-1).nodeValue)
	T.parentNode.removeChild(T)
}

function startup(evt){
	var RT=document.getElementsByTagNameNS(xmlns,"replicate")
	var R=[]
	for (var i=0;i<RT.length;i++)R.push(RT.item(i))
	for (i=0;i<R.length;i++){ //looping through the replicate tags
		cloneRep(R[i])
	}
}

function cloneRep(Ri){
	var number=Ri.getAttribute("repeatCount") //the number of replications of each parent to make
	var P=Ri.parentNode //P, the parent of the replicate,  is the node to be cloned
	               //P.removeChild(Ri) //removing it now rather than later -- seems to work
	var RAN=Ri.getElementsByTagNameNS(xmlns,"replicateAttribute")
	               //RAN is the list of replicateAttributes associated with the  i-th <replicate>
	var RP=Ri.getElementsByTagNameNS(xmlns,"replicatePath")
	              //RP is the list of replicatePaths associated with the  i-th <replicate>
	for (var n=0;n<number;n++){
		var CloneP=P.cloneNode("true")
		CloneP.setAttribute("id",n)
		for (var j=0;j<RAN.length;j++){ //looping through the replicateAttribute tags
			var Rep=RAN.item(j)
			var newattr=Rep.getAttributeNS(null,"attributeName")
			var value=findValue(Rep, n, number)
			CloneP.setAttributeNS(null, newattr, value)
		}
		for (var i=0;i<RP.length;i++){ //looping through the replicatePath tags
			var Rq=RP.item(i)
			var Baseid=Rq.getAttribute("xlink:href")
			if (Baseid==null) //for Opera
				var Baseid=Rq.getAttributeNS(xlink,"xlink:href")
			//Opera seems to be the only one following the standard here???
			Baseid=Baseid.substring(1,Baseid.length)
			var B=document.getElementById(Baseid)
			var l=B.getTotalLength()
			var xa=Rq.getAttribute("xattribute")
			var ya=Rq.getAttribute("yattribute")
			var Point=B.getPointAtLength(l*n/number)
			CloneP.setAttributeNS(null, xa, Point.x)
			CloneP.setAttributeNS(null, ya, Point.y)
	
		}
		root.appendChild(CloneP)
	}
}
function findValue(Rep,n,number){
	var RA=listToArray(Rep)
	if (RA["values"]){
		var V=Rep.getAttribute("values").split(/ *; */g)
		var Vn=V.length-1
		var valueprop=(Vn)*n/number
		var firstindex=Math.floor(valueprop)
		
		if (V[0].indexOf('rgb')>-1){
			//something like values="rgb(255,0,0);rgb(255,128,0);rgb(255,128,200)"
			value="rgb("
			//var F=V[firstindex].split(/[\s,()]+/g)
			V[firstindex]=V[firstindex].replace(/ *rgb\(/,"")
			var F=V[firstindex].split(/[\s,()]+/g)
			//var T=V[firstindex+1].split(/[\s,()]+/g)
			V[firstindex+1]=V[firstindex+1].replace(/ *rgb\(/,"")
			var T=V[firstindex+1].split(/[\s,()]+/g)
			//alert(F+T)
			for (var i=0;i<2;i++){
				var startinterval=parseFloat(F[i])
				var range=parseInt(T[i])-parseInt(F[i])
				var across=valueprop - firstindex
				value+=parseInt(startinterval+across*range)+","
			  //    value+=parseInt(parseInt(F[i])+n*(range)/number)+","
			      //should be integer between 0 and 255
			}
			var startinterval=parseFloat(F[2])
			var range=parseInt(T[2])-parseInt(F[2])
			var across=valueprop - firstindex
			value+=parseInt(startinterval+across*range)+")"
			//value+=parseInt(parseInt(F[3])+n*(parseInt(T[3])-parseInt(F[3]))/number)+")"
			//alert("n:"+n+" v:"+value+"\n"+F+T)
		}
		else{
			var startinterval=parseFloat(V[firstindex])
			var endinterval=parseFloat(V[firstindex+1])
			var range=endinterval-startinterval
			var across=valueprop - firstindex
			value=startinterval+across*range
			//alert("n:"+n+" v:"+value+"\n"+startinterval+endinterval)
		}
	}
	else
	if (RA["from"].length>0){
		var from=Rep.getAttribute("from")
		var to=Rep.getAttribute("to")
		var F=from.split(/[\ ,()]/g)
		var FL=F.length-1
		var T=to.split(/[\ ,()]/g)
		if (from.indexOf('rgb')>-1){
			//something like from="rgb(255,0,0)" to="rgb(255,128,0)"
			value="rgb("
			for (var i=1;i<3;i++){
			      value+=parseInt(parseInt(F[i])+n*(parseInt(T[i])-parseInt(F[i]))/number)+","
			      //should be integer between 0 and 255
			}
			value+=parseInt(parseInt(F[3])+n*(parseInt(T[3])-parseInt(F[3]))/number)+")"
		}
	
		else
		//following worked in IE but nowhere else
		//if ((from.indexOf('rotate')>-1)||((from.indexOf('translate')>-1))||(from.indexOf('scale')>-1)){
			//something like from="rotate(0 400 50)" to="rotate(360 400 50)" />
			//used to have ||(from.indexOf('rgb')>-1) in clause and then didn't need top else for rgb
			//for some reason though it broke in FF.
			//alert("here")
			
		//	value=F[0]+"("
		//	for (var i=1;i<FL;i++){
		//	   value+=parseInt(parseInt(F[i])+n*(parseInt(T[i])-parseInt(F[i]))/number)+" "
		//	}
		//	value+=parseInt(parseInt(F[FL])+n*(parseInt(T[FL])-parseInt(F[FL]))/number)+")"
		//}
		//following is the older code that worked across all browsers:
		if ((from.indexOf('rotate')>-1)){
			//something like from="rotate(0 400 50)" to="rotate(360 400 50)" />
			//used to have ||(from.indexOf('rgb')>-1) in clause and then didn't need top else for rgb
			//for some reason though it broke in FF.
			//alert("here")
			var F=from.split(/[\ ,()]/g)
			var T=to.split(/[\ ,()]/g)
			value=F[0]+"("
			for (var i=1;i<3;i++){
				value+=parseInt(parseInt(F[i])+n*(parseInt(T[i])-parseInt(F[i]))/number)+" "
				//should be number between 0 and 255
			}
			value+=parseInt(parseInt(F[3])+n*(parseInt(T[3])-parseInt(F[3]))/number)+")"
		}
		else
		if ((from.indexOf('M ')>-1)){
			//something like from="M 61 247 137 22 149 2 z"
			// to="M 263 356 148 71 297 388 z"
			//note: the number of x y pairs have to be the same
			//currently only handing simple paths without subcommands other than M and z
			
			value="M "
			for (var i=1;i<F.length - 1;i++){
			    value+=parseInt(parseInt(F[i])+n*(parseInt(T[i])-parseInt(F[i]))/number)+" "
			    //should be number between 0 and 255
			}
			value+=" z"
			//alert(value)
		}
	
		else{ //to and from are simple numeric values
			to=parseFloat(to)
			from=parseFloat(from)
			incr=(to-from)/number
			value=from+incr*n
		}
	}
	else return false
	return value
}
function listToArray(R){
	L=R.attributes
	var A=[]
	for (var i=0;i<L.length;i++) {
		 A[L.item(i).nodeName]=L.item(i).nodeValue
	}
	return A
}


