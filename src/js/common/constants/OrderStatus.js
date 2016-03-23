export const STATUS = {
  INIT:               parseInt('0x01', 16), //初始化
  PASSED:             parseInt('0x02', 16), //已通过
  CANCELED:           parseInt('0x03', 16), //取消
  MANAGER_PENDING:    parseInt('0x10', 16), //负责人待审批
  MANAGER_APPROVED:   parseInt('0x11', 16), //负责人通过
  MANAGER_REJECTED:   parseInt('0x12', 16), //负责人驳回
  SCHOOL_PENDING:     parseInt('0x11', 16), //校团委待审批
  SCHOOL_APPROVED:    parseInt('0x02', 16), //校团委通过
  SCHOOL_REJECTED:    parseInt('0x22', 16), //校团委驳回
  AUTO_PENDING:       parseInt('0x30', 16), //自动待审批
  AUTO_APPROVED:      parseInt('0x02', 16), //自动通过
  AUTO_REJECTED:      parseInt('0x32', 16), //自动驳回

  STATUS_PENDING:     1, //抽象待审批
	STATUS_APPROVED:    2, //抽象通过
	STATUS_REJECTED:    3 //抽象驳回
};