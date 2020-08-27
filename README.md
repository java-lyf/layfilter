# layfilter

layu扩展组件

[在线预览](http://layui.52fansite.com)


1.引入 laymock 和 layfilter 组件
```html
layui.config({
    base: '../layui_exts/' //配置 layui 第三方扩展组件存放的基础目录
  }).extend({
    laymock:'laymock/laymock', //mock数据
    layfilter:'layfilter/layfilter'
  });
```

2.使用组件
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <title>layui扩展组件layfilter和laymock</title>
  <link rel="stylesheet" href="/layui/css/layui.css" media="all">
  <style>
    body{margin: 10px;}
    .demo-carousel{height: 200px; line-height: 200px; text-align: center;}
  </style>
</head>
<body>
<div id="layfilter" lay-filter="layfilter"></div>
<div style="margin-top: 10px;">
  <button class="layui-btn layui-btn-primary" id="getvalBtn">获取选中值</button>
  <button class="layui-btn layui-btn-primary" id="getDataBtn">查看数据接口出参</button>
</div>

<table class="layui-hide" id="demo" lay-filter="test"></table>
 
<script type="text/html" id="barDemo">
  <a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="detail">查看</a>
  <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
  <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
</script>
  
<script src="layui/layui.js"></script>
<script src="js/common.js"></script>
<script>
layui.config({
  version: '1545041465443' //为了更新 js 缓存，可忽略
});
 
layui.use([ 'layer', 'table','laymock','layfilter'], function(){
  var $ = layui.jquery;
  var layer = layui.layer //弹层
  ,table = layui.table //表格
  ,laymock = layui.laymock
  ,layfilter = layui.layfilter;

    laymock.mockData(RegExp('http://127.0.0.1:5500/user/list.*'),'get',function(option){
        var limit = getUrlParam(option.url,'limit');
        var data = {'code':0,'msg':'','count':100,'data|{count}':[
                {"userName" : '@cname',     //模拟名称
                "id":"@id",
                "age|1-100":10,          //模拟年龄(1-100)
                "color"    : "@color",    //模拟色值
                "date"     : "@date('yyyy-MM-dd')",  //模拟时间
                "url"      : "@url()",     //模拟url
                "sign"  : "@cparagraph()", //模拟文本
                "score|-20-100":100,
                "sex|1-2":2,
                "avatar":"@image"
                }]
            }
        data = JSON.parse(JSON.stringify(data).replace('{count}',limit));
        return laymock.mock.mock(data);
        }
            
    );
  
  //向世界问个好
  layer.msg('Hello World');

  var dataSource = 

  layfilter.render({
      elem:'#layfilter',
      itemWidth:[100],
      height:200,
      url:'/json/filter.json',
      dataSource:dataSource,
  });

  $('#getvalBtn').click(function(){
    layfilter.getValue(function(data){
      layer.alert(JSON.stringify(data));
    })
  });
  $("#getDataBtn").click(function(){
    $.getJSON('/json/filter.json',function(res){
      layer.alert(JSON.stringify(res));
    })
  })
  layfilter.on('click(layfilter)',function(obj){
        console.log(obj);
  })
  
  //执行一个 table 实例
  table.render({
    elem: '#demo'
    ,height: 420
    ,url: 'http://127.0.0.1:5500/user/list' //数据接口
    ,title: '用户表'
    ,page: true //开启分页
    ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
    ,totalRow: true //开启合计行
    ,cols: [[ //表头
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'id', title: 'ID'}
      ,{field: 'id', title: 'avatar',templet:function(d){
          return '<image src='+d.avatar+'/>'
      }}
      ,{field: 'userName', title: '用户名'}
      ,{field: 'age', title: '年龄', sort: true, totalRow: true}
      ,{field: 'sex', title: '性别', templet:function(d){
          return d.sex==1?'男':'女'
      }}
      ,{field: 'score', title: '评分', sort: true, totalRow: true}
      ,{field: 'sign', title: '签名',templet:function(d){
          return '<span style="color:'+d.color+'">'+d.sign+'</span>'
      }}
      ,{fixed: 'right', width: 165, align:'center', toolbar: '#barDemo'}
    ]]
  });
  
  //监听头工具栏事件
  table.on('toolbar(test)', function(obj){
    var checkStatus = table.checkStatus(obj.config.id)
    ,data = checkStatus.data; //获取选中的数据
    switch(obj.event){
      case 'add':
        layer.msg('添加');
      break;
      case 'update':
        if(data.length === 0){
          layer.msg('请选择一行');
        } else if(data.length > 1){
          layer.msg('只能同时编辑一个');
        } else {
          layer.alert('编辑 [id]：'+ checkStatus.data[0].id);
        }
      break;
      case 'delete':
        if(data.length === 0){
          layer.msg('请选择一行');
        } else {
          layer.msg('删除');
        }
      break;
    };
  });
  
  //监听行工具事件
  table.on('tool(test)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
    var data = obj.data //获得当前行数据
    ,layEvent = obj.event; //获得 lay-event 对应的值
    if(layEvent === 'detail'){
      layer.msg('查看操作');
    } else if(layEvent === 'del'){
      layer.confirm('真的删除行么', function(index){
        obj.del(); //删除对应行（tr）的DOM结构
        layer.close(index);
        //向服务端发送删除指令
      });
    } else if(layEvent === 'edit'){
      layer.msg('编辑操作');
    }
  });
  
});
</script>
</body>
</html>
```

说明：mock看官网说明：[http://mockjs.com/](http://mockjs.com)
具体内容请下载之后运行查看

![](https://cdn.layui.com/upload/2019_2/9055032_1551231282047_53581.jpg)
