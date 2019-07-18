---
layout: null
---
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xsl:stylesheet [ <!ENTITY copy "&#169;"> ]>
<xsl:stylesheet version="1.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <title>XML Sitemap</title>
                <link rel="stylesheet" href="/assets/css/style.css" />
            </head>
            <body>
                {% include header.html %}
                <div class="content sitemap"><div class="container">
                <xsl:apply-templates></xsl:apply-templates>
                </div></div>
                {% include footer.html %}
                {% include scripts.html %}
            </body>
        </html>
    </xsl:template>

    <xsl:template match="sitemap:urlset">
        <h1 class="page__title">XML Sitemap</h1>
        <ul>
            <xsl:for-each select="./sitemap:url">
                <xsl:variable name="itemUrl">
                    <xsl:value-of select="sitemap:loc"/>
                </xsl:variable>
                <li>
                    <a href="{$itemUrl}">
                        <xsl:value-of select="sitemap:loc"/>
                    </a>
                    <xsl:if test="sitemap:lastmod">
                        <xsl:variable name="lastModified">
                            <xsl:value-of select="sitemap:lastmod"/>
                        </xsl:variable>
                        <span class="last-modified"> (<time datetime="{$lastModified}" title="{$lastModified}">
                            <xsl:call-template name="format-date">
                                <xsl:with-param name="datetime" select="$lastModified" />
                            </xsl:call-template>
                        </time>)</span>
                    </xsl:if>
                </li>
            </xsl:for-each>
        </ul>
    </xsl:template>
    <xsl:template name="format-date">
        <xsl:param name="datetime" />
        <xsl:if test="not(substring($datetime, 9, 1) = '0')">
            <xsl:value-of select="substring($datetime, 9, 1)" />
        </xsl:if>
        <xsl:value-of select="substring($datetime, 10, 1)" />
        <xsl:text> </xsl:text>
        <xsl:choose>
            <xsl:when test="substring($datetime, 6, 2) = '01'"><xsl:text>Jan</xsl:text></xsl:when>
            <xsl:when test="substring($datetime, 6, 2) = '02'"><xsl:text>Feb</xsl:text></xsl:when>
            <xsl:when test="substring($datetime, 6, 2) = '03'"><xsl:text>Mar</xsl:text></xsl:when>
            <xsl:when test="substring($datetime, 6, 2) = '04'"><xsl:text>Apr</xsl:text></xsl:when>
            <xsl:when test="substring($datetime, 6, 2) = '05'"><xsl:text>May</xsl:text></xsl:when>
            <xsl:when test="substring($datetime, 6, 2) = '06'"><xsl:text>Jun</xsl:text></xsl:when>
            <xsl:when test="substring($datetime, 6, 2) = '07'"><xsl:text>Jul</xsl:text></xsl:when>
            <xsl:when test="substring($datetime, 6, 2) = '08'"><xsl:text>Aug</xsl:text></xsl:when>
            <xsl:when test="substring($datetime, 6, 2) = '09'"><xsl:text>Sep</xsl:text></xsl:when>
            <xsl:when test="substring($datetime, 6, 2) = '10'"><xsl:text>Oct</xsl:text></xsl:when>
            <xsl:when test="substring($datetime, 6, 2) = '11'"><xsl:text>Nov</xsl:text></xsl:when>
            <xsl:when test="substring($datetime, 6, 2) = '12'"><xsl:text>Dec</xsl:text></xsl:when>
        </xsl:choose>
        <xsl:text> </xsl:text>
        <xsl:value-of select="substring($datetime, 1, 4)" />
    </xsl:template>
</xsl:stylesheet>
