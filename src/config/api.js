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

// file Api
export const file_upload_url = fileUrl + '/upload';

