/*  NOTICE:  Copyright [1999-2001] Adobe Systems Incorporated.  Adobe
*hereby grants you the rights to reproduce, modify and distribute this file
*and its contents, not including any fonts, audio files or raster images
*included or embedded in or linked to this file, (the "Software"), and to
*grant such rights to other parties subject to the following:  This notice
*shall be included in any copy of the Software or any portion thereof.  THE
*SOFTWARE IS PROVIDED TO YOU AS-IS, WITHOUT WARRANTIES OF ANY KIND, EXPRESS
*OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
*FITNESS FOR A PARTICULAR PURPOSE AND NON- INFRINGEMENT.  IN NO EVENT SHALL
*ADOBE BE LIABLE TO YOU OR ANY OTHER PARTY FOR ANY CLAIM, DAMAGES OR OTHER
*LIABILITY ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE.
*
*
*  Initial Author and Architect:  Glen H. Gersten
*
*
##############################################################################
# This script is organized as follows:
#	Global variables and arrays
#	Overlay definitions
#	Array functions
#	Initialization and data loading functions
#	Building functions
#	Elevator panel functions
#	Floor plan functions
#	Misc utility functions
##############################################################################
*/

/******************************
* Global variables and arrays *
******************************/
var path = location.href.substring(0, location.href.lastIndexOf('/'))
var thisPath = path + '/'
var dataPath = ''

/* Default building graphic to load - once multiple buildings are supported,
   change this accordingly */
   
var defaultLoad = thisPath + 'SJMain.html'


var SVGDoc, titleDoc, infoDoc, bldgDoc, navDoc, outDoc	// embedded SVG objects
var numInfoFields = 7	// number of information display fields for offices
var numDataFields = 4	// number of data fields for each occupant
var labels
var dataFile
var RmName, RmID
var hiName, hiOffice
var fileName, filePrefix
var fileSuffix = "-pdata.html"
var noDataLoad, mainLoaded, navLoaded, loadFinish, checkPass
var onColor = "cyan"
var offColor = "white"
var clickColor = '#DE600E'
var linkColor = '#0000FF'
var oldStyle, oldHiLight, oldTxtChange, oldID, oldFlrID, oldOvrlay, oldBldgHilight
var bldg, bldgClicked
var clicked
var floorPlan, thisFloor 
var bStart, bEnd
var gFile
var bldgID, thisBldg, bldg, lastBldgFile, outline
var flr
var intervalID
var isDisplay
var fadeElem, oldFade, fadeCount, fadeIntervalID, fadeTimerID
var firstLoad, firstLock


hiLightExts = new Array("_cr", "_cl", "_w", "_s", "_b", "_l")



/***********************
* Overlays definitions *
***********************/
overlayNum = 11	// be sure to change this as you add overlays

ovrlay = new makeArray(overlayNum)
ovrlay[0] = new overlay("usa.CA-WestTower-06", "w6")
ovrlay[1] = new overlay("usa.CA-WestTower-09", "w9")
ovrlay[2] = new overlay("usa.CA-WestTower-14", "w14_15")
ovrlay[3] = new overlay("usa.CA-WestTower-15", "w14_15")
ovrlay[4] = new overlay("usa.CA-WestTower-16", "w16")
ovrlay[5] = new overlay("usa.CA-WestTower-17", "w17")
ovrlay[6] = new overlay("usa.CA-WestTower-18", "w18")
ovrlay[7] = new overlay("usa.CA-EastTower-06", "e6")
ovrlay[8] = new overlay("usa.CA-EastTower-14", "e14_15")
ovrlay[9] = new overlay("usa.CA-EastTower-15", "e14_15")
ovrlay[10] = new overlay("usa.CA-EastTower-16", "e16")



/******************
* Array functions *
******************/
// make arrays
function makeArray(n) {
	this.length = n
	return this
}

// parse separate office occupants
function occupant(person1, person2, person3, person4, person5, person6, person7) {
	this.person1 = person1
	this.person2 = person2
	this.person3 = person3
	this.person4 = person4
	this.person5 = person5
	this.person6 = person6
	this.person7 = person7
	return this
}


// parse out name and info about conference rooms
function confOcc (confName, person1, person2, person3, person4) {
	this.confName = confName
	this.person1 = person1
	this.person2 = person2
	this.person3 = person3
	this.person4 = person4
}


// parse out conference room info
function confRm(confName, phone, other) {
	this.type = "confRm"
	this.confName = confName
	this.phone = phone
	this.other = other
}


