---
title: Recipe Template
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
    <label><strong>Recipe Name:</strong></label>
    <p>The recipe's name; this is used to uniquely identify this recipe from the rest.</p>
    <input id="wizard.name" style="width: 100%; margin-bottom: 2em;">
    <label><strong>Categories:</strong></label>
    <p>Categories are used to group similar recipes together. Soups, salads, or deserts are examples of such categories. A recipe may belong to many different categories. Use the Add Existing feature below to make sure you don't create accidental duplicate categories.</p>
    <ol id="wizard.categories">
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
    <label><strong>Ingredients</strong></label>
    <p>Ingredients are grouped into different categories. The default group is known as "Main Dish". If some ingredients are used for a sauce as opposed to the main dish you can use this group name to indicate that. Group names are case sensitive. Additionally, notes can be used to provide additional details for each ingredient. The Add Existing feature below should be used to avoid creating duplicate ingredients (like green beans vs Green Beans).</p>
    <ol id="wizard.ingredients" start=0 type=1>
        <li style="list-style-type: none;">
            <div style="width: 24%; display: inline-block;">Group</div>
            <div style="width: 24%; display: inline-block;">Name</div>
            <div style="width: 24%; display: inline-block;">Amount</div>
            <div style="width: 24%; display: inline-block;">Notes</div>
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
    <label><strong>Related Recipes</strong></label>
    <p>Related recipes can be used to link this recipe to another. You can use this feature to indicate recipes that go well together or are required as a part of a larger recipe. You can link to another recipe on this site using the Link to Family Recipe feature or to a recipe on another site with the Add External Link feature.</p>
    <div id="wizard.links"></div>
    <details style="margin-left: 1em; margin-right: 1em; margin-bottom: 2em;">
        <summary>Link to Family Recipe</summary>
        <div>
        {% for recipe in site.recipes %}
        <button onclick="wizard.links.add('{{ recipe.title }}', '{{ recipe.url | prepend: site.baseurl}}')">{{ recipe.title }}</button>
        {% endfor %}
        </div>
    </details>
    <details style="margin-left: 1em; margin-right: 1em; margin-bottom: 2em;">
        <summary>Add External Link</summary>
        <div>
        <p>Type the URL of the recipe here and press the ADD button.</p>
        <input id="wizard.links.externalUrl" placeholder="https://www.example.recipe.com">
        <div style="text-align: right"><button onclick="wizard.links.addExtern()">Add</button></div>
        </div>
    </details>
    <label><strong>Instructions</strong></label>
    <p>The instructions for making this recipe. Add steps by typing numbers followed by a dot. You may add a new section by typing, on it's own line, two pound signs followed by the section name. For example a section titled "Sauce" would be typed as "## Sauce". Note the space between the pound signs and the section title. </p>
    <p>All of <a target="_blank" href="https://www.markdownguide.org/basic-syntax/">Markdown</a> is supported.</p>
    <textarea id="wizard.instructions" style="resize: vertical; width:100%; min-height: 12em;">
## Instructions
1. 
2.
3.</textarea>
    <div style="text-align: right">
        <input style="width: calc(100% - 10em); display: inline;" id="wizard.instructions.sectionTitle" placeholder="Section title">
        <button style="width: 7em; display: inline;" onclick="wizard.instructions.addSection()">+ Section</button>
    </div>
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
            const ingredient_groups = is.reduce((groups, item) => {
                var group = (groups[item.group] || []);
                group.push(item);
                groups[item.group] = group;
                return groups;
            }, {});
            var istring = "";
            for (const group in ingredient_groups) {
                var items = ingredient_groups[group];
                console.log(items);
                for (var j = 0; j < items.length; j++) {
                    var item = items[j];
                    istring += "  " + item.name + ": \n";
                    istring += "    amount: " + item.amount + "\n";
                    istring += "    notes: " + item.notes + "\n";
                    istring += "    group: " + item.group + "\n";
                }
            }
            var links = this.links.get();
            var linkstring = "";
            for (var i = 0; i < links.length; i++) {
                linkstring += "  " + links[i].name + ": " + links[i].url + "\n";
            }
