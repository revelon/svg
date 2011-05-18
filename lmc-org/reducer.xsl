<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:h="http://lmc.eu/ns/helper"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="1.0"
    >
    
    <xsl:template match="*">
        <xsl:copy>
            <xsl:copy-of select="@*"/>
            <xsl:apply-templates/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="h:org[count(ancestor::h:org) &gt; 1]">
        <xsl:copy>
            <xsl:copy-of select="@*"/>
            <xsl:attribute name="hidden"/>
            <xsl:if test="h:org"><xsl:attribute name="has-child"/></xsl:if>
            <xsl:apply-templates/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="h:person">
        <xsl:copy>
            <xsl:copy-of select="@*"/>
            <xsl:if test="h:person"><xsl:attribute name="has-child"/></xsl:if>
            <xsl:apply-templates/>
        </xsl:copy>
    </xsl:template>
    
</xsl:stylesheet>
