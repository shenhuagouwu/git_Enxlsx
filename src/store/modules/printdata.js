/*
 * @Author: your name
 * @Date: 2020-05-14 16:27:38
 * @LastEditTime: 2020-05-14 17:31:42
 * @LastEditors: your name
 * @Description: In User Settings Edit)
 * @FilePath: \git_Enxlsx\src\store\modules\printdata.js
 */

const state = {
    databox: localStorage.getItem('databox') ? JSON.parse(localStorage.getItem('databox')) : ''
};
const mutations = {
    handleClick(state,databox){
        //state.databox = null;
        state.databox = databox;
        var databoxString = JSON.stringify(databox);
        localStorage.setItem('databox', databoxString);
        console.log(state.databox,3333);
    }
};
const actions = {
    handleClick(ctx,databox) {
        console.log(databox,1111);
        ctx.commit('handleClick',databox);
        console.log(databox,2222);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};