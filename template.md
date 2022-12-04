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

<h1>Recipe Markdown Template</h1>
<div style="margin-left: 1em; margin-bottom: 3px; padding-bottom: 6px; border-bottom: 1px solid grey">
    <p>
    </p>
    <label>Recipe Name:</label>
    <input id="wizard.name" style="width: 100%; margin-bottom: 2em;">
    <label>Categories:</label>
    <ol id="wizard.categories">
        <li><input style="width:100%;"></li>
    </ol>
    <div style="text-align: right">
        <button onclick="wizard.categories.add()">+</button>
        <button onclick="wizard.categories.remove()">-</button>
    </div>
    <details style="margin-left: 1em; margin-right: 1em; margin-bottom: 2em;">
        <summary>Add Existing?</summary>
        <div>
        {% for cat in categories %}
        <button onclick="wizard.categories.addExisting('{{cat}}')">{{cat}}</button>
        {% endfor %}
        </div>
    </details>
    <label>Ingredients</label>
    <ol id="wizard.ingredients" start=0 type=1>
        <li style="list-style-type: none;">
            <div style="width: 32%; display: inline-block;">Name</div>
            <div style="width: 32%; display: inline-block;">Amount</div>
            <div style="width: 32%; display: inline-block;">Notes</div>
        </li>
    </ol>
    <div style="text-align: right">
        <button onclick="wizard.ingredients.add()">+</button>
        <button onclick="wizard.ingredients.remove()">-</button>
    </div>
    <details style="margin-left: 1em; margin-right: 1em; margin-bottom: 2em;">
        <summary>Add Existing?</summary>
        <div>
        {% for i in ingredients %}
        <button onclick="wizard.ingredients.addExisting('{{i}}', '', '')">{{i}}</button>
        {% endfor %}
        </div>
    </details>
    <label>Instructions</label>
    <textarea id="wizard.instructions" style="resize: vertical; width:100%; min-height: 12em;">
## Instructions
1. 
2.
3.</textarea>
    <div style="text-align: center; padding: 12px; width: 100%;">
        <button style="background-color: #7c334f; color: #ece4d8; border: 1px solid #c7556c; border-radius: 16px; font-size: large; padding: 8px 12px;" onclick="wizard.downloadMd();">Download Recipe</button>
    </div>
</div>

<details>
    <summary>Recipe Template</summary>
    <div>
        <p>
            The following is a <a href="https://www.markdownguide.org/basic-syntax/" target="_blank">markdown</a> template to creating recipes compatible with this site. Simply copy this and save it as a plain text file. 
        </p>
        <textarea  id="result" style="resize: vertical; width:100%; min-height: 32em;"></textarea >
        <div style="text-align: center; padding: 12px; width: 100%;">
            <button style="background-color: #7c334f; color: #ece4d8; border: 1px solid #c7556c; border-radius: 16px; font-size: large; padding: 8px 12px;" onclick="wizard.updateMd();">Update Template from Recipe</button>
        </div>
    </div>
</details>

<script>
    var wizard = {
        getMd: function() {
            var cats = this.categories.get();
            var catstring = "";
            for (var i = 0; i < cats.length; i++) {
                catstring += "- " + cats[i] + "\n";
            }
            var is = this.ingredients.get();
            var istring = "";
            for (var i = 0; i < is.length; i++) {
                istring += "  " + is[i] + "\n";
            }
return `---
title: ${this.getName()}
categories:
${catstring}
ingredients:
${istring}
---
${this.getInstructions()}`;
        },
        updateMd: function() {
            var md = this.getMd();

            document.getElementById("result").value = md;
        },
        downloadMd: function() {
            var filename = this.getName() + ".md";
            var text = this.getMd();

            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element)
        },
        getName: function() {
            return document.getElementById("wizard.name").value;
        },
        getInstructions: function() {
            return document.getElementById("wizard.instructions").value;
        },
        categories: {
            add: function() {
                var cats = document.getElementById("wizard.categories");
                var li = document.createElement("li");
                li.innerHTML = "<input style=\"width:100%;\">";
                cats.appendChild(li);
                return li;
            },
            remove: function() {
                var select = document.getElementById("wizard.categories");
                select.removeChild(select.lastChild);
            },
            addExisting: function(name) {
                var cats = document.getElementById("wizard.categories");
                var li = document.createElement("li");
                li.innerHTML = "<input style=\"width:100%;\" value=" + name + ">";
                cats.appendChild(li);
                return li;
            },
            get: function() {
                var cats = document.getElementById("wizard.categories");
                var listOfCats = cats.querySelectorAll("input");
                var finalList = [];
                if (listOfCats) {
                    for (var i = 0; i < listOfCats.length; i++) {
                        var c = listOfCats[i].value;
                        if (c == null || c == "") {
                            continue;
                        } 
                        finalList.push(c);
                    }
                }
                return finalList;
            }
        },
        ingredients: {
            add: function(){
                var cats = document.getElementById("wizard.ingredients");
                var li = document.createElement("li");
                li.innerHTML = 
`<div style="width: 32%; display: inline-block;"><input style=\"width:100%;\"></div>
<div style="width: 32%; display: inline-block;"><input style=\"width:100%;\"></div>
<div style="width: 32%; display: inline-block;"><input style=\"width:100%;\"></div>`;
                cats.appendChild(li);
                return li;
            },
            remove: function() {
                var select = document.getElementById("wizard.ingredients");
                if (select.childElementCount > 1) {
                    select.removeChild(select.lastChild);
                }
            },
            addExisting: function(name, amount, note){
                var cats = document.getElementById("wizard.ingredients");
                var li = document.createElement("li");
                li.innerHTML = 
`<div style="width: 32%; display: inline-block;"><input style=\"width:100%;\" value=\"${name}\"></div>
<div style="width: 32%; display: inline-block;"><input style=\"width:100%;\" value=\"${amount}\"></div>
<div style="width: 32%; display: inline-block;"><input style=\"width:100%;\" value=\"${note}\"></div>`;
                cats.appendChild(li);
                return li;
            },
            get: function() {
                var cats = document.getElementById("wizard.ingredients");
                var listOfCats = cats.querySelectorAll("li");
                var finalList = [];
                if (listOfCats) {
                    for (var i = 1; i < listOfCats.length; i++) {
                        var row = listOfCats[i];
                        var inputs = row.querySelectorAll("input");
                        
                        if (inputs == null || inputs.length < 1)
                            continue;

                        var name = inputs[0].value;
                        if (name == null || name == "") {
                            continue;
                        } 
                        var amt = "";
                        var inst = "";
                        if (inputs.length >= 2) {
                            amt = inputs[1].value;
                        }
                        if (inputs.length >= 3) {
                            inst = inputs[2].value;
                        }
                         
                        if (inst != null && inst.length > 0) {
                            finalList.push(`${name}: ${amt}, ${inst}`);
                        } else {
                            finalList.push(`${name}: ${amt}`);
                        }
                    }
                }
                return finalList;
            }
        }
    };
    window.wizard = wizard;
</script>