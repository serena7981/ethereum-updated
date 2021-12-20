const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { abi, evm } = require('../compile');
const INITIAL_STRING = 'Hi there!';

let accounts;
let inbox;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(abi)
        .deploy({
            data: evm.bytecode.object,
            arguments: [INITIAL_STRING]
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        });
});

describe('Inbox contract', () => {
    it ('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it ('initializes an Inbox with a message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
    });

    it('can set a new message', async () => {
        await inbox.methods.setMessage('byeeee').send({
            from: accounts[0]
        });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'byeeee');
    });
});