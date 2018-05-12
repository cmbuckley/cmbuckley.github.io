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
                <div class="content"><div class="container">
                <xsl:apply-templates></xsl:apply-templates>
                </div></div>
                {% include footer.html %}
                {% include scripts.html %}
            </body>
        </html>
    </xsl:template>

    <xsl:template match="sitemap:urlset">
        <h1 class="pageTitle">XML Sitemap</h1>
        <ul>
            <xsl:for-each select="./sitemap:url">
                <xsl:variable name="itemURL">
                    <xsl:value-of select="sitemap:loc"/>
                </xsl:variable>
                <li>
                    <a href="{$itemURL}">
                        <xsl:value-of select="sitemap:loc"/>
                    </a>
                </li>
            </xsl:for-each>
        </ul>
    </xsl:template>
</xsl:stylesheet>
