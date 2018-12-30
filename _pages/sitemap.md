---
layout: compress
permalink: /sitemap.xml

---

<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1">

    {% for post in site.posts reversed %}
        {% if post.sitemap == false %}
            {% continue %}
        {% endif %}

        <url>
            <loc>{{ site.url }}{{ post.url }}</loc>
            <priority>{{ post.sitemap-priority }}</priority>
            <changefreq>weekly</changefreq>

            {% if post.lastmod == null %}
                <lastmod>{{ post.date | date_to_xmlschema }}</lastmod>
            {% else %}
                <lastmod>{{ post.lastmod | date_to_xmlschema }}</lastmod>
            {% endif %}

            {% for gallery in post.sitemap-galleries %}
                {% for item in site.data.gallery[gallery] %}

                    <image:image>

                        <image:loc>{{ site.url }}/images/gallery/{{ gallery }}/{{ item.name }}</image:loc>

                        {% if item.alt != null %}
                            <image:title>{{ item.alt }}</image:title>
                        {% endif %}

                        <image:caption>{{ item.title }}</image:caption>
                    </image:image>

                {% endfor %}
            {% endfor %}
        </url>
    {% endfor %}

    {% for page in site.pages %}
        {% if page.sitemap == false or page.sitemap == null %}
            {% continue %}
        {% endif %}

        <url>

            <loc>{{ site.url }}{{ page.url }}</loc>
            <priority>{{ page.sitemap-priority }}</priority>
            <changefreq>{{ page.sitemap-changefreq }}</changefreq>

            {% if page.lastmod != null %}
                <lastmod>{{ page.lastmod | date_to_xmlschema }}</lastmod>
            {% endif %}

        </url>
     {% endfor %}
</urlset>
