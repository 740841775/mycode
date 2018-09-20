const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const session = require('express-session');
//验证码
var svgCaptcha = require('svg-captcha');
global.md5 = require('md5');

let secret = '192.168.3.101';

const app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));

//数据库连接
global.conn = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: '123456',
	port: 3306,
	database: 'examapp'
})
conn.connect();

app.use(cookieParser(secret));


//session设置
app.use(session({
	secret: secret,
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: 30 * 24 * 3600 * 1000
	}
}));

//模板引擎
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', './views');

// 验证码图片
app.get('/coder', (req, res) => {
	var captcha = svgCaptcha.create({
		noise: 4,
		ignoreChars: '0o1i',
		size: 4,
		background: '#cc9966',
		height: 38,
		width: 90
	});
	req.session.coder = captcha.text;

	res.type('svg'); // 使用ejs等模板时如果报错 res.type('html')
	res.status(200).send(captcha.data);

});

// 管理员登录
app.use('/admin/login',require('./modules/admin/login'));
// 管理员登录
app.use('/login', require('./modules/user/login'));

app.use(express.static('static'));

app.listen(8089);