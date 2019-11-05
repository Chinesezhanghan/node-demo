/*
 定义二级路由规划
*/

//引入框架
let express = require("express");

//加载一个二级方法  Router()
let router = express.Router();

//引入  formidable  获取上传文件域内容 
let formidable = require("formidable");

let fs = require("fs");

let path = require("path");

//密码加密
var crypto = require("crypto");
//设置加密的内容
const secret = 'dsadfdsfdkjfskdfkjafdddd';

//生成图片名字 用uuid 
let uuid = require("uuid/v1");


//加载model层
let usermodel = require("../mondel/usermodel");
//加载model blog
let blogmodel = require("../mondel/blogmodel");

console.log(usermodel);



 //定义和规范二级路由

router.use((req,res,next)=>{
     //req.url
    console.log(req.url);  //   /reg
    //规范路由
   
    if(req.url == "/reg" || req.url=="/login")
    {
        console.log("22222222");
        return next();
    } else {
        next();
    }
})

/*
用户登录 展示页面
*/
router.get("/login",(req,res)=>{
  res.render("user-login.html");

})

//用户登录的post数据处理
router.post("/login",(req,res)=>{
   
   let post = req.body;
   let {password,username} = post;

   password = crypto.createHmac('sha256', secret).update(password).digest('hex');
  //做数据库查询
  usermodel.find({username},{},{},function(err,result){

   console.log(result);
 
   if(!result.length)
   {
     return res.render("wait.html",{
         wait:"2",
         content:"你没有该用户,请注册",
         href:"/user/reg"
     })
   }

    //有用户  密码做判断
     if(password != result[0].password)
     {
      return res.render("wait.html",{
           wait:"2",
           content:"你输入的密码错误",
           href:"/user/login"
       })
     }

     //匹配成功进行登录
     else{

     
      //存储用户名
        req.session.username = username; //sesssion  用户名
        console.log(req.session.username);// lisi
        req.session.id = result[0].id; //存储一个session  id

        return res.render("wait.html",{
            wait:"2",
            content:"登录成功",
            href:"/"
        })
     }

     
     

  })

})


//用户中心页
router.get("/center",(req,res)=>{
   if(req.session.username==null){
     res.redirect("/user/login")
   }
   res.render("user-index.html",{username:req.session.username})
})



//定义加载文件路由 注册页面的加载 显示注册页面
router.get("/reg",(req,res)=>{
   
   res.render("user-reg.html");
})


//注册以post方式
router.post("/doreg",(req,res)=>{
  
   
   let username = req.body.username;
   //console.log(username);
   let sex = req.body.sex;
   console.log(sex); //sex: "2"

   //加密 注册
   req.body.password = crypto.createHmac('sha256', secret).update(req.body.password).digest('hex');
   

   /*
    判断用户是否已经注册,如果注册了不允许注册.没有注册,可以注册 .  
   */
    
  usermodel.find({username},{},{},function(err,dosc){
   //console.log(dosc);
     if(dosc.length)
     {
        return res.render("wait.html",{
          wait:"2",
          content:"你已经注册过该用户,请从新注册",
          href:"/user/reg", 
       })
     }

  })



   /*
    添加到数据库中
   */
  console.log(req.body);
  usermodel.create(req.body,function(err,result){
       if(err)
       {
         return res.render("wait.html",{
             wait:"2",
             content:"注册失败,请从新注册",
             href:"/user/reg"
         })   

       }
       else{
        return res.render("wait.html",{
            wait:"2",
            content:"恭喜你注册成功",
            href:"/"
        })
  

       }

  })

})


//首页图片上传

//加载用户模块下的展示  图片
//用户模块  下上传图片功能
   
router.post("/publish",(req,res)=>{

  //fromidable 上传图片或者文件  (文件域) 获取上传文件的信息
 
 
  let form = new formidable.IncomingForm();
 
 
  form.uploadDir = path.normalize(__dirname+"/../tmpdir");
  form.parse(req,(err,fields,files)=>{

     
   
     //获取上传文件信息
     let uploadfile = files['file'];

     //获取图片后缀名
     let extname = path.extname(uploadfile.name); //.jpg
     
     //随机生成 图片名字
     
     let filename = uuid()+extname;
     console.log(filename);

     //获取源文件路径
     let oldpath = uploadfile.path;

     //规定一个新文件路径
   
     
     let newpath = path.resolve("./upload/"+filename);
     console.log(newpath);

     fs.rename(oldpath,newpath,function(err){
       if(err)
       {
         return res.render("wait.html",{
             wait:"2",
             content:"你上传文件失败",
             href:"/user/publish"
         })
       }
     
       //上传成功  保存到数据库中  blog 图片地址存入到集合里面
       fields.url = filename; 
       
       blogmodel.create(fields,function(err,result){

          console.log(result);
          if(err)
          {
              return  res.render("wait.html",{
              wait:"2",
              content:"文章发布失败",
              href:"/user/publish"
             })
          }
          else
          {
                  return  res.render("wait.html",{
                  wait:"2",
                  content:"文章发布成功",
                  href:"/"
                  })
          }

       })


     })

  })
})




//暴露路由
module.exports = router;
