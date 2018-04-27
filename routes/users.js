const router = require('koa-router')()
router.prefix('/users')


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

		users.insert({name:body.name,pwd:body.pwd,age:body.,sex:'man'})
    }
    catch(error){
    	throw error
    }


	ctx.body = await users.find({_id:body.id})   // users.find({})返回的一个promise对象
  	
  	
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
