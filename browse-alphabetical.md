---
title: 'Browse Alphabetically'
layout: page
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
To browse by category click <a href="{{site.baseurl}}/browse-category">here</a>.
</aside>

{% if categories %}
{% for category in categories %}
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