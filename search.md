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
    <p style="text-align: center;">
    Do you want to filter results to recipes with a particular name?
    </p>
    <input id="title" name="title" style="width: 100%;" placeholder="recipe name"/>
</div>

<h2>Categories</h2>
<div style="padding: 10px;">
    <p style="text-align: center;">
    In which categories would you like to search?
    </p>
    <table style="background-color: transparent; border-bottom: none !important;">
    {% for category in categories %}
        {% assign group = forloop.index0 | modulo: 3 %}
        {% if group == 0 %}
        <tr>
        {% endif %}
        <td>
            <input type="checkbox" id="category.{{category}}" name="category.{{category}}" value="{{category}}" checked>
            <label for="category.{{category}}">{{ category | capitalize }}</label>
        </td>
        {% if group == 2 or forloop.last %}
        </tr>
        {% endif %}
    {% endfor %}
    </table>
</div>

<datalist id="ingredients">
    {% for ingredient in ingredients %}
        <option>{{ ingredient | capitalize }}</option>
    {% endfor %}
</datalist>

<h2>Ingredients</h2>
<div style="padding: 10px;">
    <p style="text-align: center;">
    Which ingredients do you want to use? Recipes in the results will contain <b>all</b> the ingredients selected.
    </p>
    <div>
        <table style="background-color: transparent; border-bottom: none !important;">
            <tr>
                <td>
                    <input placeholder="search" list="ingredients" id="include-ingredient-selection">
                </td>
                <td style="width: 2em">
                    <button type="button" onclick="addIngredientToIncludes()">+</button>
                </td>
            </tr>
        </table>
    </div>
    <ul class="and" id="include-ingredient-list">
    </ul>
    <p style="text-align: center;">
    What ingredients do you not own? Any recipes containing the ingredients below will be excluded from the results.
    </p>
    <div>
        <table style="background-color: transparent; border-bottom: none !important;">
            <tr>
                <td>
                    <input placeholder="search" list="ingredients" id="exclude-ingredient-selection">
                </td>
                <td style="width: 2em">
                    <button type="button" onclick="addIngredientToExcluded()">+</button>
                </td>
            </tr>
        </table>
    </div>
    <ul class="or" id="exclude-ingredient-list">
    </ul>
</div>

</form>

<div style="text-align: center; padding: 12px; position: fixed; left: 0; bottom: 0; width: 100%;">
    <button style="background-color: #7c334f; color: #ece4d8; border: 1px solid #c7556c; border-radius: 16px; font-size: large; padding: 8px 12px;" onclick="search();">Search for Recipes</button>
</div>

<a  id="searchResultAnchor" href="#results"></a>
<h1>Results</h1>
<ul id="searchResults">
</ul>

<script>
var aliases = [{% for pair in site.data.aliases %}
    { "ingredient": {{pair.ingredient}}, "alias": {{pair.alias}} }{% unless forloop.last %},{% endunless %}
{% endfor %}];
var store = [
    {% for recipe in site.recipes %}{
        "title"    : {{ recipe.title | jsonify }},
        "categories" : {{ recipe.categories | jsonify }},
        "ingredients" : {{ recipe.ingredients | jsonify }},
        "url"      : {{ recipe.url | prepend: site.baseurl | jsonify }}
    } {% unless forloop.last %},{% endunless %}{% endfor %}
];

function addIngredientToIncludes () {
    var results = document.getElementById("include-ingredient-list");
    var input = document.getElementById("include-ingredient-selection").value;
    if (input === null || input === "") {
        return;
    }
    input = input.toLowerCase();

    var li = document.createElement("li");

    var data = document.createElement("input");
    data.classList.add("small");
    data.value = input
    data.readOnly = true;
    data.name = "ingredient." + input;
    data.style.width = "calc(100% - 8em)";
    li.appendChild(data);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("small");
    btn.innerText = "x";
    btn.onclick = function() {
        li.remove();
    };
    li.appendChild(btn);
    results.appendChild(li);
}

function addIngredientToExcluded() {
    var results = document.getElementById("exclude-ingredient-list");
    var input = document.getElementById("exclude-ingredient-selection").value;
    if (input === null || input === "") {
        return;
    }
    input = input.toLowerCase();

    var li = document.createElement("li");

    var data = document.createElement("input");
    data.classList.add("small");
    data.value = input
    data.readOnly = true;
    data.name = "notowned." + input;
    data.style.width = "calc(100% - 12em)";
    li.appendChild(data);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("small");
    btn.innerText = "x";
    btn.onclick = function() {
        li.remove();
    };
    li.appendChild(btn);
    results.appendChild(li);
}

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
            notowned: Object.keys(data).filter(key => key.startsWith("notowned")).map(key => data[key])
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
    var anchor = document.getElementById('searchResultAnchor');
    if (anchor && anchor.scrollIntoView) {
        anchor.scrollIntoView({ behavior: 'smooth' });
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

function arrayDoesntContainAny(source, list_to_exclude) {
    for (var i = 0; i < list_to_exclude.length; i++) {
        if (source.includes(list_to_exclude[i])) {
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
        var doesnt_have_any_excludes = arrayDoesntContainAny(recipe_ingredients, ingredients.notowned);
        //var have_all_ingredients = arrayContainsAnotherArray(ingredients.owned, recipe_ingredients);
        if (matches_title && in_category && uses_all_ingredients && doesnt_have_any_excludes) {
            results.push(item);
        }
    });
    return results;
}
</script>