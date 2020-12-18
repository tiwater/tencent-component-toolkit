const { Cynosdb } = require('../src');
const {
  getClusterDetail,
  sleep,
  generatePwd,
  offlineCluster,
  PWD_CHARS,
} = require('../src/modules/cynosdb/utils');

const pwdReg = new RegExp(`[${PWD_CHARS}]{8,64}`);

describe('Cynosdb', () => {
  jest.setTimeout(600000);
  const credentials = {
    SecretId: process.env.TENCENT_SECRET_ID,
    SecretKey: process.env.TENCENT_SECRET_KEY,
  };
  const region = 'ap-shanghai';
  const client = new Cynosdb(credentials, region);

  const inputs = {
    region,
    zone: 'ap-shanghai-2',
    vpcConfig: {
      vpcId: 'vpc-mshegdk6',
      subnetId: 'subnet-3la82w45',
    },
  };

  let clusterId;

  test('[generatePwd] should get random password with default length 8', () => {
    const res = generatePwd();
    expect(typeof res).toBe('string');
    expect(res.length).toBe(8);
  });

  test('[generatePwd] should get random password with customize length 6', () => {
    const res = generatePwd(6);
    expect(typeof res).toBe('string');
    expect(res.length).toBe(6);
  });

  test('[NORMAL] deploy', async () => {
    const res = await client.deploy(inputs);
    expect(res).toEqual({
      dbMode: 'NORMAL',
      region: inputs.region,
      region: inputs.region,
      zone: inputs.zone,
      vpcConfig: inputs.vpcConfig,
      instanceCount: 2,
      adminPassword: expect.stringMatching(pwdReg),
      clusterId: expect.stringContaining('cynosdbmysql-'),
      connection: {
        ip: expect.any(String),
        port: 3306,
        readList: [
          {
            ip: expect.any(String),
            port: 3306,
          },
        ],
      },
    });

    ({ clusterId } = res);
  });

  test('[NORMAL] remove', async () => {
    await sleep(300);
    const res = await client.remove({ clusterId });

    const detail = await getClusterDetail(client.capi, clusterId);
    expect(res).toEqual(true);
    expect(detail.Status).toBe('isolated');
  });
  test('[NORMAL] offline', async () => {
    await sleep(300);
    const res = await offlineCluster(client.capi, clusterId);
    expect(res).toBeUndefined();
  });

  test('[SERVERLESS] deploy', async () => {
    inputs.dbMode = 'SERVERLESS';

    const res = await client.deploy(inputs);
    expect(res).toEqual({
      dbMode: 'SERVERLESS',
      region: inputs.region,
      zone: inputs.zone,
      vpcConfig: inputs.vpcConfig,
      instanceCount: 1,
      adminPassword: expect.stringMatching(pwdReg),
      clusterId: expect.stringContaining('cynosdbmysql-'),
      minCpu: 0.5,
      maxCpu: 2,
      connection: {
        ip: expect.any(String),
        port: 3306,
        readList: expect.any(Array),
      },
    });

    ({ clusterId } = res);
  });

  test('[SERVERLESS] remove', async () => {
    await sleep(300);
    const res = await client.remove({ clusterId });

    const detail = await getClusterDetail(client.capi, clusterId);
    expect(res).toEqual(true);
    expect(detail.Status).toBe('isolated');
  });

  test('[SERVERLESS] offline', async () => {
    await sleep(300);
    const res = await offlineCluster(client.capi, clusterId);
    expect(res).toBeUndefined();
  });

  test('[SERVERLESS with minCpu and maxCpu] deploy', async () => {
    inputs.dbMode = 'SERVERLESS';
    inputs.minCpu = 2;
    inputs.maxCpu = 4;

    const res = await client.deploy(inputs);
    expect(res).toEqual({
      dbMode: 'SERVERLESS',
      region: inputs.region,
      zone: inputs.zone,
      vpcConfig: inputs.vpcConfig,
      instanceCount: 1,
      adminPassword: expect.stringMatching(pwdReg),
      clusterId: expect.stringContaining('cynosdbmysql-'),
      minCpu: 2,
      maxCpu: 4,
      connection: {
        ip: expect.any(String),
        port: 3306,
        readList: expect.any(Array),
      },
    });

    ({ clusterId } = res);
  });

  test('[SERVERLESS with minCpu and maxCpu] remove', async () => {
    await sleep(300);
    const res = await client.remove({ clusterId });

    const detail = await getClusterDetail(client.capi, clusterId);
    expect(res).toEqual(true);
    expect(detail.Status).toBe('isolated');
  });

  test('[SERVERLESS with minCpu and maxCpu] offline', async () => {
    await sleep(300);
    const res = await offlineCluster(client.capi, clusterId);
    expect(res).toBeUndefined();
  });
});