import Vue from "vue"
import {user_generateToken_url, file_download_url} from "@/config/api.js"
let vue = new Vue()

export function post(url, form = {}, config = {}) {
    return new Promise((resolve, reject) => {
        if(url != file_download_url) {
            vue.axios.post(url, form, config).then((resp) => {
                console.warn(resp)
                if (resp.data.status == 'success') {
                    resolve(resp);
                }
            })
            .catch((error) => {
                console.error('post Error', error)
                if(error.response.status == 401) {
                    let user = window.localStorage.getItem('user')
                    let userForm = {
                        userID: user.userID,
                        userName: user.userName
                    }
                    vue.axios.post(user_generateToken_url, userForm).then((resp) => {
                        if(resp.data.status == 'success') {
                            window.localStorage.setItem('token', resp.data.data.token);
                            form.token = resp.data.data.token;
                            vue.axios.post(url, form, config).then((resp) => {
                                if (resp.dataF.status == 'success') {
                                    resolve(resp);
                                }
                            })
                        }
                    })
                    .catch((error) => {
                        console.error('generateToken Error', error)
                        this.$router.push('/');
                    })
                } else {
                    reject(error);
                }
            });
        } else {
            vue.axios.post(url, form, config).then((resp) => {
                if (resp.status == 200) {
                    resolve(resp);
                }
            })
            .catch((error) => {
                if(error.status == 401) {
                    let user = window.localStorage.getItem('user')
                    let userForm = {
                        userID: user.userID,
                        userName: user.userName
                    }
                    vue.axios.post(user_generateToken_url, userForm).then((resp) => {
                        if(resp.data.status == 'success') {
                            window.localStorage.setItem('token', resp.data.data.token);
                            form.token = resp.data.data.token;
                            vue.axios.post(url, form, config).then((resp) => {
                                if (resp.data.status == 'success') {
                                    resolve(resp);
                                }
                            })
                        }
                    })
                    .catch((error) => {
                        reject(error)
                    })
                } else {
                    reject(error);
                }
            });
        }
            
    });
}