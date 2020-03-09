import { baseUrl } from './env';

let systemUrl = baseUrl + '/system';
let userUrl = baseUrl + '/user';
let projectUrl = baseUrl + '/project';
let fileUrl = baseUrl + '/file';
let visualizeUrl = baseUrl + '/visualize';
let analyticUrl = baseUrl + '/analytic';
let modelUrl = baseUrl + '/model';
let courseUrl = baseUrl + '/course';
let RPAUrl = baseUrl + '/RPA';

//service Api
export const system_getDataProject_url = systemUrl + '/getDataProject'
export const system_getDataFile_url = systemUrl + '/getDataFile'

// user Api
export const user_signin_url = userUrl + '/signin';
export const user_signup_url = userUrl + '/signup';
export const user_generateToken_url = userUrl + '/generateToken';
export const user_getUserInfo_url = userUrl + '/getUserInfo';
export const user_signupVerify_url = userUrl + '/signupVerify';
export const user_forgetPassword_url = userUrl + '/forgetPassword';
export const user_forgetPasswordVerify_url = userUrl + '/forgetPasswordVerify';

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
export const analytic_getCorrelationAlgo_url = analyticUrl + '/getCorrelationAlgo';
export const analytic_doPreprocess_url = analyticUrl + '/doPreprocess';
export const analytic_doCorrelation_url = analyticUrl + '/doCorrelation';
export const analytic_preprocessPreview_url = analyticUrl + '/preprocessPreview';
export const analytic_getAnalyticsAlgoByProject_url = analyticUrl + '/getAnalyticsAlgoByProject';
export const analytic_getAnalyticAlgoParam_url = analyticUrl + '/getAnalyticAlgoParam';
export const analytic_doModelTrain_url = analyticUrl + '/doModelTrain';
export const analytic_getModelPreview_url = analyticUrl + '/getModelPreview';
export const analytic_doModelTest_url = analyticUrl + '/doModelTest';
export const analytic_doModelPredict_url = analyticUrl + '/doModelPredict';
export const analytic_stopModelTraining_url = analyticUrl + '/stopModelTraining';
export const analytic_getModelParameter_url = analyticUrl + '/getModelParameter';

// model Api
export const model_addModel_url = modelUrl + '/addModel';
export const model_getModelByProjectID_url = modelUrl + '/getModelByProjectID';
export const model_deleteModel_url = modelUrl + '/deleteModel';

// RPA Api
export const RPA_saveRPA_url = RPAUrl + '/saveRPA';
export const RPA_loadRPA_url = RPAUrl + '/loadRPA';
export const RPA_exportRPA_url = RPAUrl + '/exportRPA';

// course Api for TA
export const course_addCourse_url = courseUrl + '/addCourse';
export const course_getCourse_url = courseUrl + '/getCourse';
export const course_deleteCourse_url = courseUrl + '/deleteCourse';
export const course_uploadStudentFile_url = courseUrl + '/uploadStudentFile';
export const course_getCourseByID_url = courseUrl + '/getCourseByID';
export const course_modifyCourse_url = courseUrl + '/modifyCourse';
export const course_getStudent_url = courseUrl + '/getStudent'; 
export const course_studentJudge_url = courseUrl + '/studentJudge';
export const course_sendEmail_url = courseUrl + '/sendEmail';
