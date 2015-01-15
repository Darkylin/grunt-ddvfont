<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <style>
        body{
            font-size: 26px;
        }
        {{#each this}}
        @font-face {
            font-family: {{@key}};
            src: url(ttf/{{@key}}.ttf);
        }
        .{{@key}}{
            font-family: {{@key}};
        }
        {{/each}}
        .hel{
            font-family: helvetica;
            background: green;
        }
    </style>
</head>
<body>
{{#each this}}
    <div class="{{@key}}">{{this}}</div>
{{/each}}
<div class="hel">0123456789</div>
</body>
</html>