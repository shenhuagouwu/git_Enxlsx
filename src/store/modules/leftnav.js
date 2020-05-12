import Cookies from 'js-cookie';
const state = {
    editorType: Cookies.get('editorType') ? Cookies.get('editorType') : 'Timeperiodanalysis'
};
const mutations = {
    changeType(state,editorType){
        state.editorType = editorType;
        Cookies.set('editorType', editorType);
        console.log("调用vuex后的type:" + editorType);
    }
};
const actions = {
    changeType(ctx,editorType) {
        ctx.commit('changeType',editorType);
    }
};
export default {
    namespaced: true,
    state,
    mutations,
    actions
};