return `---
title: ${this.getName()}
categories:
${catstring}
links:
${linkstring}
ingredients:
${istring}
---
${this.instructions.get()}`;
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
        instructions:{
            get : function() {
                return document.getElementById("wizard.instructions").value;
            },
            addSection: function() {
                var doc = document.getElementById("wizard.instructions");
                var name = document.getElementById("wizard.instructions.sectionTitle").value;
                var prev = doc.value;
                var next = prev + "\n\n" + "## " + name + "\n1.\n2.\n3.";
                doc.value = next;
            }
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
                var div0 = document.createElement("div");
                var groupInput = document.createElement("input");
                groupInput.value = "Main Dish"
                groupInput.style.width = "100%";
                div0.style.width = "24%";
                div0.style.display = "inline-block";
                div0.appendChild(groupInput);
                li.appendChild(div0);
                var div1 = document.createElement("div");
                div1.style.width = "24%";
                div1.style.display = "inline-block";
                div1.innerHTML = "<input style=\"width:100%;\">";
                li.appendChild(div1);
                var div2 = document.createElement("div");
                div2.style.width = "24%";
                div2.style.display = "inline-block";
                div2.innerHTML = "<input style=\"width:100%;\">";
                li.appendChild(div2);
                var div3 = document.createElement("div");
                div3.style.width = "24%";
                div3.style.display = "inline-block";
                var lastInput = document.createElement("input");
                lastInput.style.width = "100%";
                lastInput.onkeydown = function(evt) {
                    if (evt.key === "Tab") {
                        wizard.ingredients.add();
                    }
                };
                div3.appendChild(lastInput);
                li.appendChild(div3);
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
`<div style="width: 24%; display: inline-block;"><input style=\"width:100%;\" value=\"Main Dish\"></div>
<div style="width: 24%; display: inline-block;"><input style=\"width:100%;\" value=\"${name}\"></div>
<div style="width: 24%; display: inline-block;"><input style=\"width:100%;\" value=\"${amount}\"></div>
<div style="width: 24%; display: inline-block;"><input style=\"width:100%;\" value=\"${note}\"></div>`;
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

                        var group = inputs[0].value;

                        var name = inputs[1].value;
                        if (name == null || name == "") {
                            continue;
                        } 
                        var amt = "";
                        var inst = "";
                        if (inputs.length >= 3) {
                            amt = inputs[2].value;
                        }
                        if (inputs.length >= 4) {
                            inst = inputs[3].value;
                        }
                        
                        finalList.push({
                            name: name,
                            amount: amt,
                            notes: inst,
                            group: group
                        });
                    }
                }
                return finalList;
            }
        },
        links: {
            get: function() {
                var result = [];
                var links = document.getElementById("wizard.links");
                var children = links.childNodes;
                for(var j = 0; j < children.length; j++){
                    var a = children[j].getElementsByTagName("a");
                    for (var i = 0; i < a.length; i++) {
                        result.push(
                            {
                                name: a[i].innerText,
                                url: a[i].href
                            }
                        );
                    }
                }
                return result;
            },
            add: function(name, url) {
                var links = document.getElementById("wizard.links");
                var span = document.createElement("span");
                span.style.padding = "8px 12px";
                var del = document.createElement("button");
                del.innerText = "x";
                del.style.padding = "0";
                span.appendChild(del);
                del.onclick = () => wizard.links.remove(span);
                var a = document.createElement("a");
                a.innerText = name;
                a.href = url;
                span.appendChild(a);
                links.appendChild(span);
            },
            addExtern: function() {
                var url = document.getElementById("wizard.links.externalUrl").value.trim();
                if (url != "") {
                    wizard.links.add(url, url);
                }
            },
            remove: function(el) {
                el.remove();
            }
        }
    };
    window.wizard = wizard;
</script>