import axios from 'axios';
import Qs from 'qs';
var config = require('../config');
var env = process.env.NODE_ENV;
axios.defaults.baseURL = env=="development"?config.dev.env.BASE_API: config.build.env.BASE_API;
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';


let http = axios.create({
    withCredentials: true,
    timeout: 20000,
    headers:{
        //'Content-Type':'application/x-www-form-urlencoded;charset=utf-8',
        "Access-Control-Allow-Origin":"*"
    },
    transformRequest:[function(data){
        // let newData = JSON.stringify(data);
        let newData = Qs.stringify(data);
        // let newData = '';
        // for (let k in data) {
        //     if(data.hasOwnProperty(k) === true){
        //         newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
        //     }
        // }
        // console.log("转化后是："+newData);
        // console.log("字符串长度："+newData.length);
        return newData;
        // return data;
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