// parse out the overlay info
function overlay (floor, name) {
	this.floor = floor
	this.name = name
}



/********************************************
* Initialization and data loading functions *
********************************************/
// main initialization
//////////////////////
function init() {
	// isolate the query string
	var query = this.location.search.substring(1)

	if (query) {
		// split off the data page and room ID
		var splitQuery = query.split('_')
		fileName = splitQuery[0]
		hiOffice = splitQuery[1]
		
		if (splitQuery[2] && splitQuery[3]) {
			hiOffice = hiOffice + '_' + splitQuery[2] + '_' + splitQuery[3]
		} else if (splitQuery[2]) {
			hiOffice = hiOffice + '_' + splitQuery[2]
		}

		// set the building variable
		tmp1 = fileName.substring(fileName.indexOf('-') +1, fileName.lastIndexOf('-'))
		lastBldgFile = tmp1.substring(0, tmp1.lastIndexOf('-'))
		loadIt = 0

		// set building variables
		whichBldg(lastBldgFile)

		// load the floor plan
		this.main.location = thisPath + floorPlan

		// load the data page
		dataLoad()
	} else {
		noDataLoad = "yes"

		// load the main building graphic
		this.main.location = defaultLoad
	}
}


// panel init
/////////////
function initPanel() {
	// get panel SVG document
	navDoc = this.nav.document.panel.getSVGDocument()

	// record that we've loaded
	navLoaded = "yes"
}


// building init
////////////////
function initBldg() {
	clearAll()
	outDoc = this.main.document.building.getSVGDocument()
	lastBldgFile = thisPath + "SJMain.html"
	lines()
}



// handle in-frame links
function frameLink(linkFile, linkRoom) {
	fileName = linkFile
	hiOffice = linkRoom

	if (fileName) {
		// set the building variable
		tmp1 = fileName.substring(fileName.indexOf('-') +1, fileName.lastIndexOf('-'))
		lastBldgFile = tmp1.substring(0, tmp1.lastIndexOf('-'))
		loadIt = 0

		// set building variables
		whichBldg(lastBldgFile)

		// load the floor plan
		this.main.location = thisPath + floorPlan

		// load the data page
		dataLoad()
	}
}

// call checkLoad
/////////////////
function checkCaller() {
	loadIt = 0
	
	// only call checkLoad if it's not currently running
	if (! intervalID) intervalID = setInterval("checkLoad()", 1500)
}


// check loading status
///////////////////////
function checkLoad() {
	checkPass = "no"
	loadFinish = "no"

	// check to see if we're done loading
	if (navLoaded == "yes" && mainLoaded == "yes") {
		if (noDataLoad == "yes") {
			checkPass = "yes"
		} else {
			if (loaded == "yes") getDoc()
		}

		if (checkPass == "yes") {
			// clear and reset the interval
			if (intervalID) clearInterval(intervalID)
			intervalID = null

			
			if (! fileName) {
				bldgStr = floorStr.substring( floorStr.indexOf('-') +1, floorStr.lastIndexOf('-') )
				whichBldg(bldgStr)
				fileName = filePrefix + floorNum + fileSuffix
			}

			// call the main initialization routines
			contInit()
		}
	}
	
	loadIt++
	
	if (loadIt > 7) {
		if (intervalID) clearInterval(intervalID)
		intervalID = null
		alert('There were problems loading the data')
	}
}


// continue init when loading is complete
/////////////////////////////////////////
function contInit() {
	// handle data and display initialization if we've a file name
	if (fileName) {
		// make sure fileName is properly set
		var fullFile = this.data.location.href
		var fileStr = fullFile.substring(fullFile.lastIndexOf('/')+1)
		
		if (fileName != this.data.location) fileName = fileStr

		// initialize the data
		dataInit();

		// get the floor number
		thisFloor = floorNum

		// set the button and building IDs
		buttonID = 'b' + thisFloor

		// strip off the leading zero if necessary
		if (thisFloor.indexOf('0') == 0) {
			thisFloor = thisFloor.substring(1)
		}

		// set basic building variables
		whichBldg(lastBldgFile)

		// set the floor name
		floorName = floorName + "-" + thisFloor
		
		// clear and set the elevator display
		clearDisplay()
		setDisplay(thisBldg, floorName)

		// clear and set the proper buttons
		if (clicked) clearButton(clicked)
		setButton(bldgID, 'b')
		setButton(buttonID)

		// show the appropriate buttons
		showButtons(bStart, bEnd)
		
		// show the locking directions
		if (! firstLoad) {
			showFade('lock')
			firstLoad = "done"
		}
	}

	// handle office highlighting if we've a office num
	if (hiOffice) {
		// hilight the office
		hilight('on')

		// make sure we've got a number not a name
		RmID = hiOffice
		getConfRoom()

		// make sure RmID and hiOffice match
		hiOffice = RmID + ""

		// show the occupant info
		rmDisplay()
	}
}


