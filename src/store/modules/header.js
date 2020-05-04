import Cookies from 'js-cookie';

const state = {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    editorType: Cookies.get('editorType') ? Cookies.get('editorType') : 'home',
};
  
  
const mutations = {
    TOGGLE_SIDEBAR: state => {
        state.opened = !state.opened;
        if (state.opened) {
            Cookies.set('sidebarStatus', 1);
        } else {
            Cookies.set('sidebarStatus', 0);
        }
    },
    changeEditorType(state,editorType){
        state.editorType = editorType;
        Cookies.set('editorType', editorType);
        console.log("调用vuex后的type:" + editorType);
    }
};

const actions = {
    toggleSideBar({ commit }) {
        commit('TOGGLE_SIDEBAR');
    },
    changeEditorType(ctx,editorType) {
        ctx.commit('changeEditorType',editorType);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};