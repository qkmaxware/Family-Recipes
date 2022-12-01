---
title: Recipe Search
layout: page
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
{% assign categories = categories | uniq | sort %}
{% endif %}

{% assign ingredients = "" | split: ',' %}
{% for recipe in site.recipes %}
    {% if recipe.ingredients %}
    {% for ingredient in recipe.ingredients %}
        {% assign ingredients = ingredients | push: ingredient[0] %}
    {% endfor %}
    {% endif %}
{% endfor %}
{% if ingredients %}
{% assign ingredients = ingredients | uniq | sort %}
{% endif %}

<h1>Search</h1>
<form id="searchForm">

<h2>Name</h2>
<div style="padding: 10px;">
    <input id="title" name="title" style="width: 100%;" placeholder="recipe name"/>
</div>

<h2>Categories</h2>
<div style="padding: 10px;">
    <p style="text-align: center;">
    In which categories would you like to search?
    </p>
    {% for category in categories%}
    <input type="checkbox" id="category.{{category}}" name="category.{{category}}" value="{{category}}" checked>
    <label for="category.{{category}}">{{ category | capitalize }}</label>
    {% endfor %}
</div>

<h2>Ingredients</h2>
<div style="padding: 10px;">
    <p style="text-align: center;">
    Which ingredients do you want to use?
    </p>
    {% for ingredient in ingredients%}
    <input type="checkbox" id="ingredient.{{ingredient}}" name="ingredient.{{ingredient}}" value="{{ingredient}}">
    <label for="ingredient.{{ingredient}}">{{ ingredient | capitalize }}</label>
    {% endfor %}
    <p style="text-align: center;">
    Which ingredients do you have available for use?
    </p>
    {% for ingredient in ingredients%}
    <input type="checkbox" id="owned.{{ingredient}}" name="owned.{{ingredient}}" value="{{ingredient}}" checked>
    <label for="owned.{{ingredient}}">{{ ingredient | capitalize }}</label>
    {% endfor %}
</div>

</form>

<div style="text-align: center; padding: 12px;">
    <button onclick="search();">Search</button>
</div>

<h1>Results</h1>
<ul id="searchResults">
</ul>

<script>
var store = [
    {% for recipe in site.recipes %}{
        "title"    : {{ recipe.title | jsonify }},
        "categories" : {{ recipe.categories | jsonify }},
        "ingredients" : {{ recipe.ingredients | jsonify }},
        "url"      : {{ recipe.url | prepend: site.baseurl | jsonify }}
    } {% unless forloop.last %},{% endunless %}{% endfor %}
];

function search() {
    var form = $("#searchForm").serializeArray();
    var data = {};
    $.map(form, function(n, i){
        data[n['name']] = n['value'];
    });
    var search = {
        title: data["title"],
        categories: Object.keys(data).filter(key => key.startsWith("category")).map(key => data[key]),
        ingredients: {
            desired: Object.keys(data).filter(key => key.startsWith("ingredient")).map(key => data[key]),
            owned: Object.keys(data).filter(key => key.startsWith("owned")).map(key => data[key])
        }
        
    };
    window.lastSearch = search;
    search.results = query(search.title, search.categories, search.ingredients);

    var results = document.getElementById('searchResults');
    results.innerHTML = '';
    for (var i = 0 ; i < search.results.length; i++) {
        var link = document.createElement('a');
        link.href = search.results[i].url;
        link.innerText = search.results[i].title;
        var container = document.createElement('li');
        container.appendChild(link);
        results.appendChild(container);
    }
}

function arrayContainsAnotherArray(source, requiredValues){
    if (source === null || requiredValues === null)
        return true;

    for(var i = 0; i < requiredValues.length; i++){
        if (!source.includes(requiredValues[i])) {
            return false;
        }
    }
    return true;
}

function query(title, categories, ingredients) {
    var results = [];
    var lower_title = title.toLowerCase();
    store.forEach(item => {
        if (!item)
            return;
            
        var matches_title = item.title.toLowerCase().includes(lower_title);
        var in_category = item.categories.some(r => categories.includes(r));
        var recipe_ingredients = (!item.ingredients ? [] : Object.keys(item.ingredients));
        var uses_all_ingredients = arrayContainsAnotherArray(recipe_ingredients, ingredients.desired);
        var have_all_ingredients = arrayContainsAnotherArray(ingredients.owned, recipe_ingredients);
        if (matches_title && in_category && uses_all_ingredients && have_all_ingredients) {
            results.push(item);
        }
    });
    return results;
}
</script>