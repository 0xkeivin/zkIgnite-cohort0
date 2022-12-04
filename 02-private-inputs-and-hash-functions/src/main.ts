import { IncrementSecret } from "./IncrementSecret.js";
import {
    isReady,
    shutdown,
    Field,
    Mina,
    PrivateKey,
    PublicKey,
    AccountUpdate,
    Poseidon
} from 'snarkyjs'

(async function main() {
    await isReady
    console.log("SnarkyJS loaded")

    const Local = Mina.LocalBlockchain()
    Mina.setActiveInstance(Local)
    const deployerAccount = Local.testAccounts[0].privateKey

    // --------------------------------------
    const salt = Field.random()

    // create a public/private key pair for the contract
    const zkAppPrivateKey = PrivateKey.random()
    const zkAppAddress = zkAppPrivateKey.toPublicKey()
    // Deploy the contract
    const zkAppInstance = new IncrementSecret(zkAppAddress)
    const deployTxn = await Mina.transaction(deployerAccount, () => {
        AccountUpdate.fundNewAccount(deployerAccount)
        zkAppInstance.deploy({ zkappKey: zkAppPrivateKey })
        zkAppInstance.initState(salt, Field(750))
        zkAppInstance.sign(zkAppPrivateKey)
    })
    await deployTxn.send()

    // get initial state of IncrementSecret after deployment
    const num0 = zkAppInstance.x.get()
    console.log("State after init 'x':", num0.toString())

    // Create transaction to update the contract
    // State value must equal to initState value else will fail assertEqual
    const txn1 = await Mina.transaction(deployerAccount, () => {
        zkAppInstance.incrementSecret(salt, Field(750))
        zkAppInstance.sign(zkAppPrivateKey)
    })
    await txn1.send()
    // get state of IncrementSecret after update
    const num1 = zkAppInstance.x.get()
    console.log("State after update init 'x':", num1.toString())

    // Shutdown
    console.log("Shutting down...")
    await shutdown()



})();