const types = {
  TYPE_SUBMIT:          0,
  TYPE_CHANGE_HOUR:     1,
  TYPE_CANCEL:          2,
  TYPE_MANAGER_APPROVE: 10,
  TYPE_MANAGER_REJECT:  11,
  TYPE_MANAGER_REVOKE:  12,
  TYPE_SCHOOL_APPROVE:  20,
  TYPE_SCHOOL_REJECT:   21,
  TYPE_SCHOOL_REVOKE:   22,
  TYPE_AUTO_APPROVE:    30,
  TYPE_AUTO_REJECT:     31,
  TYPE_AUTO_REVOKE:     32
};

let typeNames = {};
typeNames[types.TYPE_SUBMIT] =          '提交预约';
typeNames[types.TYPE_CHANGE_HOUR] =     '修改预约时间';
typeNames[types.TYPE_CANCEL] =          '取消预约';
typeNames[types.TYPE_MANAGER_APPROVE] = '负责人审批通过';
typeNames[types.TYPE_MANAGER_REJECT] =  '负责人审批驳回';
typeNames[types.TYPE_MANAGER_REVOKE] =  '负责人审批撤回';
typeNames[types.TYPE_SCHOOL_APPROVE] =  '校团委审批通过';
typeNames[types.TYPE_SCHOOL_REJECT] =   '校团委审批驳回';
typeNames[types.TYPE_SCHOOL_REVOKE] =   '校团委审批撤回';
typeNames[types.TYPE_AUTO_APPROVE] =    '自动审批通过';
typeNames[types.TYPE_AUTO_REJECT] =     '自动审批驳回';
typeNames[types.TYPE_AUTO_REVOKE] =     '自动审批撤回';

export {types, typeNames};