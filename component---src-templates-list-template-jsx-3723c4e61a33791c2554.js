(self.webpackChunkdale_blog=self.webpackChunkdale_blog||[]).push([[956],{5259:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return b}});var n=a(7294),r=a(1419),i=a.n(r),o=a(5942),l=a(9);var s=l.ZP.div.withConfig({displayName:"Header__Wrapper",componentId:"sc-5qomfk-0"})(["display:flex;gap:var(--spacing-1);"]),c=l.ZP.h1.withConfig({displayName:"Header__Title",componentId:"sc-5qomfk-1"})(["font-size:var(--font-size-h2);"]),p=l.ZP.span.withConfig({displayName:"Header__Count",componentId:"sc-5qomfk-2"})([""]),d=function(e){var t=e.title,a=e.totalPosts;return n.createElement(s,null,n.createElement(c,null,t),n.createElement(p,null,a," posts"))},m=a(5444);function g(e){var t=e.item,a=t.excerpt,r=(t.timeToRead,t.fields),i=r.slug,o=(r.tags,t.frontmatter.title);return n.createElement(u,null,n.createElement(f,null,n.createElement(m.Link,{to:i},o)),n.createElement(v,null,a))}var u=l.ZP.article.withConfig({displayName:"ContentCard__Wrapper",componentId:"sc-1e9lo7v-0"})(["background:var(--color-background-secondary);border-radius:var(--spacing-4);padding:var(--spacing-8);display:flex;gap:var(--spacing-4);flex-direction:column;justify-content:space-between;"]),f=l.ZP.h3.withConfig({displayName:"ContentCard__Title",componentId:"sc-1e9lo7v-1"})(["font-size:var(--font-size-h4);"]),v=l.ZP.p.withConfig({displayName:"ContentCard__Excerpt",componentId:"sc-1e9lo7v-2"})(["font-size:var(--font-size-4);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden;"]);var y=l.ZP.div.withConfig({displayName:"ContentGrid__Wrapper",componentId:"sc-1ynqlvh-0"})(["display:grid;gap:32px;grid-template-columns:1fr;@media (min-width:34.375rem){grid-template-columns:repeat(auto-fill,minmax(400px,1fr));}"]),h=function(e){var t=e.posts;return n.createElement(y,null,t.map((function(e){return n.createElement(g,{key:e.fields.slug,item:e})})))};var P=l.ZP.nav.withConfig({displayName:"Pagination__Wrapper",componentId:"sc-5tm1wb-0"})(["display:flex;flex-wrap:wrap;gap:var(--spacing-1);justify-content:center;"]),w=(0,l.ZP)(m.Link).withConfig({displayName:"Pagination__Item",componentId:"sc-5tm1wb-1"})(["display:grid;place-items:center;color:var(--color-text);font-size:var(--font-size-4);width:40px;height:40px;border-radius:50%;background:",";opacity:0.7;&:hover{background:var(--color-primary);opacity:0.4;}"],(function(e){return e.active&&"var(--color-primary)"})),k=function(e){var t=e.totalPages,a=e.tag,r=e.page;return n.createElement(P,null,Array(t).fill().map((function(e,t){return n.createElement(w,{active:t+1===r,to:"?tag="+a+"&page="+(t+1)},t+1)})))};var _=l.ZP.main.withConfig({displayName:"PostList__Wrapper",componentId:"sc-1n09a9k-0"})(["margin:var(--spacing-8) auto;display:flex;flex-direction:column;gap:var(--spacing-8);"]),C=function(e){var t=e.tag,a=e.posts,r=e.totalPages,i=e.totalPosts,o=e.postsPerPage,l=e.page,s=e.skip;return n.createElement(_,null,n.createElement(d,{title:t,totalPosts:i}),n.createElement(h,{posts:a.slice(s,s+o)}),n.createElement(k,{totalPages:r,tag:t,page:l}))};function b(e){var t=e.data.allMarkdownRemark.nodes,a="undefined"==typeof document?"":document.location.search,r=i().parse(a,{ignoreQueryPrefix:!0}),l=r.tag,s=void 0===l?"":l,c=r.page,p=void 0===c?"1":c,d=t.filter((function(e){return!s||e.fields.tags.includes(s)})),m=d.length,g=Math.ceil(m/20),u=20*(parseInt(p)-1);return n.createElement(o.Z,null,n.createElement(C,{tag:s,posts:d,totalPages:g,totalPosts:m,postsPerPage:20,page:p,skip:u}))}}}]);
//# sourceMappingURL=component---src-templates-list-template-jsx-3723c4e61a33791c2554.js.map