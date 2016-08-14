export const PRIV = {
  PRIV_ADMIN:               			1<<0, //房间类型 琴房
  PRIV_APPROVE_MANAGER_DEPT:            1<<1, //负责人审批权限_按managers
  PRIV_APPROVE_MANAGER_ALL:             1<<2, //负责人审批权限_全部
  PRIV_APPROVE_SCHOOL:                  1<<3, //校级审批权限(审批/驳回/撤销)
  PRIV_APPROVE_SIMPLE:                  1<<4, //琴房审批权限(审批/驳回/撤销)
  PRIV_TYPE_ISSUE:                      1<<5, //开门条发放权限
  PRIV_ORDER_SIMPLE:                    1<<6, //琴房申请权限
  PRIV_ORDER_ACTIVITY:                  1<<7, //活动室申请权限
};