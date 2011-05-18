<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet  version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:c="http://www.w3.org/ns/xproc-step"
    xmlns:h="http://lmc.eu/ns/helper"
    xmlns:e="http://exslt.org/common"
    xmlns:s="http://exslt.org/strings"
    xmlns:r="http://exslt.org/regular-expressions"
    extension-element-prefixes="s e r"
>
    <xsl:output indent="yes"/>
    
    
    <xsl:variable name="xPeople">
        <xsl:for-each select="s:tokenize(/c:data/c:p,'&#10;')[normalize-space()!=''][position() &gt; 1]">
            <xsl:variable name="fixedRecord" select="r:replace(.,';','g','-;')"/>
            <xsl:variable name="person" select="s:tokenize($fixedRecord,';')"/>
            <xsl:variable name="org">
                <xsl:call-template name="noQuot">
                    <xsl:with-param name="text" select="$person[10]"/>
                </xsl:call-template>
            </xsl:variable>
            <xsl:variable name="firstName">
                <xsl:call-template name="noQuot">
                    <xsl:with-param name="text" select="$person[3]"/>
                </xsl:call-template>
            </xsl:variable>
            <xsl:variable name="surname">
                <xsl:call-template name="noQuot">
                    <xsl:with-param name="text" select="$person[4]"/>
                </xsl:call-template>
            </xsl:variable>
            <xsl:variable name="cat">
                <xsl:call-template name="noQuot">
                    <xsl:with-param name="text" select="$person[7]"/>
                </xsl:call-template>
            </xsl:variable>
            <xsl:variable name="fce">
                <xsl:call-template name="noQuot">
                    <xsl:with-param name="text" select="$person[9]"/>
                </xsl:call-template>
            </xsl:variable>
            <xsl:variable name="wrapFce">
                <xsl:call-template name="wrap-string">
                    <xsl:with-param name="str" select="$fce"/>
                    <xsl:with-param name="wrap-col" select="20"/>
                </xsl:call-template>
            </xsl:variable>
            <h:person
                org="{translate($org,' ','')}"
                sup="p{substring-before($person[14],'-')}"
                id="p{substring-before(normalize-space($person[1]),'-')}"
                cat="{$cat}"                
            > 
                <h:name><xsl:value-of select="concat($firstName,' ',$surname)"/></h:name>
                <xsl:for-each select="s:tokenize($wrapFce,'~:~')">
                    <h:fce><xsl:value-of select="."/></h:fce>
                </xsl:for-each>
            </h:person>
        </xsl:for-each>
    </xsl:variable>
    
    <xsl:template match="/">
        <xsl:apply-templates select="c:data/c:o"/>
    </xsl:template>
    
    <xsl:template match="c:o">
        <!--xsl:copy-of select="e:node-set($xPeople)"/-->
        <xsl:variable name="treeOrg">
            <xsl:variable name="org">
                <xsl:for-each select="s:tokenize(.,'&#10;')">
                    <xsl:variable name="o" select="s:tokenize(.,';')"/>
                    <xsl:variable name="sup">
                        <xsl:call-template name="noQuot">
                            <xsl:with-param name="text" select="$o[3]"/>
                        </xsl:call-template>
                    </xsl:variable>
                    <xsl:variable name="id">
                        <xsl:call-template name="noQuot">
                            <xsl:with-param name="text" select="$o[1]"/>
                        </xsl:call-template>
                    </xsl:variable>
                    <xsl:variable name="name">
                        <xsl:call-template name="noQuot">
                            <xsl:with-param name="text" select="$o[2]"/>
                        </xsl:call-template>
                    </xsl:variable>
                    <xsl:variable name="wrapName">
                        <xsl:call-template name="wrap-string">
                            <xsl:with-param name="str" select="translate($name,'/',' ')"/>
                            <xsl:with-param name="wrap-col" select="18"/>
                        </xsl:call-template>
                    </xsl:variable>
                    <h:org
                        sup="{translate($sup,' ','')}"
                        id="{translate($id,' ','')}"
                    >
                        <xsl:for-each select="s:tokenize($wrapName,'~:~')">
                            <h:name><xsl:value-of select="."/></h:name>
                        </xsl:for-each>   
                    </h:org>
                </xsl:for-each>
            </xsl:variable>
            <xsl:apply-templates select="e:node-set($org)/h:org[@sup='*']" mode="doTree"/>
        </xsl:variable>
        
        <xsl:apply-templates select="e:node-set($treeOrg)/h:org" mode="appendPeople"/>
        
    </xsl:template>
    
    <xsl:template match="h:org" mode="appendPeople">
        <xsl:variable name="orgPeople">
            <xsl:copy-of select="e:node-set($xPeople)/h:person[@org = current()/@id]"/>
        </xsl:variable>
        <xsl:copy>
            <xsl:copy-of select="@*"/>
            <xsl:copy-of select="h:name"/>
            <xsl:apply-templates select="e:node-set($orgPeople)/h:person[not(@sup = e:node-set($orgPeople)/h:person/@id)]" mode="doTree"/>
            <xsl:apply-templates select="h:org" mode="appendPeople"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="*" mode="doTree">
        <xsl:copy>
            <xsl:copy-of select="@*"/>
            <xsl:copy-of select="*"/>
            <xsl:apply-templates select="../*[@sup = current()/@id]" mode="doTree"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template name="noQuot">
        <xsl:param name="text"/>
        <xsl:variable name="quot">"</xsl:variable>
        <xsl:value-of select="substring-before(substring-after($text,$quot),$quot)"/>
    </xsl:template>
    
    <xsl:template name="wrap-string" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
        <xsl:param name="str" />
        <xsl:param name="wrap-col" />
        <xsl:param name="break-mark" select="'~:~'"/>
        <xsl:param name="pos" select="0" />
        <xsl:choose>
            
            <xsl:when test="contains( $str, ' ' )">
                <xsl:variable name="first-word" select="substring-before( $str, ' ' )" />
                <xsl:variable name="pos-now" select="$pos + 1 + string-length( $first-word )" />
                <xsl:choose>
                    
                    <xsl:when test="$pos > 0 and $pos-now >= $wrap-col">
                        <xsl:copy-of select="$break-mark" />
                        <xsl:call-template name="wrap-string">
                            <xsl:with-param name="str" select="$str" />
                            <xsl:with-param name="wrap-col" select="$wrap-col" />
                            <xsl:with-param name="break-mark" select="$break-mark" />
                            <xsl:with-param name="pos" select="0" />
                        </xsl:call-template>
                    </xsl:when>
                    
                    <xsl:otherwise>
                        <xsl:value-of select="$first-word" />
                        <xsl:text> </xsl:text>
                        <xsl:call-template name="wrap-string">
                            <xsl:with-param name="str" select="substring-after( $str, ' ' )" />
                            <xsl:with-param name="wrap-col" select="$wrap-col" />
                            <xsl:with-param name="break-mark" select="$break-mark" />
                            <xsl:with-param name="pos" select="$pos-now" />
                        </xsl:call-template>
                    </xsl:otherwise>
                    
                </xsl:choose>
            </xsl:when>
            
            <xsl:otherwise>
                <xsl:if test="$pos + string-length( $str ) >= $wrap-col">
                    <xsl:copy-of select="$break-mark" />
                </xsl:if>
                <xsl:value-of select="$str" />
            </xsl:otherwise>
            
        </xsl:choose>
    </xsl:template>
  
</xsl:stylesheet>
