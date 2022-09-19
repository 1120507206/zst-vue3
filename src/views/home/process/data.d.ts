import { ResponseData, PaginationParams, PaginationResult } from '@/shims-vue.d';

export namespace ReqParams {
  export interface ListParams extends PaginationParams {
    appName: string,
    assignee: string,
    createTimeStart: string,
    createTimeEnd: string,
    launchDeptCodes?: string[],
    processDefinitionKey: string,
    taskType?: '1' | '2' | '3' | '4' | '5' | '6', // 任务种类标识:1.普通任务;2.组任务;3.并行任务;4.驳回;5.补充资料;6抄送
    undertakeDeptCodes?: string[],
  }

  export interface FindApprovalResults {
    bizId: string,
    bizSeq?: string, // `${processDefinitionId}-${bizId}`
    processDefinitionId: string,
  }

  export interface FindNextAssigneeUser {
    bizId: string,
    bizSeq?: string, // `${processDefinitionId}-${bizId}`
    orgId?: string,
    processDefinitionId: string,
  }

  export interface FlowCommit {
    appOpinions?: string,
    assignee: string,
    bizId: string,
    bizSeq?: string,
    comment?: string,
    currentUser?: string,
    processDefinitionId: string,
    varJsonString?: string,
    vars?: Record<string, unknown>,
  }

  export interface FlowRecall {
    bizId: string,
    bizSeq?: string,
    comment?: string,
    currentUser?: string,
    processDefinitionId: string,
    targetNodeId?: string,
    vars: Record<string, unknown>,
  }

  export interface FlowStart {
    appName?: string,
    appNo?: string,
    assignee: string,
    bizId: string,
    bizSeq?: string,
    processDefinitionId: string,
  }

  export interface FlowDelete {
    bizId: string,
    bizSeq?: string, // `${processDefinitionId}-${bizId}`
    processDefinitionId: string,
  }
}

export namespace ResResult {
  export interface ListItem {
    appName: string,
    appNo: string,
    assignee: string,
    assigneeDeptName: string,
    assigneeName: string,
    businessKey: string,
    buttonConfig: string,
    curNodeKey: string,
    formConfig: string,
    formKey: string,
    launchDeptCode: string,
    launchDeptName: string,
    processDefinitionId: string,
    sendMan: string,
    sentDate: string,
    templateId: string,
    templateName: string,
  }

  export type GetHandledPageTaskDist = ResponseData<PaginationResult<ListItem>>

  export type GetHandledTaskDistTOP10 = ResponseData<ListItem[]>

  export type GetNeedDealtPageTask = ResponseData<PaginationResult<ListItem>>

  export type GetNeedDealtTask = ResponseData<ListItem[]>

  interface ApprovalResult {
    businessKey: string,
    appOpinions: 'Y' | 'N' | 'R', // 审批意见：Y：同意，N：不同意，R：退回
    assignee: string,
    assigneeName: string,
    comments: string,
    startTime: string,
    state: -1 | 0 | 1 | 2 | 3, // 审批状态代码:-1.已取消,0.待审批,1.已审批,2.驳回,3.已阅读
    appDate: string,
    taskName: string,
  }

  export type FindApprovalResults = ResponseData<ApprovalResult[]>

  interface CandidateInfo {
    checked: boolean,
    orgId: string,
    orgName: string,
    userId: string,
    userIdentityId: string,
    userName: string
  }

  export type FindNextAssigneeUser = ResponseData<{
    candidateInfoList: CandidateInfo[],
    nextPostInfo: string,
  }>;

  export type FlowCommit = ResponseData<void>

  export type FlowRecall = ResponseData<void>

  export type FlowStart = ResponseData<void>

  export type FlowDelete = ResponseData<void>
}

export interface TaskData extends ResResult.ListItem {
  bizId: string,
}

export interface AuditUserItem {
  id: string,
  name: string,
}

export interface ButtonConfig {
  /* 是否显示回退按钮 */
  backBtn: boolean,

  /* 回退按钮文本 */
  backBtnText: string,

  /* 是否显示推送按钮 */
  pushBtn: boolean,

  /* 推送按钮文本 */
  pushBtnText: string,

  /* 是否显示驳回按钮 */
  filedAwayBtn: boolean,

  /* 驳回按钮文本 */
  filedAwayBtnText: string,

  /* 是否执行js */
  doJs: boolean,

  /* 需要执行js的的函数名 */
  doJsFunction: string,
}

export interface FormConfig {
  /* 岗位ID */
  roleId: string,

  /* 组织ID */
  orgId: string,

  /* 向上查找级别数 */
  upLevel: number,

  /* 下一节点ID */
  afterNodeId: string,

  /* 是否组任务 */
  afterGroup: boolean,

  /* 下一节点是否并行 */
  afterList: boolean,

  /* 是否岗位待办， */
  autoSelectNextOperator: boolean,

  /* 是否允许编辑 */
  isEdit: boolean,
}
