export const STATUS = {
  INIT:               1, //初始化
  PASSED:             2, //已通过
  CANCELED:           3, //取消
  MANAGER_PENDING:    10, //负责人待审批
  MANAGER_APPROVED:   11, //负责人通过
  MANAGER_REJECTED:   12, //负责人驳回
  SCHOOL_PENDING:     11, //校团委待审批
  SCHOOL_APPROVED:    2, //校团委通过
  SCHOOL_REJECTED:    22, //校团委驳回
  AUTO_PENDING:       30, //自动待审批
  AUTO_APPROVED:      2, //自动通过
  AUTO_REJECTED:      32, //自动驳回

  STATUS_PENDING:     1, //抽象待审批
	STATUS_APPROVED:    2, //抽象通过
	STATUS_REJECTED:    3 //抽象驳回
};