// initialize the data
//////////////////////
function dataInit() {
	var thisShow
	
	// set the page title
	titleElem = titleDoc.getElementById('floorTitle')
	titleElem.firstChild.data = fTitle

	// hide old overlays
	hideOvrlay()
	
	// show appropriate overlays
	showOvrlay()

	
	// set the conference room names
	for (i=1; i <= 6; i++) {
		// get the name from the confs array
		thisName = confs[i-1]

		if (thisName) {
			// get the proper element
			confRef = "Con" + i + "Txt"
			thisElem = SVGDoc.getElementById(confRef)

			// replace "_" with " "
			thisText = thisName.replace(/_/, " ")

			// set the text to the actual name
			thisElem.firstChild.data = thisText

			// change the path ID to the name
			var nameStr = 'Rm_' + thisName
			var nameElem = thisElem.previousSibling.previousSibling
			nameElem.setAttribute('id', nameStr)
		}
	}
	
	// save the fact we've finished loading and initializing
	loadFinish = "yes"
}


// load proper floor page
/////////////////////////
function floorLoad() {
	if (mainLoaded != "yes") {
		// load the floor plan page
		floorFile = thisPath + floorPlan
		this.main.location = floorFile
	} else {
		// reset the title SVG to "loading floor"
		if (titleDoc) {
			titleElem = titleDoc.getElementById('floorTitle')
			titleElem.firstChild.data = 'Loading Floor...'
		}

		// hide the overlays
		hideOvrlay()
	}
}


// load the data file
/////////////////////
function dataLoad() {
	loaded = ""
	dataFile = dataPath + fileName
	//alert(dataFile)
	this.data.location = dataFile

	// make sure the file is loaded and initialized
	noDataLoad = ""
	checkCaller()
}



/*********************
* Building functions *
**********************
*********************/
// building mouseovers
//////////////////////
function onFlr(mouseEvt) {
	if (! bldgDoc) {
		bldgDoc = this.main.document.building.getSVGDocument()
	}

	if (bldgDoc) {
		// get the group element and ID
		//var SVGElem = getGroup(mouseEvt)
		var SVGElem = mouseEvt.target
		var thisID = SVGElem.getAttribute('id')

		flrToggle(thisID, 'on')
		
		// save the floor ID
		oldFlrID = thisID
	}
	
}


// building mouseouts
/////////////////////
function offFlr() {
	flrToggle(oldFlrID, 'off')
}


// building highlite toggles
////////////////////////////
function flrToggle(ID, state) {
	if (bldgDoc) {
		for (i=0; i < hiLightExts.length; i++) {
			var elemID = ID + hiLightExts[i]
			var elem = bldgDoc.getElementById(elemID)

			if (elem) {
				if (state == "on") {
					elem.style.setProperty('visibility', 'visible', '')
				} else {
					elem.style.setProperty('visibility', 'hidden', '')
				}
			}
		}
	}
}


// building clicks
//////////////////
function bldgNav(mouseEvt) {
	// left button only
	if (mouseEvt.button == 0) {
		// get the group element and ID
		var SVGElem = mouseEvt.target
		var thisID = SVGElem.getAttribute('id') + ""

		// get building and floor
		var info = thisID.split('_')
		bldg = info[0]
		flr = info[1]

		// set the building variables
		whichBldg(bldg)

		// unhighlight clicked building and floor buttons
		if (bldgClicked && bldgID != bldgClicked) {
			clearButton(bldgClicked, 'b')

			// clear the load variables
			mainLoaded = "no"
		}

		// set the appropriate building button
		setButton(bldgID, 'b')

		// hide current buttons
		hideButtons()

		// show new buttons
		showButtons(bStart, bEnd)

		// strip the leading zero off the floor if necessary
		if (flr.indexOf('0') == 0) {
			flrNum = flr.substring(1)
		} else {
			flrNum = flr
		}

		// set the floor display
		floorName = floorName + "-" + flrNum
		setDisplay(thisBldg, floorName)

		// load the proper floor diagram
		fileName = filePrefix + flr + fileSuffix
		floorLoad()

		// load the proper data
		dataLoad()
	} else {
		// turn off hilight
		offFlr()
	}
}


