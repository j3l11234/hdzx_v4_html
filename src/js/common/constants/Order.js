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
  SIMPLE_PENDING:       30, //琴房待审批
  SIMPLE_APPROVED:      2, //琴房通过
  SIMPLE_REJECTED:      32, //琴房驳回

  STATUS_PENDING:     1, //抽象待审批
	STATUS_APPROVED:    2, //抽象通过
	STATUS_REJECTED:    3, //抽象驳回
  STATUS_APPROVED_FIXED:    4, //抽象通过(固定,不可撤回)
  STATUS_REJECTED_FIXED:    5, //抽象驳回(固定,不可撤回)
  STATUS_CANCELED:    6 //抽象撤回};
}