---
title: "Configuration"
permalink: /docs/configuration/
excerpt: "Settings for configuring and customizing the theme."
modified: 2016-11-29T08:44:22-05:00
---

Settings that affect your entire site can be changed in [Jekyll's configuration file](https://jekyllrb.com/docs/configuration/): `_config.yml`, found in the root of your project. If you don't have this file you'll need to copy or create one using the theme's [default `_config.yml`](https://github.com/mmistakes/minimal-mistakes/blob/master/_config.yml) as a base.

**Note:** for technical reasons, `_config.yml` is NOT reloaded automatically when used with `jekyll serve`. If you make any changes to this file, please restart the server process for them to be applied.
{: .notice--warning}

Take a moment to look over the configuration file included with the theme. Comments have been added to provide examples and default values for most settings. Detailed explanations of each can be found below.

## Site Settings

### Theme

If you're using the Ruby gem version of the theme you'll need this line to activate it:

```yaml
theme: minimal-mistakes-jekyll
```

### Site Locale

`site.locale` is used to declare the primary language for each web page within the site.

*Example:* `locale: "en-US"` sets the `lang` attribute for the site to the *United States* flavor of English, while `en-GB` would be for the `United Kingdom` style of English. Country codes are optional and the shorter variation `locale: "en"` is also acceptable. To find your language and country codes check this [reference table](https://msdn.microsoft.com/en-us/library/ee825488(v=cs.20).aspx). 

Properly setting the locale is important for associating localized text found in the [**UI Text**]({{ "/docs/ui-text/" | absolute_url }}) data file. An improper match will cause parts of the UI to disappear (eg. button labels, section headings, etc).

**Note:** The theme comes with localized text in English (`en`, `en-US`, `en-GB`). If you change `locale` in `_config.yml` to something else, most of the UI text will go blank. Be sure to add the corresponding locale key and translated text to `_data/ui-text.yml` to avoid this.
{: .notice--warning}

### Site Title

The name of your site. Is used throughout the theme in places like the site masthead and `<title>` tags.

*Example:* `title: "My Awesome Site"`

You also have the option of customizing the separation character used in SEO-friendly page titles.

*Example:* `title_separator: "|"` would produce page titles like `Sample Page | My Awesome Site`.

**Note:** Long site titles have been known to break the masthead layout. Avoid adding a long "tagline" to the title prevent this from happening eg. `My Awesome Site is the Best Because I Say So".
{: .notice--warning}

### Site Name

Used to assign a site author. Don't worry, you can override the site author with different ones on specific posts, pages, or collection documents.

*Example:* `name: "Michael Rose"`.

**ProTip:** If you want to get crafty with your YAML you can use [anchors](http://www.yaml.org/spec/1.2/spec.html#id2785586) to reuse values. For example `foo: &var "My String"` allows you to reuse `"My String"` elsewhere in `_config.yml` like so... `bar: *var`. You'll see a few examples of this in the provided Jekyll config.
{: .notice--info}

### Site Description

Fairly obvious. `site.description` describes the site. Used predominantly in meta descriptions for improving SEO.

*Example:* `description: "A flexible Jekyll theme for your blog or site with a minimalist aesthetic."`

### Site URL

The base hostname and protocol for your site. If you're hosting with GitHub Pages this will be something like `url: "https://github.io.mmistakes"` or `url: "https://mademistakes.com"` if you have a custom domain name.

GitHub Pages now [forces `https://` for new sites](https://help.github.com/articles/securing-your-github-pages-site-with-https/) so be mindful of that when setting your URL to avoid mixed-content warnings.

**Note:** Jekyll 3.3 overrides this value with `url: http://localhost:4000` when running `jekyll serve` locally in development. If you want to avoid this behavior set `JEKYLL_ENV=production` to [force the environment](http://jekyllrb.com/docs/configuration/#specifying-a-jekyll-environment-at-build-time) to production.
{: .notice--warning}

### Site Base URL

This little option causes all kinds of confusion in the Jekyll community. If you're not hosting your site as a GitHub Pages Project or in a subfolder (eg: `/blog`), then don't mess with it.

In the case of the Minimal Mistakes demo site it's hosted on GitHub at <https://mmistakes.github.io/minimal-mistakes>. To correctly set this base path I'd use `url: "https://mmistakes.github.io"` and `baseurl: "/minimal-mistakes"`.

For more information on how to properly use `site.url` and `site.baseurl` as intended by the Jekyll maintainers, check [Parker Moore's post on the subject](https://byparker.com/blog/2014/clearing-up-confusion-around-baseurl/).

**Note:** When using `baseurl` remember to include it as part of your path when testing your site locally. Values of `url: ` and `baseurl: "/blog"` would make your local site visible at `http://localhost:4000/blog` and not `http://localhost:4000`.
{: .notice--warning}

### Site Repository

Add your repository name with organization to your site's configuration file, `_config.yml`.

```yaml
repository: "username/repo-name"
```

"NWO" stands for "name with owner." It is GitHub lingo for the username of the owner of the repository plus a forward slash plus the name of the repository, e.g. '**mmistakes/minimal-mistakes**', where '**mmistakes**' is the owner and '**minimal-mistakes**' is the repository name.

Your `site.github.*` fields should fill in like normal. If you run Jekyll with the --verbose flag, you should be able to see all the API calls made.

If you don't set `repository` correctly you may see the following error when trying to `serve` or `build` your Jekyll site:

**Liquid Exceptions:** No repo name found. Specify using `PAGES_REPO_NWO` environment variables, `repository` in your configuration, or set up `origin` git remote pointing to your github.com repository.
{: .notice--danger}

For more information on how `site.github` data can be used with Jekyll check out [`github-metadata`'s documentation](https://github.com/jekyll/github-metadata).

### Site Default Teaser Image

To assign a fallback teaser image used in the "**Related Posts**" module, place a graphic in the `/assets/images/` directory and add the filename to `_config.yml` like so:

```yaml
teaser: /assets/images/500x300.png
```

This image can be overridden at anytime by applying the following to a document's YAML Front Matter.

```yaml
header:
  teaser: /assets/images/my-awesome-post-teaser.jpg
```

<figure>
  <img src="{{ '/assets/images/mm-teaser-images-example.jpg' | absolute_url }}" alt="teaser image example">
  <figcaption>Example of teaser images found in the related posts module.</figcaption>
</figure>

### Breadcrumb Navigation (Beta)

Enable breadcrumb links to help visitors better navigate deep sites. Because of the fragile method of implementing them they don't always produce accurate links reliably. For best results:

1. Use a category based permalink structure e.g. `permalink: /:categories/:title/`
2. Manually create pages for each category or use a plugin like [jekyll-archives][jekyll-archives] to auto-generate them. If these pages don't exist breadcrumb links to them will be broken.

![breadcrumb navigation example]({{ "/assets/images/mm-breadcrumbs-example.jpg" | absolute_url }})

```yaml
breadcrumbs: true  # disabled by default
```

Breadcrumb start link text and separator character can both be changed in the [UI Text data file]({{ "/docs/ui-text/" | absolute_url }}).

### Reading Time

Enable estimated reading time snippets with `read_time: true` in YAML Front Matter. `200` has been set as the default words per minute value --- which can be changed by adjusting `words_per_minutes: ` in `_config.yml`.

![reading time example]({{ "/assets/images/mm-read-time-example.jpg" | absolute_url }})

Instead of adding `read_time: true` to each post, apply as a default in `_config.yml` like so:

```yaml
defaults:
  # _posts
  - scope:
      path: ""
      type: posts
    values:
      read_time: true
```

To disable reading time for a post, add `read_time: false` its YAML Front Matter to override what was set in `_config.yml`.

### Comments

[**Disqus**](https://disqus.com/), [**Discourse**](https://www.discourse.org/), [**Facebook**](https://developers.facebook.com/docs/plugins/comments), **Google+**, and static-based commenting via [**Staticman**](https://staticman.net/) are built into the theme. First set the comment provider you'd like to use: 

| Name            | Comment Provider  |
| ----            | ----------------  |
| **disqus**      | Disqus            |
| **discourse**   | Discourse         |
| **facebook**    | Facebook Comments |
| **google-plus** | Google+ Comments  |
| **staticman**   | Staticman         |
| **custom**      | Other             |

Then add `comments: true` to each document you want comments visible on.

Instead of adding YAML Front Matter to each document, apply as a default in `_config.yml`. To enable comments for all posts:

```yaml
defaults:
  # _posts
  - scope:
      path: ""
      type: posts
    values:
      comments: true
```

If you add `comments: false` to a post's YAML Front Matter it will override the default and disable comments for just that post.

##### Disqus

To use Disqus you'll need to create an account and [shortname](https://help.disqus.com/customer/portal/articles/466208-what-s-a-shortname-). Once you have both update `_config.yml` to:

```yaml
comments:
  provider: "disqus"
  disqus:
    shortname: "your-disqus-shortname"
```

##### Discourse

For guidance on how to set up Discourse for embedding comments from a topic on a post page, [consult this guide](https://meta.discourse.org/t/embedding-discourse-comments-via-javascript/31963).

```yaml
comments:
  provider               : "discourse"
  discourse:
    server               : # meta.discourse.org
```
  
##### Facebook Comments

To enable Facebook Comments choose how many comments you'd like visible per post and the color scheme of the widget.

```yaml
comments:
  provider               : "facebook"
  facebook:
    appid                : # optional
    num_posts            : # 5 (default)
    colorscheme          : # "light" (default), "dark"
```

##### Static-Based Comments via Staticman

Transform user comments into `_data` files that live inside of your GitHub repository by enabling Staticman.

###### Add Staticman as a Collaborator

1. Allow Staticman push access to your GitHub repository by clicking on **Settings**, then the **Collaborators** tab and adding `staticmanapp` as a collaborator.
2. To accept the pending invitation visit: `https://api.staticman.net/v1/connect/{your GitHub username}/{your repository name}`. Consult the Staticman "[Get Started](https://staticman.net/get-started)" guide for more info.

###### Configure Staticman

Default settings have been provided in `_config.yml`. The important ones to set are  `provider: "staticman"`, `branch`, and `path`. View the [full list of configurations](https://github.com/eduardoboucas/staticman#jekyll-configuration).

**Branch setting:** This is the branch comment files will be sent to via pull requests. If you host your site on GitHub Pages it will likely be `master` unless your repo is setup as a project --- use `gh-pages` in that case.
{: .notice--info}

```yaml
comments:
  provider: "staticman"
staticman:
  allowedFields          : ['name', 'email', 'url', 'message']
  branch                 : # "master", "gh-pages"
  commitMessage          : "New comment."
  filename               : comment-{@timestamp}
  format                 : "yml"
  moderation             : true
  path                   : "_data/comments/{options.slug}"
  requiredFields         : ['name', 'email', 'message']
  transforms:
    email                : "md5"
  generatedFields:
    date:
      type               : "date"
      options:
        format           : "iso8601" # "iso8601" (default), "timestamp-seconds", "timestamp-milliseconds"
```

###### Comment Moderation

By default comment moderation is enabled in `_config.yml`. As new comments are submitted Staticman will send a pull request. Merging these in will approve the comment, close the issue, and automatically rebuild your site (if hosted on GitHub Pages).

To skip this moderation step simply set `moderation: false`.

**ProTip:** Create a GitHub webhook that sends a `POST` request to the following payload URL `https://api.staticman.net/v1/webhook` and triggers a "Pull request" event to delete Staticman branches on merge.
{: .notice--info}

![pull-request webhook]({{ "/assets/images/mm-staticman-pr-webhook.jpg" | absolute_url }})

##### Other Comment Providers

To use another provider not included with the theme set `provider: "custom"` then add their embed code to `_includes/comments-providers/custom.html`.

### Custom Feed URL

By default the theme links to `feed.xml` generated in the root of your site by the **jekyll-feed** plugin. To link to an externally hosted feed update `atom_feed` in `_config.yml` like so:

```yaml
atom_feed:
  path: "http://feeds.feedburner.com/youFeedname"
```

**Note:** By default the site feed is linked in two locations: inside the [`<head>` element]({{ gh_repo }}/master/_includes/head.html) and at the bottom of every page in the [site footer](https://github.com/{{ site.repository }}/master/_includes/footer.html).
{: .notice--info}

### SEO, Social Sharing, and Analytics Settings

All optional, but a good idea to take the time setting up to improve SEO and links shared from the site.

#### Google Search Console

Formerly known as [Google Webmaster Tools](https://www.google.com/webmasters/tools/), add your [verification code](https://support.google.com/analytics/answer/1142414?hl=en) like so: `google_site_verification: "yourVerificationCode"`.

**Note:** You likely won't have to do this if you verify site ownership through **Google Analytics** instead.
{: .notice--warning}

#### Bing Webmaster Tools

There are several ways to [verify site ownership](https://www.bing.com/webmaster/help/how-to-verify-ownership-of-your-site-afcfefc6) --- the easiest adding an authentication code to your config file.

Copy and paste the string inside of `content`:

```html
<meta name="msvalidate.01" content="0FC3FD70512616B052E755A56F8952D" />
```

Into `_config.yml`

```yaml
bing_site_verification: "0FC3FD70512616B052E755A56F8952D"
```

#### Alexa

To [claim your site](http://www.alexa.com/siteowners/claim) with Alexa add the provided verification ID `alexa_site_verification: "yourVerificationID"`.

#### Yandex

To verify site ownership copy and paste the string inside of `name`:

```html
<meta name='yandex-verification' content='2132801JL' />
```

Into `_config.yml`

```yaml
yandex_site_verification: "2132801JL"
```

#### Twitter Cards and Facebook Open Graph

To improve the appearance of links shared from your site to social networks like Twitter and Facebook be sure to configure the following.

##### Site Twitter Username

Twitter username for the site. For pages that have custom author Twitter accounts assigned in their YAML Front Matter or data file, they will be attributed as a **creator** in the Twitter Card. 

For example if my site's Twitter account is `@mmistakes-theme` I would add the following to `_config.yml`

```yaml
twitter:
  username: "mmistakes-theme"
```

And if I assign `@mmistakes` as an author account it will appear in the Twitter Card along with `@mmistakes-theme`, attributed as a creator of the page being shared.

**Note**: You need to [apply for Twitter Cards](https://dev.twitter.com/docs/cards) and validate they're working on your site before they will begin showing up.
{: .notice--warning}

##### Facebook Open Graph

If you have a Facebook ID or publisher page add them:

```yaml
facebook:
  app_id:  # A Facebook app ID
  publisher:  # A Facebook page URL or ID of the publishing entity
```

While not part a part of Open Graph, you can also add your Facebook username for use in the sidebar and footer.

```yaml
facebook:
  username: "michaelrose"  # https://www.facebook.com/michaelrose
```

**ProTip:** To debug Open Graph data use [this tool](https://developers.facebook.com/tools/debug/og/object?q=https%3A%2F%2Fmademistakes.com) to test your pages. If content changes aren't reflected you will probably have to hit the **Fetch new scrape information** button to refresh.
{: .notice--info}

##### Open Graph Default Image

For pages that don't have a `header.image` assigned in their YAML Front Matter, `site.og_image` will be used as a fallback. Use your logo, icon, avatar or something else that is meaningful. Just make sure it is place in the `/assets/images/` folder, a minimum size of 120px by 120px, and less than 1MB in file size.

```yaml
og_image: /assets/images/site-logo.png
```

<figure>
  <img src="{{ '/assets/images/mm-twitter-card-summary-image.jpg' | absolute_url }}" alt="Twitter Card summary example">
  <figcaption>Example of a image placed in a Summary Card.</figcaption>
</figure>

Documents who have a `header.image` assigned in their YAML Front Matter will appear like this when shared on Twitter and Facebook.

<figure>
  <img src="{{ '/assets/images/mm-twitter-card-summary-large.jpg' | absolute_url }}" alt="page shared on Twitter">
  <figcaption>Shared page on Twitter with header image assigned.</figcaption>
</figure>

<figure>
  <img src="{{ '/assets/images/facebook-share-example.jpg' | absolute_url }}" alt="page shared on Facebook">
  <figcaption>Shared page on Facebook with header image assigned.</figcaption>
</figure>

##### Include your social profile in search results

Use markup on your official website to add your [social profile information](https://developers.google.com/structured-data/customize/social-profiles#adding_structured_markup_to_your_site) to the Google Knowledge panel in some searches. Knowledge panels can prominently display your social profile information.

```yaml
social:
  type:  # Person or Organization (defaults to Person)
  name:  # If the user or organization name differs from the site's name
  links:
    - "https://twitter.com/yourTwitter"
    - "https://facebook.com/yourFacebook"
    - "https://instagram.com/yourProfile"
    - "https://www.linkedin.com/in/yourprofile"
    - "https://plus.google.com/your_profile"
```

#### Analytics

Analytics is disabled by default. To enable globally select one of the following:

| Name                 | Analytics Provider                                              |
| ----                 | ------------------                                              |
| **google**           | [Google Standard Analytics](https://www.google.com/analytics/)  |
| **google-universal** | [Google Universal Analytics](https://www.google.com/analytics/) |
| **custom**           | Other analytics providers                                       |

For Google Analytics add your Tracking Code:

```yaml
analytics:
  provider: "google-universal"
    tracking_id: "UA-1234567-8"
```

To use another provider not included with the theme set `provider: "custom"` then add their embed code to `_includes/analytics-providers/custom.html`.

## Site Author

Used as the defaults for defining what appears in the author sidebar.

![author sidebar example]({{ "/assets/images/mm-author-sidebar-example.jpg" | absolute_url }})

**Note:** For sites with multiple authors these values can be overridden post by post with custom YAML Front Matter and a data file. For more information on how that works see below.
{: .notice--info}

```yaml
author:
  name   : "Your Name"
  avatar : "/assets/images/bio-photo.jpg"
  bio    : "My awesome biography constrained to a sentence or two goes here."
  email  : # optional
  uri    : "http://your-site.com"
```

Social media links are all optional, include the ones you want visible. In most cases you just need to add the username. If you're unsure double check `_includes/author-profile.html` to see how the URL is constructed.

To add social media links not included with the theme or customize the author sidebar further, read the full [layout documentation]({{ "/docs/layouts/#author-profile" | absolute_url }}).

## Reading Files

Nothing out of the ordinary here. `include` and `exclude` may be the only things you need to alter.

## Conversion and Markdown Processing

Again nothing out of the ordinary here as the theme adheres to the defaults used by GitHub Pages. [**Kramdown**](http://kramdown.gettalong.org/) for Markdown conversion, [**Rouge**](http://rouge.jneen.net/) syntax highlighting, and incremental building disabled. Change them if you need to.

## Front Matter Defaults

To save yourself time setting [Front Matter Defaults](https://jekyllrb.com/docs/configuration/#front-matter-defaults) for posts, pages, and collections is the way to go. Sure you can assign layouts and toggle settings like **reading time**, **comments**, and **social sharing** in each file, but that's not ideal.

Using the `default` key in `_config.yml` you could set the layout and enable author profiles, reading time, comments, social sharing, and related posts for all posts --- in one shot.

```yaml
defaults:
  # _posts
  - scope:
      path: ""
      type: posts
    values:
      layout: single
      author_profile: true
      read_time: true
      comments: true
      share: true
      related: true
```

Pages Front Matter defaults can be scoped like this:

```yaml
defaults:
  # _pages
  - scope:
      path: ""
      type: pages
    values:
      layout: single
```

And collections like this:

```yaml
defaults:
  # _foo
  - scope:
      path: ""
      type: foo
    values:
      layout: single
```

And of course any default value can be overridden by settings in a post, page, or collection file. All you need to do is specify the settings in the YAML Front Matter. For more examples be sure to check out the demo site's [`_config.yml`](https://github.com/{{ site.repository }}/gh-pages/_config.yml).

## Outputting

The default permalink style used by the theme is `permalink: /:categories/:title/`. If you have a post named `2016-01-01-my-post.md` with `categories: foo` in the YAML Front Matter, Jekyll will generate `_site/foo/my-post/index.html`.

**Note:** If you plan on enabling breadcrumb links --- including category names in permalinks is a big part of how those are created.
{: .notice--warning}

### Paginate

If [using pagination](https://github.com/jekyll/jekyll-paginate) on the homepage you can change the amount of posts shown with:

```yaml
paginate: 5
```

You'll also need to include some Liquid and HTML to properly use the paginator, which you can find in the **Layouts** section under [Home Page]({{ "/docs/layouts/#home-page" | absolute_url }}).

**Please note:** [Jekyll's pagination](http://jekyllrb.com/docs/pagination/) may have unexpected results when used on pages other than the home page eg. `<site domain>/blog/index.html`.
{: .notice--info}

### Timezone

This sets the timezone environment variable, which Ruby uses to handle time and date creation and manipulation. Any entry from the [IANA Time Zone Database](http://en.wikipedia.org/wiki/List_of_tz_database_time_zones) is valid. The default is the local time zone, as set by your operating system.

```yaml
timezone: America/New_York
```

## Plugins

When hosting with GitHub Pages a small [set of gems](https://pages.github.com/versions/) have been whitelisted for use. The theme uses a few of them which can be found under `gems`. Additional settings and configurations are documented in the links below.

| Plugin                             | Description |
| ------                             | ----------- |
| [jekyll-paginate][jekyll-paginate] | Pagination Generator for Jekyll. |
| [jekyll-sitemap][jekyll-sitemap] |Jekyll plugin to silently generate a sitemaps.org compliant sitemap for your Jekyll site. |
| [jekyll-gist][jekyll-gist] | Liquid tag for displaying GitHub Gists in Jekyll sites. |
| [jekyll-feed][jekyll-feed] | A Jekyll plugin to generate an Atom (RSS-like) feed of your Jekyll posts. |
| [jemoji][jemoji] | GitHub-flavored emoji plugin for Jekyll. |

[jekyll-paginate]: https://github.com/jekyll/jekyll-paginate
[jekyll-sitemap]: https://github.com/jekyll/jekyll-sitemap
[jekyll-gist]: https://github.com/jekyll/jekyll-gist
[jekyll-feed]: https://github.com/jekyll/jekyll-feed
[jemoji]: https://github.com/jekyll/jemoji

If you're hosting elsewhere then you don't really have to worry about what is whitelisted as you are free to include whatever [Jekyll plugins](https://jekyllrb.com/docs/plugins/) you desire.

## Archive Settings

The theme ships with support for taxonomy (category and tag) pages. GitHub Pages hosted sites need to use a *Liquid only* approach while those hosted elsewhere can use plugins like [**jekyll-archives**][jekyll-archives] to generate these pages automatically.

[jekyll-archives]: https://github.com/jekyll/jekyll-archives

The default `type` is set to use Liquid.

**Note:** `category_archive` and `tag_archive` were previously named `categories` and `tags`. Names were changed to avoid possible conflicts with `site.categories` and `site.tags`.
{: .notice--danger}

```yaml
category_archive:
  type: liquid
  path: /categories/
tag_archive:
  type: liquid
  path: /tags/
```

Which would create category and tag links in the breadcrumbs and page meta like: `/categories/#foo` and `/tags/#foo`.

**Note:** for these links to resolve properly, category and tag index pages need to exist at [`/categories/index.html`](https://github.com/{{ site.repository }}/blob/master/docs/_pages/category-archive.html) and [`/tags/index.html`](https://github.com/{{ site.repository }}/blob/master/docs/_pages/tag-archive.html). The necessary Liquid code to build these pages can be taken from the demo site.
{: .notice--warning}

If you have the luxury of using Jekyll Plugins then [**jekyll-archives**][jekyll-archives] will make your life much easier as category and tag pages are created for you.

Change `type` to `jekyll-archives` and apply the following [configurations](https://github.com/jekyll/jekyll-archives/blob/master/docs/configuration.md):

```yaml
category_archive:
  type: jekyll-archives
  path: /categories/
tag_archive:
  type: jekyll-archives
  path: /tags/
jekyll-archives:
  enabled:
    - categories
    - tags
  layouts:
    category: archive-taxonomy
    tag: archive-taxonomy
  permalinks:
    category: /categories/:name/
    tag: /tags/:name/
```

**Note:** The `archive-taxonomy` layout used by jekyll-archives is provided with the theme and can be found in the `_layouts` folder.
{: .notice--info}

## HTML Compression

If you care at all about performance (and really who doesn't) compressing the HTML files generated by Jekyll is a good thing to do.

If you're hosting with GitHub Pages there aren't many options afforded to you for optimizing the HTML Jekyll generates. Thankfully there is some Liquid wizardry you can use to strip whitespace and comments to reduce file size.

There's a variety of configurations and caveats to using the `compress` layout, so be sure to read through the [documentation](http://jch.penibelst.de/) if you decide to make change the defaults set in the theme's `_config.yml`.

```yaml
compress_html:
  clippings: all
  ignore:
    envs: development  # disable compression in dev environment
```

**Caution:** Inline JavaScript comments can cause problems with `compress.html`, so be sure to `/* comment this way */` and avoid `// these sorts of comments`.
