---
layout:    default
title:     Site map
permalink: /posts/

redirect_from:
    - /sitemap/

sitemap-priority: 0.5

inline-css: [taglist.css]

---


<div class="category-list">
    <h1>Categories</h1>

    {% capture site_cats %}{% for category in site.categories %}{{ category | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}
    {% capture num_words %}{{ site_cats | split:',' | size }}{% endcapture %}
    {% assign cat_words = site_cats | split:',' | sort %}

    {% for item in (0..num_words) %}
        {% unless forloop.last %}
            {% capture this_word %}{{ cat_words[item] | strip_newlines }}{% endcapture %}
            <h3 id="{{ this_word | replace: ' ', '-' | escape }}">&raquo; <a href="/posts/{{ this_word }}">{{ this_word | capitalize}}</a></h3>
            <ul>
                {% for post in site.categories[this_word] %}
                    {% if post.title != null %}
                        <li itemscope><a href="{{ post.url }}">{{ post.title }}</a></li>
                    {% endif %}
                {% endfor %}
            </ul>
        {% endunless %}
    {% endfor %}


    <h2>Tags</h2>
    {% capture site_tags %}{% for tag in site.tags %}{{ tag | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}
    {% capture num_words %}{{ site_tags | split:',' | size }}{% endcapture %}
    {% assign tag_words = site_tags | split:',' | sort %}

    <ul class="tag-list">
        {% for item in (0..num_words) %}
            {% unless forloop.last %}
                {% capture this_word %}{{ tag_words[item] | strip_newlines }}{% endcapture %}
                <li><a href="/tag/{{ this_word | replace: ' ', '-' | escape }}/">#{{ this_word | replace: '-', ' ' }} <span>{{ site.tags[this_word].size }}</span></a></li>
            {% endunless %}
        {% endfor %}
    </ul>

    <a href="/tag/">Search posts by tags...</a>
</div>
