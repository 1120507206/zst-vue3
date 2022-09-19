import apiBaseUrl from '@/config/apiBaseUrl';
import request from '@/utils/request';
/* 待办列表，分页 */
export const getNeedDealtPageTask = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/wf/getNeedDealtPageTask',
  method: 'POST',
  data: params,
});
/* 待办列表，前10条数据 */
export const getNeedDealtTask = () => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/wf/getNeedDealtTask',
  method: 'POST',
});
/* 已办列表，分页 */
export const getHandledPageTaskDist = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/wf/getHandledPageTaskDist',
  method: 'POST',
  data: params,
});
/* 已办列表，前10条数据 */
export const getHandledTaskDistTOP10 = () => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/wf/getHandledTaskDistTOP10',
  method: 'POST',
});
/* 获取任务审批意见--列表 */
export const findApprovalResults = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/wf/findApprovalResults',
  method: 'POST',
  data: params,
});
/* 查找下一步审批人信息 */
export const findNextAssigneeUser = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/flow/findNextAssigneeUser',
  method: 'POST',
  data: params,
});
/* 提交任务 */
export const flowCommit = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/flow/commit',
  method: 'POST',
  data: params,
});
/* 任意节点回退任务 */
export const flowRecall = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/flow/recall',
  method: 'POST',
  data: params,
});
/* 发起流程 */
export const flowStart = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/flow/start',
  method: 'POST',
  data: params,
});
/* 删除流程 */
export const flowDelete = (params) => request({
  baseURL: apiBaseUrl.get('sys'),
  url: '/flow/deleteProcess',
  method: 'POST',
  data: params,
});
// # sourceMappingURL=service.js.map
