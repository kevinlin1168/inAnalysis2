import { baseUrl } from './env';

let userUrl = baseUrl + '/user';
let projectUrl = baseUrl + '/project';
let fileUrl = baseUrl + '/file';
let visualizeUrl = baseUrl + '/visualize';
let analyticUrl = baseUrl + '/analytic';

// user Api
export const user_signin_url = userUrl + '/signin';
export const user_signup_url = userUrl + '/signup';

// project Api
export const project_add_url = projectUrl + '/add';
export const project_getProjectByUser_url = projectUrl + '/getProjectByUserID';
export const project_delete_url = projectUrl + '/delete';

// file Api
export const file_upload_url = fileUrl + '/upload';
export const file_download_url = fileUrl + '/download';
export const file_delete_url = fileUrl + '/delete';
export const file_getFileList_url = fileUrl + '/getFileList';
export const file_getColumn_url = fileUrl + '/getColumn';

// visualize Api
export const visualize_getAlgo_url = visualizeUrl + '/getAlgo';
export const visualize_doVisualize_url = visualizeUrl + '/doVisualize';

// analytic Api
export const analytic_getPreprocessAlgo_url = analyticUrl + '/getPreprocessAlgo';
export const analytic_doPreprocess_url = analyticUrl + '/doPreprocess';