// hide and display building outlines
/////////////////////////////////////
function lines() {
	if (outDoc) {
		// clear old hilight
		if (oldBldgHilight) {
			oldBldgHilight.setProperty('display', 'none', '')
		}

		// set new hilight
		if (outline) {
			oldBldgHilight = outDoc.getElementById(outline).style
			oldBldgHilight.setProperty('display', 'inline', '')
		}
	}
}


/***************************
* Elevator panel functions *
****************************
***************************/
// e-panel mouseovers
/////////////////////
function onBImg(mouseEvt, ident) {
	// get the group element
	var SVGElem = getGroup(mouseEvt)
	var thisID = SVGElem.getAttribute('id') + ""
	var hiChange = "no"
	
	// parse the DOM tree to the highlight element
	hiLight = SVGElem.lastChild.previousSibling
	txtChange = hiLight.previousSibling.previousSibling.firstChild

	// check to see if we should be doing the rollover
	if (thisID != clicked && thisID != bldgClicked) {
		// set the hiLight color
		hiLight.style.setProperty('fill', onColor, '')
		txtChange.style.setProperty('fill', onColor, '')

		// save the style object for the rolloff
		oldHiLight = hiLight
		oldTxtChange = txtChange
		oldID = thisID + ""
	}
}


// e-panel mouseouts
////////////////////
function offBImg() {
	if (oldHiLight && clicked != oldID && bldgClicked != oldID) {
		oldHiLight.style.setProperty('fill', offColor, '')
		oldTxtChange.style.setProperty('fill', offColor, '')
	}
}


// e-panel clicks
/////////////////
function button(mouseEvt, ident) {
	// left mouse button only
	if (mouseEvt.button == 0) {
		// get the group element
		var SVGElem = getGroup(mouseEvt)
		var thisID = SVGElem.getAttribute('id')

		// blank office highlite settings
		if (hiOffice && SVGDoc) {
			// see if we have a conference room
			if (hiOffice < 99) hiOffice = Rm[hiOffice].confName

			// get the ID name, stroke and color, and reset the variable
			officeName = 'Rm_' + hiOffice
			thisOffice = SVGDoc.getElementById(officeName).style
			thisOffice.setProperty('stroke-width', '1', '')		
			thisOffice.setProperty('fill', offColor, '')
			hiOffice = ''

			// clear the info labels and fields
			hideInfo()
		}

		if (ident != "b") {
			// unhighlight last clicked element
			if (clicked) {
				clearButton(clicked)
			}

			// see if the floor page has been loaded
			floorLoad()

			// get the button number and file name
			bnumber = thisID.substring(1)
			fileName = filePrefix + bnumber + fileSuffix

			// load the data file
			dataLoad()

			// strip off the leading zero if necessary
			if (bnumber.indexOf('0') == 0) {
				bnumber = bnumber.substring(1)
			}


			// play a sound
		} else {
			// unhighlight clicked building and floor buttons
			if (bldgClicked) {
				clearButton(bldgClicked, 'b')

				if (clicked) clearButton(clicked)

				// clear the load variables
				mainLoaded = "no"
				bldgDoc = null
			}

			// determine which building we're dealing with
			whichBldg(thisID)


			// load the building graphic if necessary
			if (lastBldgFile != gFile) {
				// reset the load variables
				mainLoaded = null
				SVGDoc = null
				titleDoc = null
				infoDoc = null
				outDoc = null
				bldgHilight = null
				
				// clear any running intervals
				clearInt()

				// load the page
				this.main.location = gFile

				// record the current building file
				lastBldgFile = gFile
			}

			// set the floor display
			setDisplay(thisBldg, floorName)
			setButton(thisID, 'b')

			// hide current buttons
			hideButtons()

			// show new buttons
			showButtons(bStart, bEnd)
			
			// show and hide building outlines
			lines()
		}
	} else {
		// turn of hilight
		offBImg()
	}
}


// clear e-panel display
////////////////////////
function clearDisplay() {
	floorTxt = navDoc.getElementById('floorTxt').firstChild.firstChild
	floorTxt.data = ''
	bldgTxt = navDoc.getElementById('buildingTxt').firstChild.firstChild
	bldgTxt.data = ''
	isDisplay = "no"
}


