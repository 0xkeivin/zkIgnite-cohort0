import { Square } from './Square.js';
import {
  isReady, // async promise
  shutdown,
  Field,
  Mina, // local Mina blockchain
  PrivateKey,
  AccountUpdate, // allows updates to the zkApps accounts
} from 'snarkyjs';

(async function main() {
  await isReady;
  console.log('SnarkJS loaded');

  const Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);
  const deployerAccount = Local.testAccounts[0].privateKey;

  // ------------------ Deploy the contract ------------------

  // Create a public/private key pair for the contract
  const zkAppPrivateKey = PrivateKey.random();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();

  // Create an instance of Square smart contract and deploy to zkAppAddress
  const contract = new Square(zkAppAddress);
  const deployTxn = await Mina.transaction(deployerAccount, () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    contract.deploy({ zkappKey: zkAppPrivateKey });
    contract.sign(zkAppPrivateKey);
  });

  await deployTxn.send();

  // Get the initial state of zkApp account after deployment
  const num0 = contract.num.get();
  console.log("State after init 'num':", num0.toString());

  // ------------------ Update the contract ------------------

  const txn1 = await Mina.transaction(deployerAccount, () => {
    // update value to 9
    contract.update(Field(9));
    contract.sign(zkAppPrivateKey);
  });

  await txn1.send();

  const num1 = contract.num.get();
  console.log("State after update 'num':", num1.toString());

  // ------------------ Update the contract ------------------
  try {
    const txn2 = await Mina.transaction(deployerAccount, () => {
      // update value to 75 but this should fail
      contract.update(Field(75));
      contract.sign(zkAppPrivateKey);
    });

    await txn2.send();
  } catch (error) {
    console.log(error);
  }
  const num2 = contract.num.get();
  console.log("State after failed update 'num':", num2.toString());
  // ------------------ Update the contract ------------------

  const txn3 = await Mina.transaction(deployerAccount, () => {
    // update value to 81 which is expected
    contract.update(Field(81));
    contract.sign(zkAppPrivateKey);
  });
  await txn3.send();

  const num3 = contract.num.get();
  console.log("State after successful update 'num':", num3.toString());

  // ------------------ Shutdown ------------------
  console.log('Shutting Down');

  await shutdown();
})();
