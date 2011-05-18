<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="h"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:h="http://lmc.eu/ns/helper"
    xmlns:m="http://exslt.org/math"
    xmlns:e="http://exslt.org/common"
    xmlns="http://www.w3.org/2000/svg"
    extension-element-prefixes="m e"
>
    <xsl:output indent="yes"/>
    
    <xsl:variable name="dx" select="10"/>
    <xsl:variable name="dy" select="5"/>
    <xsl:variable name="lineHeight" select="20"/>
    <xsl:variable name="boxWidth" select="150"/>
    
    <xsl:template match="/">
        <xsl:variable name="org-with-x-coo">
            <xsl:apply-templates select="h:org" mode="axis-children">
                <xsl:with-param name="coo" select="$dx"/>
                <xsl:with-param name="axis" select="'x'"/>
                <xsl:with-param name="spacing" select="40"/>
            </xsl:apply-templates>
        </xsl:variable>
        <!--xsl:copy-of select="e:node-set($org-with-x-coo)"/-->
        <xsl:variable name="org-with-y-coo">
            <xsl:apply-templates select="e:node-set($org-with-x-coo)/h:org" mode="axis-siblings">
                <xsl:with-param name="coo" select="5"/>
                <xsl:with-param name="axis" select="'y'"/>
                <xsl:with-param name="spacing" select="15"/>
            </xsl:apply-templates>
        </xsl:variable>
        <xsl:variable name="radialGradient">
            <xsl:call-template name="radialGradient">
                <xsl:with-param name="level">
                    <xsl:variable name="h">
                        <xsl:for-each select="//h:org[not(h:org)]">
                            <h:v><xsl:value-of select="count(ancestor-or-self::h:org)"/></h:v>
                        </xsl:for-each>
                    </xsl:variable>
                    <xsl:value-of select="m:max(e:node-set($h)/h:v)"/>
                </xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="radialGradient">
                <xsl:with-param name="level">
                    <xsl:variable name="h">
                        <xsl:for-each select="//h:person[not(h:person)]">
                            <h:v><xsl:value-of select="count(ancestor-or-self::h:person)"/></h:v>
                        </xsl:for-each>
                    </xsl:variable>
                    <xsl:value-of select="m:max(e:node-set($h)/h:v)"/>
                </xsl:with-param> 
                <xsl:with-param name="name" select="'p'"/>
            </xsl:call-template>
        </xsl:variable>
        <xsl:variable name="h1">
            <xsl:for-each select="e:node-set($org-with-y-coo)//*[@y and (@height != '')]">
                <h:v><xsl:value-of select="number(@y) + number(@height)"/></h:v>
            </xsl:for-each>
        </xsl:variable>
        <xsl:variable name="h2">
            <xsl:for-each select="e:node-set($org-with-y-coo)//*[@x and (@width != '')]">
                <h:v><xsl:value-of select="number(@x) + number(@width)"/></h:v>
            </xsl:for-each>
        </xsl:variable>
        <svg height="{m:max(e:node-set($h1)/h:v) + 10}" 
            width="{m:max(e:node-set($h2)/h:v) + 15}">
            <title>LMC Organization Structure</title>
            <style type="text/css">
      g{
        cursor: pointer;
      }
      g.no-child{
        cursor: default;
      }
      rect{
         stroke: #000;
         stroke-width: 1;
         fill: #fff;
      }
      rect.plus{
      
      }
      #ol1 > stop{
        stop-color:#e09898;
      }
      #ol2 > stop{
        stop-color:#c0d098;
      }
      #ol3 > stop{
        stop-color:#80a0b0;
      }
      #ol4 > stop{
        stop-color:#fec504;
      }
      #ol5 > stop{
        stop-color:yellow;
      }
      #teaml > stop{
        stop-color:#99ff66;
      }
      #middle > stop{
        stop-color: #ffacac;
      }
      #lmcman > stop{
        stop-color: #00ffcc;
      }
      #board > stop{
        stop-color: #ffe2a6;
      }
      #pl1 > stop{
        stop-opacity:.4;
      }
      #teaml > stop{
        stop-opacity:.4;
      }
      #middle > stop{
        stop-opacity:.4;
      }
      #lmcman > stop{
        stop-opacity:.4;
      }
      #board > stop{
        stop-opacity:.4;
      }
      rect.TEAML{
         fill: url(#teaml);        
      }
      rect.MIDDLE{
         fill: url(#middle);        
      }
      rect.LMCMAN{
         fill: url(#lmcman);        
      }
      rect.BOARD{
         fill: url(#board);        
      }
      .gradient stop{
           stop-opacity:1;
           stop-color:#fff;
      }
      circle{
        fill: white;
        stroke: black;
        stroke-width: 1;
      }
      circle.hover{
        fill: white;
        fill-opacity: .2;
      }
      circle.hover:hover{
        fill: blue;
        fill-opacity: .2;
        stroke-width: 2;
      }
      #ol1 > stop:first-child, 
      #ol2 > stop:first-child,
      #ol3 > stop:first-child,
      #ol4 > stop:first-child,
      #ol5 > stop:first-child,
      #pl1 > stop:first-child,
      #middle > stop:first-child,
      #teaml > stop:first-child,
      #lmcman > stop:first-child,
      #board > stop:first-child{
          stop-color:#fff;
          stop-opacity:1;
      }
      text{
        font-size:14px;font-family:Arial;
        text-anchor: middle;
      }
      text.label{
         font-weight: bold;
      }
      .fce{
         font-weight: normal;
      }
      polyline{
        stroke:#555;stroke-width:1;
        fill: none;
      }
      <xsl:copy-of select="e:node-set($radialGradient)/text()"/>
       <xsl:value-of select="e:node-set($radialGradient)/text()[last()]"/>
            </style>
            <style type="text/css" media="print">
      polyline{
        stroke:#000;stroke-width:1;
        fill: none;
      }
      <xsl:for-each select="e:node-set($radialGradient)/text()">
          <xsl:value-of select="substring-before(.,'{')"/>
          <xsl:if test="position() != last()">, </xsl:if>
      </xsl:for-each>
      <xsl:text>{fill: none;}</xsl:text>
rect.TEAML, rect.LMCMAN, rect.BOARD, rect.MIDDLE{fill: none;}	  
            </style>
            <defs>
                <marker id="arrow" viewBox="0 0 11 11" refY="5" refX="10"
                    markerUnits="strokeWidth" orient="auto"
                    markerWidth="10" markerHeight="10"> 
                    <polyline points="0,0 10,5 0,11" fill="darkblue" /> 
                </marker> 
                <xsl:copy-of select="e:node-set($radialGradient)/*"/>
                <radialGradient class="gradient" id="teaml" cx="50%" cy="5%" r="50%"
                    fx="50%" fy="50%">
                    <stop offset="0%"/>
                    <stop offset="100%"/>
                </radialGradient>
                <radialGradient class="gradient" id="middle" cx="50%" cy="5%" r="50%"
                    fx="50%" fy="50%">
                    <stop offset="0%"/>
                    <stop offset="100%"/>
                </radialGradient>
                <radialGradient class="gradient" id="lmcman" cx="50%" cy="5%" r="50%"
                    fx="50%" fy="50%">
                    <stop offset="0%"/>
                    <stop offset="100%"/>
                </radialGradient>
                <radialGradient class="gradient" id="board" cx="50%" cy="5%" r="50%"
                    fx="50%" fy="50%">
                    <stop offset="0%"/>
                    <stop offset="100%"/>
                </radialGradient>
            </defs>
            <xsl:apply-templates select="e:node-set($org-with-y-coo)/h:org" mode="svg"/>
        </svg>
    </xsl:template>
    
    <xsl:template match="h:org" mode="axis-children-data">
        <xsl:param name="coo"/>
        <xsl:param name="axis"/>
        <xsl:copy>
            <xsl:attribute name="{$axis}">
                <xsl:value-of select="$coo"/>
            </xsl:attribute>
            <xsl:attribute name="width">
                <xsl:value-of select="$boxWidth"/>
            </xsl:attribute>
            <xsl:copy-of select="@*"/>
            <xsl:copy-of select="h:name"/>
            <xsl:apply-templates select="h:person[1]" mode="axis-siblings">
                <xsl:with-param name="coo" select="$coo + $dx"/>
                <xsl:with-param name="dist" select="$dx"/>
                <xsl:with-param name="axis" select="$axis"/>
            </xsl:apply-templates>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="h:person" mode="axis-children-data">
        <xsl:param name="coo"/>
        <xsl:param name="axis"/>
        <xsl:copy>
            <xsl:attribute name="{$axis}">
                <xsl:value-of select="$coo"/>
            </xsl:attribute>
            <xsl:copy-of select="@*"/>
            <xsl:copy-of select="h:name | h:fce"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="h:org" mode="axis-siblings-data">
        <xsl:param name="coo" select="0"/>
        <xsl:param name="axis"/>
        <xsl:copy>
            <xsl:copy-of select="@*"/>
            <xsl:variable name="employees">
                <xsl:apply-templates select="h:person" mode="axis-children">
                    <xsl:with-param name="coo" select="$coo + count(h:name) * $lineHeight"/>
                    <xsl:with-param name="axis" select="$axis"/>
                    <xsl:with-param name="dist" select="20"/>
                </xsl:apply-templates>
            </xsl:variable>
            <xsl:attribute name="height">
                <xsl:choose>
                    <xsl:when test="e:node-set($employees)/h:person">
                        <xsl:variable name="h">
                            <xsl:for-each select="e:node-set($employees)//h:person">
                                <h:v><xsl:value-of select="number(@y) + number(@height)"/></h:v>
                            </xsl:for-each>
                        </xsl:variable>
                        <xsl:value-of select="m:max(e:node-set($h)/h:v) - $coo + $dy"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="$dy + ($lineHeight * count(h:name))"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>
            
            <xsl:variable name="maxPersonX">
                <xsl:variable name="h">
                    <xsl:for-each select="e:node-set($employees)//h:person">
                        <h:v><xsl:value-of select="number(@x) + number(@width)"/></h:v>
                    </xsl:for-each>
                </xsl:variable>
                <xsl:value-of select="m:max(e:node-set($h)/h:v)"/>
            </xsl:variable>        
            <xsl:attribute name="width">
                <xsl:choose>
                    <xsl:when test="e:node-set($employees)//h:person">
                        <xsl:value-of select="$maxPersonX - number(@x) + $dx"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="$boxWidth + (2 * $dx)"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>
            <xsl:attribute name="y">
                <xsl:value-of select="$coo"/>
            </xsl:attribute>
            <xsl:copy-of select="h:name"/>
            <xsl:copy-of select="e:node-set($employees)"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="h:person" mode="axis-siblings-data">
        <xsl:param name="coo"/>
        <xsl:param name="axis" select="'x'"/>
        <xsl:copy>
            <xsl:copy-of select="@*[(name() != 'org') and (name() != 'sup')]"/>
            <xsl:attribute name="width">
                <xsl:value-of select="$boxWidth"/>
            </xsl:attribute>
            <xsl:attribute name="height">
                <xsl:value-of select="count(*[(name() ='h:name') or (name() = 'h:fce')]) * $lineHeight + $dy"/>
            </xsl:attribute>
            <xsl:attribute name="{$axis}">
                <xsl:value-of select="$coo"/>
            </xsl:attribute>
            <xsl:copy-of select="*[(name() ='h:name') or (name() = 'h:fce')]"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="h:org | h:person" mode="svg">
        <xsl:param name="x"/>
        <xsl:param name="y"/>
        <xsl:param name="xr"/>
        <xsl:param name="yr"/>
        
        <xsl:variable name="xm" select="number(@x) + round(number(@width) div 2)"/>        
        <g>
            <xsl:attribute name="id">
                <xsl:value-of select="@id"/>
            </xsl:attribute>
            <xsl:if test="@has-child">
                <xsl:attribute name="onclick">
                    <xsl:text>refresh(evt,'</xsl:text>
                    <xsl:value-of select="@id"/>
                    <xsl:text>')</xsl:text>
                </xsl:attribute>
            </xsl:if>
            <xsl:if test="not(@has-child)">
                <xsl:attribute name="class">no-child</xsl:attribute>
                <xsl:attribute name="onclick">
                    <xsl:text>do_nothing(evt)</xsl:text>
                </xsl:attribute>
            </xsl:if>
            <rect x="{@x}" y="{number(@y) + $dy}" width="{@width}" height="{@height}" rx="5">
                <xsl:attribute name="class">
                    <xsl:choose>
                        <xsl:when test="@cat = 'EMPLOYEE'">pl2</xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="concat(substring(local-name(),1,1),'l',count(ancestor-or-self::*[name()=name(current())]),' ',@cat)"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:attribute>
            </rect> 
            <text y="{number(@y) + $lineHeight}" x="{$xm}" class="label">
                <xsl:apply-templates select="h:name | h:fce" mode="svg"/>
            </text>
            <xsl:apply-templates select="h:org | h:person" mode="svg">
                <xsl:with-param name="x" select="$xm"/>
                <xsl:with-param name="y" select="number(@y) + $dy + number(@height)"/>
                <xsl:with-param name="xr" select="number(@x) + number(@width)"/>
                <xsl:with-param name="yr" select="number(@y) + $dy + round(number(@height) div 2)"/>
            </xsl:apply-templates> 
            <xsl:if test="name(..) = name()">
                <xsl:apply-templates select="." mode="svgLine">
                    <xsl:with-param name="x" select="$x"/>
                    <xsl:with-param name="y" select="$y"/>
                    <xsl:with-param name="xr" select="$xr"/>
                    <xsl:with-param name="yr" select="$yr"/>
                </xsl:apply-templates>
            </xsl:if>
            <xsl:if test="@has-child">
                <circle cx="{number(@x) + number(@width)}" cy="{number(@y) + $dy + round(number(@height) div 2)}" r="10"/>
                <text x="{number(@x) + number(@width)}" y="{number(@y) + $dy + round(number(@height) div 2) + 4}">
                    <xsl:choose>
                        <xsl:when test="@hidden">+</xsl:when>
                        <xsl:otherwise>- </xsl:otherwise>
                    </xsl:choose>
                </text>
                <circle class="hover" cx="{number(@x) + number(@width)}" cy="{number(@y) + $dy + round(number(@height) div 2)}" r="10"/>
            </xsl:if>       
        </g>
    </xsl:template>
    
    <xsl:template match="h:org" mode="svgLine">
        <xsl:param name="x"/>
        <xsl:param name="y"/>
        <xsl:param name="xr"/>
        <xsl:param name="yr"/>
        <xsl:variable name="ym" select="number(@y) + $dy + round(number(@height) div 2)"/>
        <xsl:variable name="yrm">
            <xsl:choose>
                <xsl:when test="$yr &gt; (number(@y) + number(@height))">
                    <xsl:value-of select="$ym"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="$yr"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <polyline marker-end="url(#arrow)">
            <xsl:attribute name="points">
                <xsl:choose>
                    <xsl:when test="count(preceding-sibling::h:org) = 0">
                        <xsl:value-of select="concat($xr,',',$yrm,' ',@x,',',$yrm)"/>
                    </xsl:when>
                    <xsl:when test="$y &gt; $ym">
                        <xsl:value-of select="concat($xr,',',$ym,' ',@x,',',$ym)"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="concat($x,',',$y,' ',$x,',',$ym,' ',@x,',',$ym)"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>
        </polyline>
    </xsl:template>
    
    <xsl:template match="h:person" mode="svgLine">
        <xsl:param name="x"/>
        <xsl:param name="y"/>
        
        <xsl:variable name="ym" select="round(((number(@y) + $dy) - number($y)) div 2) + number($y)"/>
        <xsl:variable name="xm" select="number(@x) + round(number(@width) div 2)"/>
        <polyline points="{$x},{$y} {$x},{$ym} {$xm},{$ym} {$xm},{number(@y) + $dy}" marker-end="url(#arrow)"/>
    </xsl:template>
    
    <xsl:template match="h:name[. != ''] | h:fce" mode="svg">
        <tspan>
            <xsl:if test="position() &gt; 1">
                <xsl:attribute name="x">
                    <xsl:value-of select="number(../@x) + round(number(../@width) div 2)"/>
                </xsl:attribute>
                <xsl:attribute name="dy">
                    <xsl:value-of select="$lineHeight"/>
                </xsl:attribute>
            </xsl:if>
            <xsl:if test="name() = 'h:fce'">
                <xsl:attribute name="class">fce</xsl:attribute>
            </xsl:if>
            <xsl:value-of select="."/>
        </tspan>
    </xsl:template>
    
    <xsl:template name="radialGradient">
        <xsl:param name="level"/>
        <xsl:param name="count" select="$level"/>
        <xsl:param name="name" select="'o'"/>
        <xsl:variable name="c1">
            <xsl:choose>
                <xsl:when test="$name = 'o'">127</xsl:when>
                <xsl:otherwise>255</xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="c2">
            <xsl:choose>
                <xsl:when test="$name = 'o'">255</xsl:when>
                <xsl:otherwise>127</xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="n" select="concat(substring($name,1,1),'l',$level)"/>
        <radialGradient class="gradient" id="{$n}" cx="50%" cy="5%" r="50%"
            fx="50%" fy="50%">
            <stop offset="0%"/>
            <stop offset="100%"/>
        </radialGradient>
        <xsl:value-of select="concat('.',$n,'{fill: url(#',$n,')}&#10;&#9;&#9;')"/>
        <xsl:if test="$level &gt; 0">
            <xsl:call-template name="radialGradient">
                <xsl:with-param name="level" select="number($level) - 1"/>
                <xsl:with-param name="count" select="$count"/>
                <xsl:with-param name="name" select="$name"/>
            </xsl:call-template>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="*" mode="axis-children">
        <xsl:param name="coo" select="0"/>
        <xsl:param name="dist" select="$coo"/>
        <xsl:param name="spacing" select="0"/>
        <xsl:param name="axis" select="'x'"/>
        
        <xsl:variable name="n" select="name()"/>
        <xsl:variable name="size-name">
            <xsl:choose>
                <xsl:when test="$axis = 'x'">width</xsl:when>
                <xsl:otherwise>height</xsl:otherwise>
            </xsl:choose> 
        </xsl:variable>
        <xsl:variable name="this-data">
            <xsl:apply-templates select="." mode="axis-children-data">
                <xsl:with-param name="coo" select="$coo"/>
                <xsl:with-param name="axis" select="$axis"/>
            </xsl:apply-templates>
        </xsl:variable>
        <xsl:variable name="maxCoo">
            <xsl:choose>
                <xsl:when test="e:node-set($this-data)/*//*/@*[name() = $axis]">
                    <xsl:variable name="h">
                        <xsl:for-each select="e:node-set($this-data)/*//*[@*[name() = $axis]]">
                            <h:v><xsl:value-of select="number(@*[name() = $axis])"/></h:v>
                        </xsl:for-each>
                    </xsl:variable>
                    <xsl:value-of select="m:max(e:node-set($h)/h:v)"/>
                </xsl:when>
                <xsl:otherwise><xsl:value-of select="-1"/></xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="maxSize">
            <xsl:choose>
                <xsl:when test="$maxCoo &gt; -1">
                    <xsl:variable name="h">
                        <xsl:for-each select="e:node-set($this-data)/*//*[@*[name() = $axis] = $maxCoo]">
                            <h:v><xsl:value-of select="number(@*[name() = $size-name])"/></h:v>
                        </xsl:for-each>
                    </xsl:variable>
                    <xsl:value-of select="m:max(e:node-set($h)/h:v)"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:variable name="h">
                        <xsl:choose>
                            <xsl:when test="e:node-set($this-data)/*/@*[name() = $size-name]">
                                <xsl:variable name="h">
                                    <xsl:for-each select="e:node-set($this-data)/*">
                                        <h:v><xsl:value-of select="number(@*[name() = $size-name])"/></h:v>
                                    </xsl:for-each>
                                </xsl:variable>
                                <xsl:value-of select="m:max(e:node-set($h)/h:v)"/>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:value-of select="$spacing"/>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:variable>
                    <xsl:value-of select="$coo + 1 +$h"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="this-size" select="$maxCoo - $coo + $maxSize"/>
        <xsl:variable name="this" select="."/>
        <xsl:for-each select="e:node-set($this-data)/*">
            <xsl:copy>
                <xsl:copy-of select="@*"/>
                <xsl:copy-of select="*"/>
                <xsl:comment><xsl:value-of select="concat('maxCoo: ',$maxCoo,' maxSize: ',$maxSize,' thisSize: ',$this-size)"/></xsl:comment>
                <xsl:apply-templates select="$this/*[name() = $n]" mode="axis-children">
                    <xsl:with-param name="coo">
                        <xsl:choose>
                            <xsl:when test="@id = '*'">
                                <xsl:value-of select="$coo"/>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:value-of select="$coo + $spacing + number($this-size) + $dist"/>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:with-param>
                    <xsl:with-param name="dist" select="$dist"/>
                    <xsl:with-param name="axis" select="$axis"/>
                    <xsl:with-param name="spacing" select="$spacing"/>
                </xsl:apply-templates>
            </xsl:copy>
        </xsl:for-each>
    </xsl:template>
    
    <xsl:template match="*" mode="axis-siblings">
        <xsl:param name="coo" select="0"/>
        <xsl:param name="dist" select="$coo"/>
        <xsl:param name="axis" select="'x'"/>
        <xsl:param name="spacing" select="0"/>
        <xsl:apply-templates select="." mode="r-axis-siblings">
            <xsl:with-param name="coo" select="$coo"/>
            <xsl:with-param name="dist" select="$dist"/>
            <xsl:with-param name="axis" select="$axis"/>
            <xsl:with-param name="spacing" select="$spacing"/>
        </xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="*[name() = name(following-sibling::*[1])]" mode="axis-siblings">
        <xsl:param name="coo" select="0"/>
        <xsl:param name="dist" select="$coo"/>
        <xsl:param name="axis" select="'x'"/>
        <xsl:param name="spacing" select="0"/>
        <xsl:variable name="list">
            <xsl:copy>
                <xsl:attribute name="id">*</xsl:attribute>
                <xsl:copy-of select=". | following-sibling::*[name() = name(current())]"/>
            </xsl:copy>
        </xsl:variable>
        <xsl:variable name="l">
            <xsl:apply-templates select="e:node-set($list)/*" mode="r-axis-siblings">
                <xsl:with-param name="coo" select="$coo"/>
                <xsl:with-param name="dist" select="$dist"/>
                <xsl:with-param name="axis" select="$axis"/>
                <xsl:with-param name="spacing" select="$spacing"/>
            </xsl:apply-templates>
        </xsl:variable>
        <xsl:copy-of select="e:node-set($l)/*/*"/>
    </xsl:template>
    
    <xsl:template match="*[name() = name(preceding-sibling::*[1])]" mode="axis-siblings"/>
    
    <xsl:template match="*" mode="r-axis-siblings">
        <xsl:param name="data" select="false()"/>
        <xsl:param name="coo" select="0"/>
        <xsl:param name="dist" select="$coo"/>
        <xsl:param name="axis" select="'x'"/>
        <xsl:param name="incCoo" select="false()"/>
        <xsl:param name="spacing"/>
        
        <xsl:variable name="n" select="name()"/>
        <xsl:variable name="size-name">
            <xsl:choose>
                <xsl:when test="$axis = 'x'">width</xsl:when>
                <xsl:otherwise>height</xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="now-coo">
            <xsl:choose>
                <xsl:when test="$incCoo">
                    <xsl:variable name="h">
                        <xsl:for-each select="e:node-set($data)//*[name()=$n][@id = $incCoo]/ancestor-or-self::*[name()=$n]
                            [not(@id = current()/ancestor::*[name()=$n]/@id)][@*[local-name() = $axis] = $coo]">
                            <h:v>
                                <xsl:value-of select="number(@*[name()=$size-name])"/>
                            </h:v>
                        </xsl:for-each>
                    </xsl:variable>
                    <xsl:value-of select="m:max(e:node-set($h)/h:v) + $coo + $dist + $spacing"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="$coo"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="this-data">
            <xsl:apply-templates select="." mode="axis-siblings-data">
                <xsl:with-param name="coo" select="$now-coo"/>
                <xsl:with-param name="axis" select="$axis"/>
            </xsl:apply-templates>
        </xsl:variable>
        <xsl:variable name="now-data">
            <xsl:variable name="into" select="../@id"/>
            <xsl:choose>
                <xsl:when test="$data">
                    <xsl:apply-templates select="e:node-set($data)/*[name()=$n]" mode="append">
                        <xsl:with-param name="into" select="$into"/>
                        <xsl:with-param name="data" select="$this-data"/>
                    </xsl:apply-templates>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:copy-of select="$this-data"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:choose>
            <xsl:when test="*[name()=$n]">
                <xsl:apply-templates select="*[name()=$n][1]" mode="r-axis-siblings">
                    <xsl:with-param name="data" select="$now-data"/>
                    <xsl:with-param name="coo" select="$now-coo"/>
                    <xsl:with-param name="axis" select="$axis"/>
                    <xsl:with-param name="dist" select="$dist"/>
                    <xsl:with-param name="spacing" select="$spacing"/>
                </xsl:apply-templates>
            </xsl:when>
            <xsl:when test="ancestor-or-self::*[name()=$n]/following-sibling::*[name()=$n]">
                <xsl:apply-templates  mode="r-axis-siblings" 
                    select="(ancestor-or-self::*[name()=$n]/following-sibling::*[name()=$n])[1]"
                    >
                    <xsl:with-param name="data" select="$now-data"/>
                    <xsl:with-param name="incCoo" select="@id"/>
                    <xsl:with-param name="coo" select="$now-coo"/>
                    <xsl:with-param name="axis" select="$axis"/>
                    <xsl:with-param name="dist" select="$dist"/>
                    <xsl:with-param name="spacing" select="$spacing"/>
                </xsl:apply-templates>
            </xsl:when>
            <xsl:otherwise>
                <xsl:copy-of select="$now-data"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="*" mode="append">
        <xsl:param name="into"/>
        <xsl:param name="data"/>
        <xsl:copy>
            <xsl:copy-of select="@*"/> 
            <xsl:apply-templates mode="append">
                <xsl:with-param name="into" select="$into"/>
                <xsl:with-param name="data" select="$data"/>
            </xsl:apply-templates>
            <xsl:if test="@id = $into">
                <xsl:copy-of select="$data"/>
            </xsl:if>
        </xsl:copy>            
    </xsl:template>
    
</xsl:stylesheet>
