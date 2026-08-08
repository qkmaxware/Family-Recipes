---
title: 'Browse By Category'
layout: page_with_sidebar
---
{% assign categories = nil %}
{% for recipe in site.recipes %}
{% if categories %}
    {% assign categories = categories | concat: recipe.categories %}
{% else %}
    {% assign categories = recipe.categories %}
{% endif %}
{% endfor %}
{% if categories %}
{% assign categories = categories | uniq %}
{% endif %}

<aside>
{% include browse_tabs.html tab="category" %}
</aside>

{% if categories %}
{% for category in categories %}
<a id="category-{{ category }}">
<h1>{{ category | capitalize }}</h1>
<ul>
    {% for recipe in site.recipes %}
    {% if recipe.categories contains category %}
    <li><a href="{{ recipe.url | prepend: site.baseurl }}">{{ recipe.title }}</a></li>
    {% endif %}
    {% endfor %}
</ul>
{% endfor %}
{% endif %}