// set e-panel display
//////////////////////
function setDisplay(bldg, flr) {
	if (bldg && flr) {
		floorTxt = navDoc.getElementById('floorTxt').firstChild.firstChild
		floorTxt.data = flr
		bldgTxt = navDoc.getElementById('buildingTxt').firstChild.firstChild
		bldgTxt.data = bldg
		isDisplay = "yes"
	}
}


// clear selected e-panel button
////////////////////////////////
function clearButton(thisID, ident) {
	if (thisID) {
		var hiElem = navDoc.getElementById(thisID)
		var hiLight = hiElem.lastChild.previousSibling
		var txtChange = hiLight.previousSibling.previousSibling.firstChild

		// change to the unselected colors
		hiLight.style.setProperty('fill', offColor, '')
		txtChange.style.setProperty('fill', offColor, '')

		// reset the click variables
		if (ident == "b") {
			bldgClicked = null
			bldgClickedHiLight = null
		} else {
			clicked = null
			clickedHiLight = null
		}
	}
}


// set e-panel button
/////////////////////
function setButton(thisID, ident) {
	if (thisID) {
		var hiElem = navDoc.getElementById(thisID)
		var hiLight = hiElem.lastChild.previousSibling
		var txtChange = hiLight.previousSibling.previousSibling.firstChild

		// change to proper colors
		hiLight.style.setProperty('fill', clickColor, '')
		txtChange.style.setProperty('fill', offColor, '')

		// reset the click variables
		if (ident == "b") {
			bldgClicked = thisID
			bldgClickedHiLight = hiLight
		} else {
			clicked = thisID
			clickedHiLight = hiLight
		}
	}
}


// hide e-panel buttons
///////////////////////
function hideButtons() {
	for (i=1; i <=18; i++) {
		if (i < 10) {
			bName = "b0" + i
		} else {
			bName = "b" + i
		}

		thisB = navDoc.getElementById(bName)

		// hide the button if it exists
		if (thisB) {
			thisB.style.setProperty('display', 'none', '')
		}
	}
}


// show e-panel buttons
///////////////////////
function showButtons(bStart, bEnd) {
	for (i = bStart; i <= bEnd; i++) {
		if (i < 10) {
			bName = "b0" + i
		} else {
			bName = "b" + i
		}

		thisB = navDoc.getElementById(bName)

		// hide the button if it exists
		if (thisB) {
			thisB.style.setProperty('display', 'inline', '')
		}
	}
}



/***********************
* Floor plan functions *
************************
***********************/
// room mouseovers
//////////////////
function onImg(mouseEvt) {
	if (! hiOffice && loadFinish == "yes") {
		var occNum = 0

		// get the group element
		var SVGElem = getGroup(mouseEvt)

		// get the room name and ID
		getRoom(SVGElem)


		// get the path style object
		var SVGStyle = SVGDoc.getElementById(RmName).style

		// change the stroke
		SVGStyle.setProperty('stroke-width', '3', '')
		SVGStyle.setProperty('fill', onColor, '')

		// save the style object for the rolloff
		oldStyle = SVGStyle

		// show the occupant info
		rmDisplay()
	}
}


