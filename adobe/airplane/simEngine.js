/********************************************************************************
*																				*
*	This Sim engine will activate the appropriate element based upon an			*
*	argument passed from the PanelFunc.js engine. This allows seperate			*
*	engines to be maintained for both the panel and the actual emulation.		*
*																				*
*	Built by: Kris Rockwell														*
*	No modifications without permission please.									*
*	If you use this code please send email to kris_rockwell[nospam]@yahoo.co.uk.*
*	Remove the [nospam] for address.											*
*																				*
*																				*
*																				*
*																			    *
*********************************************************************************/
//set global variable to identify the target object
var gAircraft

//Set variable to identity of object.
//This is handled through an onload event on the object
function Init(e) {
	gAircraft = e.target.ownerDocument	
	}
	
//Put the targeted object in the correct state
//Each object in the simulation has a corresponding function call. In theory these could be strung
//together for a chain reaction.
function noseLight(state)	{
	var oTaxiLight = gAircraft.getElementById('TAXI').style;
	var oTOLight = gAircraft.getElementById('TAKEOFF').style;	
	if(state== 'OFF')	{
		oTaxiLight.setProperty('display','none', '')
		oTOLight.setProperty('display','none', '')
	}else if(state=='TAXI')	{
		oTaxiLight.setProperty('display','inline', '')
		oTOLight.setProperty('display','none', '')
	}else{
		oTaxiLight.setProperty('display','none', '')
		oTOLight.setProperty('display','inline', '')
	}
}

function navLogo(state)	{
	var oNavLight = gAircraft.getElementById('NAVLT').style;
	var oLogoLt = gAircraft.getElementById('LOGOLT').style;
	if(state=='OFF')	{
		oNavLight.setProperty('display','none', '')
		oLogoLt.setProperty('display','none', '')
	}else if(state=='NAV')	{
		oNavLight.setProperty('display','inline', '')
		oLogoLt.setProperty('display','none', '')	
	}else{
		oNavLight.setProperty('display','inline', '')
		oLogoLt.setProperty('display','inline', '')	
	}
}

function strobeLt(state)	{
	var oStrobe = gAircraft.getElementById('STROBE').style;	
	if(state=='OFF')	{
		oStrobe.setProperty('display','none', '')
	}else{
		oStrobe.setProperty('display','inline', '')
	}
}

function rwyTo(state)	{
	var oRwyTo = gAircraft.getElementById('RWYTUO').style;	
	if(state=='OFF')	{
		oRwyTo.setProperty('display','none', '')
	}else{
		oRwyTo.setProperty('display','inline', '')
	}
}

function wingLt(state)	{
	var oWingLt = gAircraft.getElementById('WINGLT').style;	
	if(state=='OFF')	{
		oWingLt.setProperty('display','none', '')
	}else{
		oWingLt.setProperty('display','inline', '')
	}
}

function landLt(state)	{
	var oLandLt = gAircraft.getElementById('LIGHT').style;	
	if(state=='OFF')	{
		oLandLt.setProperty('display','none', '')
	}else{
		oLandLt.setProperty('display','inline', '')
	}
}

function beaconLt(state)	{
	var oBeaconLt = gAircraft.getElementById('BEACON').style;	
	if(state=='OFF')	{
		oBeaconLt.setProperty('display','none', '')
	}else{
		oBeaconLt.setProperty('display','inline', '')
	}
}