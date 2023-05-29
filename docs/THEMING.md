# Theming

Set the theme name in the linkler configuration file found in `./linkler-frontend/.linklerrc.js`

<br/>

## Current themes

### Classic

<img src="./screenshots/classic.png" height="450px"></img>

### Clicky

<img src="./screenshots/clicky.png" height="450px"></img>

### Cloud

<img src="./screenshots/cloud.png" height="450px"></img>

### Neon

<img src="./screenshots/neon.png" height="450px"></img>

<br/>

## Custom Theme

Create your a stylesheet under `./linkler-frontend/themes/your_theme_name.css`

This is the link markup generated dynamically

```html
<div class="link">
  <img class="icon" src="/url" />
  <div class="content">
    <h2 class="title">My Link</h2>
    <p class="description">Sample text</p>
  </div>
</div>
```

Use your theme's CSS file name without the extention as the theme name in the configuration file
