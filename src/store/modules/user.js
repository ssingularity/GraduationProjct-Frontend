import {getInfo, login, logout} from '@/api/user'
import {getToken, removeToken, setToken} from '@/utils/auth'
import router from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
};

const actions = {
  // user login
  login({commit}, userInfo) {
    const {username, password} = userInfo;
    return new Promise((resolve, reject) => {
      login({username: username.trim(), password: password}).then(response => {
        commit('SET_TOKEN', response.token);
        setToken(response.token);
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({commit}) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const {data} = response;

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        data.roles = data.authorities.map(x => x.role);
        const {roles, username, avatar, description} = data;
        commit('SET_ROLES', roles);
        commit('SET_NAME', username);
        commit('SET_AVATAR', avatar);
        commit('SET_INTRODUCTION', description);
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit}) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        removeToken();
        router.push("/login");
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      removeToken();
      resolve();
    })
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
