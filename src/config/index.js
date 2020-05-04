
module.exports = {
    build:{
        env:require('./prod.env'),
    },
    dev:{
        env:require('./dev.env'),
        port: 2070,
        // proxyTable:{
        //     '/api':{// 这里会替代我们在 target 里的写的后端的请求接口
        //         target:'http://172.16.10.121:8343',// 后端请求的域名或ip：端口号部分
        //         changeOrigin: true, // 是否允许跨域
        //         pathRewrite:{
        //             '^/api':'', // 重写
        //         }
        //     }
        // }
    }
};