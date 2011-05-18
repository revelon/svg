<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:h="http://lmc.eu/ns/helper"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="1.0"
>

    <xsl:template match="*">
        <xsl:copy>
            <xsl:copy-of select="@*"/>
            <xsl:if test="h:org | h:person"><xsl:attribute name="has-child"/></xsl:if>
            <xsl:apply-templates/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="*[@hidden]">
        <xsl:copy>
            <xsl:copy-of select="@*"/>
            <xsl:if test="h:org | h:person"><xsl:attribute name="has-child"/></xsl:if>
            <xsl:copy-of select="h:name | h:fce"/>
        </xsl:copy>
    </xsl:template>
   
</xsl:stylesheet>
