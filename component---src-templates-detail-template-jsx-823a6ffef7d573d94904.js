"use strict";(self.webpackChunkdale_blog=self.webpackChunkdale_blog||[]).push([[367],{588:function(e,a,t){t.r(a),t.d(a,{default:function(){return P}});var r=t(7294),n=t(2866),o=t(9),i=function(e){var a=e.title;e.date,e.timeToRead;return r.createElement(l,null,r.createElement(c,null,a))},l=o.ZP.header.withConfig({displayName:"Header__Wrapper",componentId:"sc-efn3ve-0"})(["padding:64px 32px;text-align:center;"]),c=o.ZP.h1.withConfig({displayName:"Header__Title",componentId:"sc-efn3ve-1"})(["overflow-wrap:break-word;"]);function p(e){var a=e.html;return r.createElement(s,{dangerouslySetInnerHTML:{__html:a}})}var s=o.ZP.div.withConfig({displayName:"Content__Wrapper",componentId:"sc-m3dg7x-0"})(['h2{color:var(--color-secondary);margin-top:var(--spacing-12);margin-bottom:var(--spacing-4);}p{font-size:var(--font-size-p);margin-top:var(--spacing-4);margin-bottom:var(--spacing-4);}a{text-decoration:none;transition:box-shadow 400ms ease 0s;box-shadow:0px 0px 0px var(--color-primary);color:var(--color-primary);font-weight:var(--font-weight-regular);&:hover{transition:box-shadow 100ms ease 0s;box-shadow:0px 2px 0px var(--color-primary);}}ul{list-style-type:disc;}blockquote{background-color:var(--color-background);border-left:5px solid var(--color-primary);border-radius:0 var(--spacing-2) var(--spacing-2) 0;margin:var(--spacing-8) 0px;padding:var(--spacing-6) var(--spacing-4);color:var(--color-headline);font-style:italic;}blockquote p{margin:0;}code:not([class*="language-"]){font-family:var(--font-family-mono);font-size:0.9em;letter-spacing:-0.5px;padding:4.5px 6px;margin:1px 0px;background:var(--color-background);color:var(--color-text);border-radius:3px;}.gatsby-code-title{margin-bottom:-0.5rem;padding:0.5em 1em;font-family:var(--font-family-mono);background-color:#2d2d2d;color:white;border-radius:var(--spacing-2) var(--spacing-2) 0 0;display:inline-block;}.gatsby-highlight{font-size:var(--font-size-3-5);border-radius:var(--spacing-2);overflow:auto;margin-bottom:var(--spacing-8);}.gatsby-highlight > pre{margin:0;}.gatsby-highlight-code-line{background-color:#4d4d4d;display:block;margin-right:-1em;margin-left:-1em;padding-right:1em;padding-left:0.75em;border-left:0.25em solid var(--color-primary);}']),d=t(3995),g=t(1763),m=t(153),f=t(5444);function u(e){var a=e.tag;return r.createElement(v,{to:"/?tag="+a.to},a.name)}var v=(0,o.ZP)(f.Link).withConfig({displayName:"Tag__Wrapper",componentId:"sc-188fkyp-0"})(["padding:var(--spacing-1) var(--spacing-2);border-radius:var(--spacing-1);background:var(--color-background);color:var(--color-text);opacity:0.7;font-size:var(--font-size-3);transition:opacity 500ms ease 0s;text-decoration:none;&:hover,&:focus{opacity:1;transition:opacity 0ms ease 0s;}"]),h=/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;function y(e){var a=e.tags,t=new Set(a.filter((function(e){return!h.test(e)})).reduce((function(e,a){var t=[{name:a,to:a}];return a in m&&t.push({name:m[a],to:a}),[].concat((0,g.Z)(e),t)}),[]));return r.createElement(b,null,(0,g.Z)(t).map((function(e){return r.createElement(u,{key:e.name,tag:e})})))}var b=o.ZP.div.withConfig({displayName:"Tags__Wrapper",componentId:"sc-149pufk-0"})(["display:flex;gap:var(--spacing-1);flex-wrap:wrap;"]);function x(e){var a=e.date,t=e.tags;return r.createElement(w,null,r.createElement(k,null,r.createElement(d.Z,{name:"clock"}),r.createElement(_,null,a)),r.createElement("section",null,r.createElement(y,{tags:t})))}var w=o.ZP.footer.withConfig({displayName:"Footer__Wrapper",componentId:"sc-gre9f8-0"})(["padding:var(--spacing-8) 0;display:flex;gap:var(--spacing-4);justify-content:space-between;flex-wrap:wrap;"]),k=o.ZP.section.withConfig({displayName:"Footer__Meta",componentId:"sc-gre9f8-1"})(["color:var(--color-text);opacity:0.7;display:flex;gap:var(--spacing-2);align-items:center;line-height:0;"]),_=o.ZP.span.withConfig({displayName:"Footer__Date",componentId:"sc-gre9f8-2"})(["font-size:var(--font-size-4);"]);var E=o.ZP.main.withConfig({displayName:"PostDetail__Wrapper",componentId:"sc-1bau2bk-0"})(["max-width:1100px;margin:var(--spacing-8) auto;display:flex;gap:var(--spacing-8);justify-content:space-evenly;"]),C=o.ZP.article.withConfig({displayName:"PostDetail__Article",componentId:"sc-1bau2bk-1"})(["min-width:300px;max-width:700px;"]),Z=function(e){var a=e.node,t=a.html,n=a.timeToRead,o=a.frontmatter,l=a.fields,c=o.title,s=o.date,d=(l.slug,l.tags);return r.createElement(E,null,r.createElement(C,null,r.createElement(i,{title:c,date:s,timeToRead:n}),r.createElement(p,{html:t}),r.createElement(x,{date:s,tags:d})))};function P(e){var a=e.pageContext.node,t=a.frontmatter.title;return r.createElement(n.Z,{title:t,isDetail:!0},r.createElement(Z,{node:a}))}}}]);
//# sourceMappingURL=component---src-templates-detail-template-jsx-823a6ffef7d573d94904.js.map