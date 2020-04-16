
import { file_delete_url } from '@/config/api.js';
import { post } from '@/utils/requests/post.js'
/**
 * @param fileID
 */
function deleteFile (fileID) {
    let form = {
        fileID: fileID,
        token: window.localStorage.getItem('token')
    }
    return post(file_delete_url, form);
}
export {
    deleteFile
}