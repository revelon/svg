/*****************************************************************************
*                                                                            *
*                           openwindow.js                                    *
*                                                                            *
*                                                                            *
*                                                                            *
*  Coded and debugged by: Kris Rockwell (aka DJ CBT)                         * 
*                                                                            *
*  If you use this code, these comments MUST remain.                         *
*                                                                            *
*****************************************************************************/

//To use create a link that looks kie such:
//<a href="#" onClick="openAWindow('target.htm', 'window title', width, height, center)>link text</a>
/* This will opena window and fill it with specified content. */

function openAWindow( pageToLoad, winName, width, height, center, scrollbars) {
				 

    args = "width=" + width + "," 
    + "height=" + height + "," 
    + "location=0," 
    + "menubar=0,"
    + "resizable=1,"
    + "scrollbars=" + scrollbars + ","
    + "status=0," 
    + "titlebar=0,"
    + "toolbar=0,"
    + "hotkeys=0,"

    window.open( pageToLoad,winName,args );
}
