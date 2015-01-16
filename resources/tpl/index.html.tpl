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
        tr:nth-child(even){
            background: #cff2ff;
        }
        th{
            background: #3e89a6;
            color: #fff;
        }
        tr:last-child{
            color: #007f16;
            background: #95ec00;
        }
        table{
            border-collapse:collapse;
        }
    </style>
</head>
<body>
<table>
<tr><th>展示效果（0123456789）</th><th>字体文件名</th></tr>
{{#each this}}
    <tr><td class="{{@key}}">{{this}}</td><td>{{@key}}.ttf</td></tr>
{{/each}}
</table>
</body>
</html>