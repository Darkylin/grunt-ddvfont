<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <style>
        body{
            font-size: 20px;
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
        .standard{
            background: #95ec00;
            color: #007f16
        }
        span{
            background: #61d7a4;
        }
        span:nth-child(odd){
            background: #60b9ce
        }
        div{
            line-height: 1;
        }
    </style>
</head>
<body>
{{#each this}}
    <div class="{{@key}}">{{span this}}</div>
{{/each}}
</body>
</html>