// display room info
////////////////////
function rmDisplay() {
	if (RmID) {
		if (Rm[RmID]) {
			var person1 = Rm[RmID].person1
			var person2 = Rm[RmID].person2
			var person3 = Rm[RmID].person3
			var person4 = Rm[RmID].person4
			var person5 = Rm[RmID].person5
			var person6 = Rm[RmID].person6
			var person7 = Rm[RmID].person7
			var type = Rm[RmID].type

			// split out the data into separate fields for offices
			if (person1 && type != "confRm") {
				p1Info = person1.split('%')
				occNum = 1

				if (person2) {
					p2Info = person2.split('%')
					occNum = 2
				}

				if (person3) {
					p3Info = person3.split('%')
					occNum = 3
				}

				if (person4) {
					p4Info = person4.split('%')
					occNum = 4
				}

				if (person5) {
					p5Info = person5.split('%')
					occNum = 5
				}

				if (person6) {
					p6Info = person6.split('%')
					occNum = 6
				}

				if (person7) {
					p7Info = person7.split('%')
					occNum = 7
				}

				// display the data labels
				labels.style.setProperty('display', 'inline', '')

				// display the actual data
				for (j=1; j <= occNum; j++) {
					// get the data fields
					infoName = "i" + j + "text"
					thisName = eval("p" + j + "Info")[0]

					// get the initial text element
					thisElem = infoDoc.getElementById(infoName).firstChild

					// set the text to the actual name
					thisElem.data = thisName

					// set the rest of the fields
					for (k=1; k < numDataFields; k++) {
						if (k == 1) {
							thisElem = thisElem.nextSibling
						} else {
							thisElem = thisElem.nextSibling.nextSibling
						}

						thisValue = eval("p" + j + "Info")[k]

						// make sure we at least have a space as the value
						if (thisValue == "") thisValue = " "

						if (k == 1) {
							// set the link
							thisAnchor = 'mailto:' + thisValue + '_(doNotUse)' + '@adobe.com'
							thisElem.setAttribute('xlink:href', thisAnchor)

							// set the tspan data
							thisElem.firstChild.firstChild.data = thisValue
						} else {
							thisElem.firstChild.data = thisValue
						}
					}

					// make the data visible
					infoField = "info" + j
					thisField = infoDoc.getElementById(infoField)

					thisField.style.setProperty('display', 'inline', '')
				}	
			}

			// handle conference rooms
			if (type == "confRm") {
				var phone = Rm[RmID].phone
				var other = Rm[RmID].other

				// display the data labels
				confLabels.style.setProperty('display', 'inline', '')

				// get the text elements
				var phoneElem = infoDoc.getElementById('confText').firstChild
				var otherElem = phoneElem.nextSibling.firstChild

				// set the text
				phoneElem.data = phone
				otherElem.data = other

				// make the data visible
				confInfo.style.setProperty('display', 'inline', '')
			}
		} else {
			// indicate the office may be vacant
			infoName = "i1text"
			thisData = "This office appears to be vacant"
			thisElem = infoDoc.getElementById(infoName)
			parentElem = thisElem.parentNode

			// set the fist data field
			thisElem.firstChild.data = thisData

			// clear the rest of the fields
			thisValue = " "
			thisElem = thisElem.firstChild.nextSibling

			for (k=1; k < numDataFields; k++) {
				if (k == 1) {
					thisElem.firstChild.firstChild.data = thisValue
				} else {
					thisElem.firstChild.data = thisValue
				}

				thisElem = thisElem.nextSibling.nextSibling
			}

			// make the field visible
			parentElem.style.setProperty('display', 'inline', '')
		}
	}
}


// room mouseouts
/////////////////
function offImg() {
	if (! hiOffice && loadFinish == "yes") {
		// reduce stroke
		if (oldStyle != null) {
			oldStyle.setProperty('stroke-width', '1', '')
			oldStyle.setProperty('fill', offColor, '')
		}

		// hide the labels and info fields
		hideInfo()
	}
}


// room clicks
//////////////
function selector(mouseEvt) {
	// left mouse button only
	if (mouseEvt.button == 0) {
		if (loadFinish == "yes") {
			// get the group element
			var SVGElem = getGroup(mouseEvt)

			// get the room name and ID
			getRoom(SVGElem)

			if (! hiOffice) {
				// lock down the office
				hiOffice = RmID + ""

				// switch to the selected office color
				hilight('on')

				// make sure room info is displayed
				rmDisplay()
			} else {
				// unhilite the office
				hilight('off')

				// see if the click was on the same room
				if (RmID == hiOffice) {
					// clear the office lock
					hiOffice = ""
			
					// hide the unlock message
					if (oldFade) showFade('unlock', 'done')
				} else {
					// hilight the next office
					hiOffice = RmID + ""

					// switch to the selected office color
					hilight('on')

					// display the room info
					rmDisplay()
				}
			}
		}
	} else {
		// turn off the button hilight
		offImg()
	}
}


// room hilights
////////////////
function hilight(state) {
	if (hiOffice < 99) {
		var officeName = 'Rm_' + Rm[hiOffice].confName
		var altOfficeName = 'Rm_' + Rm[hiOffice].confName + '_' + thisFloor
	} else {
		var officeName = 'Rm_' + hiOffice
		var altOfficeName = 'Rm_' + hiOffice + '_' + thisFloor
	}

	var tempOffice = SVGDoc.getElementById(altOfficeName)

	// get the office style element
	if (tempOffice) {
		var thisOffice = tempOffice.style
	} else {
		tempOffice = SVGDoc.getElementById(officeName)
		if (tempOffice) var thisOffice = tempOffice.style
	}

	// set the stroke and fill
	if (thisOffice) {
		if (state == "on") {
			thisOffice.setProperty('stroke-width', '3', '')		
			thisOffice.setProperty('fill', clickColor, '')
		
			// show the unlocking directions
			if (! firstLock) {
				showFade('unlock')
				firstLock = "done"
			}
		} else {
			thisOffice.setProperty('stroke-width', '1', '')		
			thisOffice.setProperty('fill', offColor, '')
			// hide all the info labels and data
			hideInfo()
		}
	} else {
		// reset hilight vars because room doesn't exist
		hiOffice = ""
		RmID = null
	}
}


