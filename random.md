---
title: Random Recipe
layout: page
---
<p>Behold... your randomly picked recipe. Use the "Get Another" button to pick another recipe randomly.</p>
<h2 style="text-align: center; border-bottom: none;"><a id="link" href=""></a></h2>

<div style="text-align: center; padding: 12px; width: 100%;">
    <button style="background-color: #7c334f; color: #ece4d8; border: 1px solid #c7556c; border-radius: 16px; font-size: large; padding: 8px 12px;" onclick="getRandom();">Get Another</button>
</div>

<script>
var store = [
    {% for recipe in site.recipes %}{
        "title"    : {{ recipe.title | jsonify }},
        "url"      : {{ recipe.url | prepend: site.baseurl | jsonify }}
    } {% unless forloop.last %},{% endunless %}{% endfor %}
];
function getRandom() {
    var item = store[Math.floor(Math.random() * store.length)];
    
    var link = document.getElementById("link");
    if (link) {
        link.innerText = item.title;
        link.href = item.url;
    }
}
getRandom();
</script>