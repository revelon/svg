/*****************************************************************	
*													*	
*	SVG Smart Graphic Base Logic Module						*
*	Built by Kris Rockwell February 20, 2001						*
*	This simple engine will provide functionality for the panel while		*											*
*	calling functions based on arguments passed to the function. The	*
*	resulting call will be handled by the simulation engine.			*
*													*
*	Please do not modify this code without permission.				*
*	If you use this code please email kris_rockwell[nospam]@yahoo.co.uk	*
*	Remove the [nospam] for the email address.					*
*													*
*													*
******************************************************************/
//Set Global Variables
var gSVGDoc = null;

function getObj(mouseEvent) {
	gSVGDoc = mouseEvent.target.ownerDocument
	}

/*	Two Position Switch Function
*	This function, with the included arguments, allows the JS to parse which 
*	switch has been selected and react accordingly
*/
function twoPosSw(mouseEvent, objectName, state)	{
	getObj(mouseEvent)
	
	var lsElemOff;
	var lsElemOn;
	
	lsElemOff = objectName + "_OFF";
	lsElemOn = objectName + "_ON";
	
	var sElemOff = gSVGDoc.getElementById(lsElemOff).style
	var sElemOn = gSVGDoc.getElementById(lsElemOn).style
	
	if (state == 'ON')  {
		//In this case clicking on any two position switch will cause
		//the landing lights to turn on. This will be modified in the 
		//final code.
		sElemOn.setProperty('display', 'inline', '');		
		sElemOff.setProperty('display', 'none', '');
	} else {
		sElemOn.setProperty('display', 'none', '');
		sElemOff.setProperty('display', 'inline', '');
		}
	}
	
/*	Three Position Switch Function
*	This function, with the included arguments, allows the JS to parse which 
*	switch has been selected and react accordingly. Similiar to the twoPosSw
*	function. NOTE: this only sets swithes in a certain sequence (dn -> mid -> up -> dn)
*/
function threePosSw(mouseEvent, objectName, state)	{
	getObj(mouseEvent)
	
	var lsElemUp;
	var lsElemDn;
	var lsElemMid;	
		
	lsElemUp = objectName + "_UP";
	lsElemDn = objectName + "_DN";
	lsElemMid = objectName + "_MID";	
	
	var sElemUp = gSVGDoc.getElementById(lsElemUp).style
	var sElemDn = gSVGDoc.getElementById(lsElemDn).style
	var sElemMid = gSVGDoc.getElementById(lsElemMid).style
	
	if (state == 'DN')  {
		sElemDn.setProperty('display', 'inline', '');		
		sElemMid.setProperty('display', 'none', '');
		sElemUp.setProperty('display', 'none', '');
	} else if(state == 'MID') {
		sElemDn.setProperty('display', 'none', '');		
		sElemMid.setProperty('display', 'inline', '');
		sElemUp.setProperty('display', 'none', '');
	}else {
		sElemDn.setProperty('display', 'none', '');		
		sElemMid.setProperty('display', 'none', '');
		sElemUp.setProperty('display', 'inline', '');
	}
}

// translate spaces into equivalent AI exported space string
function spaceTrans(stringIn) {
	var result = ""
	for (var i = 0; i < stringIn.length; i++) {
		if (stringIn.charAt(i) == " ") {
			result += "_x0020_"
		} else {
			result += stringIn.charAt(i)
		}
	}
	return result
}
																													