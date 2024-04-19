---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
---

<div class="posts">
  {%- for post in site.posts -%}
      <div class="post">
        <h3 class="post-title">
          <a class="post-link" href="{{ post.url | relative_url }}">
            {{ post.title | escape }}
          </a>
        </h3>
        {%- assign date_format = site.date_format | default: "%b %-d, %Y" -%}
        <p class="post-meta">
          <time class="post-date" datetime="{{ post.date | date_to_xmlschema }}">
            {{ post.date | date: date_format }}
          </time>
          {%- if post.author -%} - <span class="post-author">{{ post.author }}</span>{%- endif -%}
        </p>
        {%- if site.show_excerpts -%}
          {{ post.excerpt }}
        {%- endif -%}
      </div>
  {%- endfor -%}
</div>