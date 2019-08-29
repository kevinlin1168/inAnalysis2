import Vue from "vue"
import {user_generateToken_url} from "@/config/api.js"
let vue = new Vue()

export function get(url, form = {}, config = {}) {
    return new Promise((resolve, reject) => {
        vue.$http.get(url, form, config).then((resp) => {
            if (resp.body.status == 'success') {
                resolve(resp);
            }
        })
        .catch((error) => {
            if(error.status == 401) {
                let userForm = {
                    userID: window.localStorage.getItem('userID'),
                    userName: window.localStorage.getItem('userName')
                }
                vue.$http.post(user_generateToken_url, userForm).then((resp) => {
                    if(resp.body.status == 'success') {
                        window.localStorage.setItem('token', resp.body.data.token);
                        form.token = resp.body.data.token;
                        vue.$http.get(url, form, config).then((resp) => {
                            if (resp.body.status == 'success') {
                                resolve(resp);
                            }
                        })
                    }
                })
                .catch((error) => {
                    reject.error(error)
                })
            } else {
                reject(error);
            }
        });
    });
}