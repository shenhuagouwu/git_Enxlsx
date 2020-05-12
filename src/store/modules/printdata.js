
const state = {
    databox: localStorage.getItem('databox') ? localStorage.getItem('databox') : ''
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