export const PRIV = {
  PRIV_ORDER_SIMPLE:                    1<<0, //琴房申请权限
  PRIV_ORDER_ACTIVITY:                  1<<1, //活动室申请权限
  PRIV_APPROVE_MANAGER_DEPT:            1<<2, //负责人审批权限_按managers
  PRIV_APPROVE_MANAGER_ALL:             1<<3, //负责人审批权限_全部
  PRIV_APPROVE_SCHOOL:                  1<<4, //校级审批权限(审批/驳回/撤销)
  PRIV_APPROVE_SIMPLE:                  1<<5, //琴房审批权限(审批/驳回/撤销)
  PRIV_BACKEND:                         1<<6, //后台登陆
  PRIV_ADMIN:                           1<<7, //系统管理
  PRIV_TYPE_ISSUE:                      1<<8, //开门条
};