// hide info fields
///////////////////
function hideInfo() {
	// hide the labels and info
	labels.style.setProperty('display', 'none', '')
	confLabels.style.setProperty('display', 'none', '')
	confInfo.style.setProperty('display', 'none', '')

	// hide all of the info fields
	for (i=1; i <= numInfoFields; i++) {
		infoField = "info" + i
		thisField = infoDoc.getElementById(infoField)
		thisField.style.setProperty('display', 'none', '')
	}

	// remove the main element from tree to clear text selection
	// -- this code commented out due to performance concerns --
	/*mainElem = infoDoc.getElementById('infoFields')
	node = mainElem.firstChild.nextSibling

	while( node != null && node.getNodeType() != 1 ) {
		node = node.nextSibling;
	}
	
	if( node != null ) {
		mainElem.removeChild(node)
		mainElem.appendChild(node)
	}*/
}


// show overlays
////////////////
function showOvrlay() {
	for (k=0; k < ovrlay.length; k++) {
		ovrlayName = ovrlay[k].name
		ovrlayFlr = ovrlay[k].floor + fileSuffix

		if (ovrlayFlr == fileName) {
			thisOvrlay = SVGDoc.getElementById(ovrlayName)
			
			//trap for missing or mislabeled overlays
			if (thisOvrlay) {
				overStyle = thisOvrlay.style

				if (ovrlay[k].floor == floorStr) {
					// show the overlay
					overStyle.setProperty('display', 'inline', '')
					oldOvrlay = thisOvrlay
				}
			}
		}
	}
}


// hide overlays
////////////////
function hideOvrlay() {
	if (oldOvrlay) {
		oldOvrlay.style.setProperty('display', 'none', '')
		oldOvrlay = null

	}
}


/*************************
* Misc utility functions *
*************************/
// get the SVG document handles
///////////////////////////////
function getDoc() {
	SVGDoc = this.main.document.floor.getSVGDocument()
	titleDoc = this.main.document.title.getSVGDocument()
	infoDoc = this.main.document.info.getSVGDocument()
	labels = infoDoc.getElementById('infoLabels')
	confLabels = infoDoc.getElementById('confLabels')
	confInfo = infoDoc.getElementById('confInfo')

	// make sure the docs are set
	if(SVGDoc && titleDoc && infoDoc) {
		checkPass = "yes"
	} else {
		checkPass = "no"
	}
}


// get building info
////////////////////
function whichBldg(ID) {
	if (ID == "WestTower" || ID == "w") {
		floorPlan = "SJWest.html"
		filePrefix = "usa.CA-WestTower-"
		floorName = "W"
		thisBldg = "San Jose"
		bStart = 6
		bEnd = 18
		gFile = thisPath + "SJMain.html"
		bldgID = "WestTower"
		outline = "west_tower_outline"
	} else if (ID == "EastTower" || ID == "e") {
		floorPlan = "SJEast.html"
		filePrefix = "usa.CA-EastTower-"	
		floorName = "E"
		thisBldg = "San Jose"
		bStart = 6
		bEnd = 16
		gFile = thisPath + "SJMain.html"
		bldgID = "EastTower"
		outline = "east_tower_outline"
	} else if (ID == "Seattle" || ID == "s") {
		floorName = "N/A"
		thisBldg = "Seattle"
		bStart = null
		bEnd = null
		gFile = thisPath + "SeattleMain.html"
		bldgID = "Seattle"
		outline = null
	}
}


// get room name and ID
///////////////////////
function getRoom(SVGElem) {
	var thisRm = SVGElem.firstChild.nextSibling
	RmName = thisRm.getAttribute('id')
	
	// find the proper element and get the id
	while (RmName.charAt(0) == "") {
		thisRm = thisRm.nextSibling
		RmName = thisRm.getAttribute('id')
	}

	// strip off the "Rm_" prefix
	RmID = RmName.substring(3)
	
	// remove overlay trailers if we have them
	var exp = /.*_\d+$/
	if (exp.exec(RmID)) {
		oLay = RmID.lastIndexOf('_')
		RmID = RmID.substring(0, oLay)
	}
	
	// check if we've a number or name
	getConfRoom()
}

