layui.config({
    base: '../layui_exts/' //配置 layui 第三方扩展组件存放的基础目录
  }).extend({
    laymock:'laymock/laymock', //mock数据
    layfilter:'layfilter/layfilter'
  });


  function getUrlParam(url,name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = url.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}