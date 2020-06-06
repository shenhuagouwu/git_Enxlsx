import axios from 'axios';
import Qs from 'qs';
var config = require('../config');
var env = process.env.NODE_ENV;
axios.defaults.baseURL = env=="development"?config.dev.env.BASE_API: config.build.env.BASE_API;
let http = axios.create({
    withCredentials: true,//指示是否跨站点访问控制请求
    timeout: 20000,//指定请求超时之前的毫秒数
    headers:{//是要发送的自定义标题
        "Access-Control-Allow-Origin":"*"
    },    
    transformRequest:[function(data){//允许在将请求数据发送到服务器之前对其进行更改,仅适用于请求方法“ PUT”，“ POST”，“ PATCH”和“ DELETE”
        let newData = Qs.stringify(data);
        return newData;
    }]
});
function apiAxios(method,url,params,response){
    http({
        method:method,
        url:url,
        data:method === 'POST' || method === 'PUT' ? params : null,
        params: method === 'GET' || method === 'DELETE' ? params : null,
    }).then(function(res){
        response(res);
    }).catch(function(err){
        response(err);
    });
}
export default{
    get: function(url,params,response){
        return apiAxios('GET',url,params,response);
    },
    post: function(url,params,response){
        return apiAxios('POST',url,params,response);
    },
    put: function(url,params,response){
        return apiAxios('PUT',url,params,response);
    },
    delete: function(url,params,response){
        return apiAxios('DELETE',url,params,response);
    }
};