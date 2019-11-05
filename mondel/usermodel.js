/*
 用户数据库  查询和添加的封装
*/
let mongoose = require("mongoose");

//创建一个模型 视图 

let Shema = new mongoose.Schema({
      username:String,
      password:String,
       sex:{
           type:String,
           //可以给默认的选择
           default:"3",
       },
       userreg:{
           type:Date,
           default:Date.now,
       }
   

})

//实例得到model  创建一个集合
let model = mongoose.model("user",Shema);

//封装查询方法

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


//封装一个添加的方法

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



