/*
 用户数据库  查询和添加的封装
*/
let mongoose = require("mongoose");

//创建一个模型 视图 

let Shema = new mongoose.Schema({
      title:String,
      desc:String,
      content:String,
      url:String,
      blogtime:{
           type:Date,
           default:Date.now,
       }

})

let model = mongoose.model("blog",Shema);



function find(contons,fildes,select,callback)
{
  
    model.find(contons,fildes,select,function(err,dosc){
      if(!err)
      {
        callback(null,dosc);
      }else
      {
        callback(err);
      }
    })

}



function create(post,callback)
{
   model.create(post,(err,dosc)=>{
    if(!err)
    {
      callback(null,dosc);
    }else
    {
      callback(err);
    }

   }) 

}



module.exports = {
    find:find,
    create:create
}



