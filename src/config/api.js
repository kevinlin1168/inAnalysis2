import { baseUrl } from './env';

let userUrl = baseUrl + '/user'
let projectUrl = baseUrl + '/project'
let fileUrl = baseUrl + '/file'

// user Api
export const user_signin_url = userUrl + '/signin';
export const user_signup_url = userUrl + '/signup';

// project Api
export const project_add_url = projectUrl + '/add';
export const project_getProjectByUser_url = projectUrl + '/getProjectByUserID';
export const project_delete_url = projectUrl + '/delete';

// file Api
export const file_upload_url = fileUrl + '/upload';
export const file_delete_url = fileUrl + '/delete';
export const file_getFileList_url = fileUrl + '/getFileList';

