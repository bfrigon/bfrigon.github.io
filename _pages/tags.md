---
layout:    default
title:     Tags
permalink: /tag/

sitemap-priority: 0.3

inline-css: [taglist.css]

---


{% capture site_tags %}{% for tag in site.tags %}{{ tag | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}
{% capture num_words %}{{ site_tags | split:',' | size }}{% endcapture %}
{% assign tag_words = site_tags | split:',' | sort %}


<div class="category-list">
    <h1>Tags</h1>


    <ul class="tag-list">
        {% for item in (0..num_words) %}
            {% unless forloop.last %}
                {% capture this_word %}{{ tag_words[item] | strip_newlines }}{% endcapture %}
                <li><a href="/tag/{{ this_word | replace: ' ', '-' }}/">#{{ this_word | replace: '-', ' '}} <span>{{ site.tags[this_word].size }}</span></a></li>
            {% endunless %}
        {% endfor %}
    </ul>

    {% for item in (0..num_words) %}
        {% unless forloop.last %}
            {% capture this_word %}{{ tag_words[item] | strip_newlines }}{% endcapture %}
            <h3 id="{{ this_word | replace: ' ', '-' }}">&raquo; <a href="/tag/{{ this_word }}">{{ this_word | capitalize}}</a></h3>
            <ul>
                {% for post in site.tags[this_word] %}
                    {% if post.title != null %}
                        <li itemscope><a href="{{ post.url }}">{{ post.title }}</a></li>
                    {% endif %}
                {% endfor %}
            </ul>
        {% endunless %}
    {% endfor %}

    <a href="/posts/">Search posts by categories...</a>
</div>
