const Koa = require('koa')
const app = new Koa()

const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const koaBody = require('koa-body');//处理文件上传

const index = require('./routes/index') //每创建一个路由文件都要在app.js里注册
const users = require('./routes/users')
const files = require('./routes/files')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date() //开始时间
  await next()
  const ms = new Date() - start //起止时间差
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`) //打印请求方法，url，消耗的时间
})



// app.use(koaBody({
//   formLimit: 1048576,  // 最大1M
//   textLimit: 1048576,
//   formidable:{
//     keepExtensions: true, // 带拓展名上传，否则上传的会是二进制文件而不是图片文件
//     onFileBegin(name,file){
//       file.path = __dirname+'/public/images/'+file.name; // 重命名上传文件
//     },
//     uploadDir: __dirname+'/public/images'},  // 输出到images文件夹
//  	multipart:true
// }))



// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(files.routes(), files.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});



module.exports = app
