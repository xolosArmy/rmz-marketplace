const escrowController = require('../controllers/escrowController');
const ecashService = require('../services/ecashService');
const Escrow = require('../models/Escrow');

jest.mock('../services/ecashService');

jest.mock('../models/Escrow', () => {
  const data = {};
  return {
    create: jest.fn(async (doc) => {
      const obj = {
        _id: 'escrow1',
        status: 'LOCKED',
        ...doc,
        save: async function () {
          data[this._id] = this;
        },
      };
      data[obj._id] = obj;
      return obj;
    }),
    findById: jest.fn(async (id) => data[id]),
  };
});

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe('Escrow controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('happy flow', async () => {
    const req = {
      body: { orderId: 'o1', buyer: 'b1', seller: 's1', amountXEC: 5, buyerToken: { amount: 5, proofs: ['p'] } },
    };
    const res = mockRes();
    ecashService.lockFunds.mockResolvedValue({});
    await escrowController.lockEscrow(req, res);

    expect(ecashService.lockFunds).toHaveBeenCalledWith(req.body.buyerToken, 'escrow1', 5);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json.mock.calls[0][0]).toMatchObject({ _id: 'escrow1', status: 'LOCKED' });

    const releaseReq = { body: { escrowId: 'escrow1' } };
    const releaseRes = mockRes();
    ecashService.releaseFunds.mockResolvedValue('token-seller');
    await escrowController.releaseEscrow(releaseReq, releaseRes);

    expect(ecashService.releaseFunds).toHaveBeenCalled();
    expect(releaseRes.json).toHaveBeenCalledWith({ escrow: expect.any(Object), sellerToken: 'token-seller' });
  });

  test('lock funds failure sets dispute', async () => {
    const req = {
      body: { orderId: 'o2', buyer: 'b2', seller: 's2', amountXEC: 5, buyerToken: { amount: 5, proofs: ['p'] } },
    };
    const res = mockRes();
    ecashService.lockFunds.mockRejectedValue(new Error('invalid'));
    await escrowController.lockEscrow(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0]).toEqual({ error: 'invalid' });
    const escrow = await Escrow.findById('escrow1');
    expect(escrow.status).toBe('DISPUTE');
  });
});
