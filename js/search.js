---
---
const search = {};
search.store = [
    {% for recipe in site.recipes %}{
        "title"    : {{ recipe.title | jsonify }},
        "categories" : {{ recipe.categories | jsonify }},
        "ingredients" : {{ recipe.ingredients | jsonify }},
        "url"      : {{ recipe.url | prepend: site.baseurl | jsonify }}
    } {% unless forloop.last %},{% endunless %}{% endfor %}
];

search.arrayContainsAnotherArray = function(source, requiredValues){
    if (source === null || requiredValues === null)
        return true;

    for(var i = 0; i < requiredValues.length; i++){
        if (!source.includes(requiredValues[i])) {
            return false;
        }
    }
    return true;
}

search.basic = function(keywords, categories, ingredients) {
    var results = [];
    if (keywords) {
        for(var i = 0; i < keywords.length; i++) {
            keywords[i] = keywords[i].toLowerCase();
        }
    }
    search.store.forEach(item => {
        if (!item)
            return;
        var lower = item.title.toLowerCase();  
        var matches_title = keywords.length == 0 || keywords.some((keyword) => lower.indexOf(keyword) >= 0);
        var in_category = item.categories.some(r => categories.includes(r));
        var recipe_ingredients = (!item.ingredients ? [] : Object.keys(item.ingredients));
        var uses_all_ingredients = search.arrayContainsAnotherArray(recipe_ingredients, ingredients.desired);
        var have_all_ingredients = search.arrayContainsAnotherArray(ingredients.owned, recipe_ingredients);
        if (matches_title && in_category && uses_all_ingredients && have_all_ingredients) {
            results.push(item);
        }
    });
    return results;
}

search.fillContainer = function(items, resultsContainer) {
    var results = document.getElementById(resultsContainer);
    results.innerHTML = '';
    for (var i = 0 ; i < items.length; i++) {
        var link = document.createElement('a');
        link.href = items[i].url;
        link.target = "_blank";

        var container = document.createElement("div");
        container.classList.add('w3-third');
        container.classList.add('w3-container');
        container.classList.add('w3-margin-bottom');
        link.appendChild(container);

        // var image = document.createElement("img");

        var description = document.createElement("div");
        description.classList.add('w3-container');
        description.classList.add('w3-white');
        description.classList.add('w3-center');
        container.appendChild(description);

        var title = document.createElement('b');
        title.innerText = items[i].title;
        description.appendChild(title);

        results.appendChild(link);
    }
}

search.form = function(searchForm, resultsContainer) {
    var form = $("#" + searchForm).serializeArray();
    var data = {};
    $.map(form, function(n, i){
        data[n['name']] = n['value'];
    });
    var keywords = data["title"] || "";
    var query = {
        keywords: keywords.split(/[ ,]+/),
        categories: Object.keys(data).filter(key => key.startsWith("category")).map(key => data[key]),
        ingredients: {
            desired: Object.keys(data).filter(key => key.startsWith("ingredient")).map(key => data[key]),
            owned: Object.keys(data).filter(key => key.startsWith("owned")).map(key => data[key])
        }
    };

    search.last = {};
    search.last.query = query;
    search.last.results = search.basic(query.keywords, query.categories, query.ingredients);

    search.fillContainer(search.last.results, resultsContainer);
}