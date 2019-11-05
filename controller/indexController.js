/*
 定义路由  暴露路由 

*/
let express = require("express");
let router = express.Router();

let blogmodel = require("../mondel/blogmodel");


// limit 9  控制显示的内容
    router.get("/",(req,res)=>{
      // 查询的条件  limit:9  
      blogmodel.find({},{},{limit:9},function(err,result){
        if(!err)
        {
          console.log(result);
          res.render("index-index.html",{result:result});
        }

      })   
    })

    router.get("/publish",(req,res)=>{

      res.render("user-publish.html");
   
   })
   
   router.get("/about",(req,res)=>{
     res.render("index-about.html")
   })

   router.get("/detail",(req,res)=>{
    res.render("index-blog-detail.html")
  })

    router.get("/blog",(req,res)=>{
    res.render("index-blog.html")
  })
  router.get("/contact",(req,res)=>{
    res.render("index-contact.html")
  })



//暴露路由
module.exports = router;