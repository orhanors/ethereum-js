const assert = require("assert");
const ganache = require("ganache-cli"); //creates a local eth network
const Web3 = require("web3");
const { interface, bytecode } = require("../compile");

const web3 = new Web3(ganache.provider());

let accounts;
let inbox; //contract instance (respresented by JS object)

beforeEach(async () => {
	//Get a list of all accounts (Ganache local network gives default accounts)
	accounts = await web3.eth.getAccounts();

	//Use one of those accounts to deploy the contract
	//(Deploying a contract also is a transaction without recipient)
	inbox = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({
			data: bytecode,
			arguments: ["Hi there!"],
		})
		.send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
	it("deploys a contract", () => {
		assert.ok(inbox.options.address);
	});

	it("has a default message", async () => {
		const message = await inbox.methods.message().call(); //message is a public contract variable and it will have default message() method
		assert.strictEqual(message, "Hi there!");
	});

	it("can change the message", async () => {
		// We're attempting to change the contract status and it costs some amount of money.
		await inbox.methods.setMessage("Bye!").send({ from: accounts[0] });

		const message = await inbox.methods.message().call();
		assert.strictEqual(message, "Bye!");
	});
});