// get conference room ID number
function getConfRoom() {
	// check if we have a number or a name (conference room)
	var re = /.*\d$/
	
	if (! re.exec(RmID)) {
		// find the array ID for the conference room
		for (i=1; i <= 100; i++) {
			if (Rm[i]) {
				if (Rm[i].confName == RmID) {
					RmID = i
					break
				}
			}
		}
	}
}


// get the group element
////////////////////////
function getGroup(mouseEvt) {
	var thisElem = mouseEvt.target.parentNode
	var thisType = thisElem.nodeName
	
	// make sure we've parsed up to the group element level
	while (thisType != "g") {
		thisElem = thisElem.parentNode
		thisType = thisElem.nodeName
	}
	
	// return the group element
	return thisElem
}


// clear all displays and critical variables
////////////////////////////////////////////
function clearAll() {

	// clear the panel display and any selected buttons
	if (isDisplay == "yes") {
		if (thisBldg == "Seattle") {
			clearDisplay()
			clearButton(bldgClicked, 'b')
		} else {
			var clearFloor = floorName.substring(0, 1)
			setDisplay(thisBldg, clearFloor)
		}

		clearButton(clicked)
	}
	
	// reset variables
	clearVar()

	// clear data frame
	var clearFile = thisPath + 'data.html'

	if (this.data.location != clearFile) this.data.location = clearFile
}


// clear running intervals
//////////////////////////
function clearInt() {
	// clear dataload checks
	if (intervalID) {
		clearInterval(intervalID)
		intervalID = null
	}

	// clear fade timers
	if (fadeIntervalID) {
		clearInterval(fadeIntervalID)
		fadeIntervalID = null
	}

	if (fadeTimerID) {
		clearTimeout(fadeTimerID)
		fadeTimerID = null
	}
}


// clear all floor variables
////////////////////////////
function clearVar() {
	mainLoaded = "no"
	loaded = "no"
	loadFinish = "no"
	bldgDoc = null
	titleDoc = null
	outDoc = null
	oldOvrlay = null
	hiOffice = null
	oldStyle = null
	oldHiLight = null
	oldTxtChange = null
	oldBldgHilight = null
	oldFade = null
}


// reset state
//////////////
function resetState() {
	lastBldgFile = null
	clearDisplay()
	clearButton(bldgClicked, 'b')
	clearButton(clicked)
	isDisplay = "no"
	outline = null
	clearInt()
	clearAll()
}


// open a window
////////////////
function winOpen(url, high, wide, other) {
	winPath = thisPath + url
	
	if (! other) {
		window.open(winPath, "", "height=" + high + ",width=" + wide)
	} else {
		window.open(winPath, "", "height=" + high + ",width=" + wide + ",scrollbars,resizable")
	}
	
	return false
}


// show and fade out an element
///////////////////////////////
function showFade(name, state) {
	// get the style element
	fadeElem = SVGDoc.getElementById(name).style

	if (state == "done") {
		fadeCaller()
	} else {
		// hide the old element
		if (oldFade) {
			oldFade.setProperty('display', 'none', '')
			oldFade = null
		}

		// show the element
		fadeElem.setProperty('display', 'inline', '')

		// set the opacity
		fadeElem.setProperty('opacity', '1', '')

		// make sure the fade counter is set
		fadeCount = 1

		// clear any old timers
		if (fadeTimerID) {
			clearTimeout(fadeTimerID)
			fadeTimerID = null
		}

		// pause to allow reading
		fadeTimerID = setTimeout("fadeCaller()", 15000)

		// set the old fade value
		oldFade = fadeElem
	}
}

// call fader function
//////////////////////
function fadeCaller() {
	// clear any set intervals
	if (fadeIntervalID) {
		// clear the interval
		clearInterval(fadeIntervalID)
		fadeIntervalID = null
	}

	// call the new interval
	fadeIntervalID = setInterval("fader()", 100)
}


// fade out an element
//////////////////////
function fader() {
	// determine the opacity setting
	var setting = 1 - (fadeCount / 4)

	// set the opacity
	fadeElem.setProperty('opacity', setting, '')

	// increment the fade counter
	fadeCount ++

	// check to see if we're done
	if (fadeCount > 4) {
		// hide the element
		fadeElem.setProperty('display', 'none', '')

		// clear the interval
		if (fadeIntervalID) {
			clearInterval(fadeIntervalID)
			fadeIntervalID = null
		}
	}
}

