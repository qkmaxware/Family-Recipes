---
title: 'Browse Alphabetically'
layout: page_with_sidebar
---
{% assign categories = '' | split: ',' %}
{% for recipe in site.recipes %}
{% assign recipe_category = recipe.title | slice: 0 %}
{% assign categories = categories | push: recipe_category %}
{% endfor %}
{% if categories %}
{% assign categories = categories | uniq %}
{% endif %}

<aside>
{% include browse_tabs.html tab="alpha" %}
</aside>

{% if categories %}
{% for category in categories %}
<a id="category-{{ category }}">
<h1>{{ category | capitalize }}</h1>
<ul>
    {% for recipe in site.recipes %}
    {% assign recipe_category = recipe.title | slice: 0 %}
    {% if category == recipe_category %}
    <li><a href="{{ recipe.url | prepend: site.baseurl }}">{{ recipe.title }}</a></li>
    {% endif %}
    {% endfor %}
</ul>
{% endfor %}
{% endif %}