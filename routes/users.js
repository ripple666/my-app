const router = require('koa-router')()
router.prefix('/users')

var Crawler = require("crawler");

const monk = require('monk');
const url = 'localhost:27017/koaTest';  //链接到koaTest数据库
const db = monk(url);
let users = db.get('users')




router.post('/register',  async  (ctx, next) => {  //await 必须要放在 async里面用
    ctx.set({
	  'Access-Control-Allow-Origin': '*'
	});
    const body = ctx.request.body

    try{
		users.insert({name:body.name})
    }
    catch(error){
    	throw error
    }


    let doc =  await users.find({}) // users.find({})返回的一个promise对象,resolve的参数为doc
	ctx.body =  doc
	
  	// db.close()	
})


const crawler = () =>{                        //在koa-router中使用中间件,如果return的是一个promise对象, 会等待promise执行完才进入下一个中间件
	return async (ctx,next) =>{
		ctx
		await new Promise((resolve,reject) =>{
			var c = new Crawler({
		    maxConnections : 10,
		    // This will be called for each crawled page
		    callback : (error, res, done) => {
			        if(error){
			            console.log(error);
			        }else{
			        	var $ = res.$;
			        	ctx.result = res.body
			        	resolve()
			        }
			        done();
			    }
			});
			c.queue('https://maopingshou.com/');
		})

		next()
	}
}
router.get('/crawler', crawler() ,ctx =>{
	ctx.body = ctx.result
})

module.exports = router


