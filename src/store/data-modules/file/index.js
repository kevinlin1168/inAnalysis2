import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const namespaced = true;

export default {
    namespaced,
    state() {
        return {
            fileID: null,
            type: null
        }
    },
    actions,
    getters,
    mutations
}