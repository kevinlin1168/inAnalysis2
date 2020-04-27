import { RPA_exportRPA_url, RPA_runRPA_url, RPA_saveRPA_url, RPA_loadRPA_url, RPA_importRPA_url } from '@/config/api.js';
import { post } from '@/utils/requests/post.js'
function runRPA(userID, projectID, token) {
    return new Promise((res, rej) => {
        let form = {
            userID: userID,
            projectID: projectID,
            token: token
        }
        post(RPA_runRPA_url, form).then((response) => {
            if (response.data.status == "success") {
                res();
            }
        }).catch(error => {
            rej(error);
        })
    })
}

function saveRPA(userID, projectID, token, name, description, RPAJson) {
    return new Promise((resolve, reject) => {
        // let nodeTemp =  this.scene.nodes.map(a => ({...a}));
        let form = {
          userID: userID,
          projectID: projectID,
          token: token,
          name: name,
          description: description,
          RPAJson: RPAJson
        }
        post(RPA_saveRPA_url, form).then((resp) => {
          resolve();
          console.log(resp);
        }).catch((error) => {
          reject(error);
        //   this.scene.nodes = nodeTemp.map(a => ({...a}));
        //   console.error('onContainerSaveError', error);
        })
    });
}

function exportRPA(userID, projectID, token) {
    let form = {
        userID: userID,
        projectID: projectID,
        token: token,
    }
    post(RPA_exportRPA_url, form).then((resp) => {
        if (resp.data.status == 'error' && resp.data.msg == 'No version') {
            this.$message({
            type: 'error',
            message: 'Please save a RPA version first'
            });
        } else {
            let blob = new Blob([JSON.stringify(resp.data)], {type:resp.headers['content-type']});
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'export.json';
            link.click();
        }
    }).catch((error) => {
        console.error('onContainerExportError', error);
    })
}

function loadRPA(userID, projectID, token) {
    return new Promise((resolve, reject) => {
        let form = {
            userID: userID,
            projectID: projectID,
            token: token,
        }
        post(RPA_loadRPA_url, form).then((resp) => {
            resolve(resp);
        }).catch((error) => {
            reject(error);
            console.error('onContainerloadError', error);
        })
    });
}

function importRPA(fileObj, userID, projectID, token) {
    return new Promise((res, rej) => {
        let form = new FormData();
        form.append("file", fileObj);
        form.append("userID", userID);
        form.append("projectID", projectID)
        form.append("token", token)
        post(RPA_importRPA_url, form).then((response) => {
            if (response.data.status == "success") {
                res();
            }
        }).catch((error) => {
            rej(error);
        });
    })
    
}

export {
    loadRPA,
    exportRPA,
    runRPA,
    saveRPA,
    importRPA
}