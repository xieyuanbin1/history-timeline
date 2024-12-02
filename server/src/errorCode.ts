const defaultCode = {
  SUCCESS: { code: 0, msg: 'success' },
  FAILED: { code: 10000, msg: 'failed' },
  INVALID_PARAMS: { code: 20100, msg: '参数错误' },
  NULL_ROUTE: { code: 20101, msg: '接口不存在' },
  PORT_USED: { code: 20102, msg: '端口已被占用' },
  PROT_ERROR: { code: 20103, msg: '端口不符合要求' },
  PARAM_ERRO: { code: 20104, msg: 'Param 参数错误' },
  FILE_EMPTY: { code: 20105, msg: '文件不能为空' },
  FILE_NOEXIT: { code: 20106, msg: '文件不存在' },
  INVALID_PATH: { code: 20107, msg: '错误的 Path' },
  NULL_PATH: { code: 20108, msg: 'Path 不能为空' }
};

const systemCode = {
  DB_FAILED: { code: 10001, msg: '数据库执行失败' }
};

export const errorCode = {
  ...defaultCode,
  ...systemCode,
};

