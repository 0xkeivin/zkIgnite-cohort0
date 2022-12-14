# zkIgnite-cohort0

## overview
1. Typescript support
- zkApps written in SnarkyJS
- can run proofs in browser
2. Unlimited off-chain computation
- execute zkApps off-chain, privately and send ZK proof on-chain
- can generate batches of proofs into single proof

## Setup
- https://github.com/o1-labs/zkapp-cli
```
npm install -g zkapp-cli
```

## zkApps
- up to 8 fields of on-chain state each storing 32 bytes of arbitrary data
- `proof authorization` allows users to alter zkApp account state if transaction is generated by zkApp
- `Signature authorization` allows whomever deployed the smart contract to edit it (owner only?)
- **inputs** passed to smart contract is private ! (only zkApp can see it)

## Tutorial 2 - Private Inputs and Hash Functions
- all inputs to a smart contract are private by default unless the Developer chose to store values on-chain state in zkApp Account

## Tutorial 3 - Deploying to network
- `zk config` configures cli deployments

## Tutorial 4 - Proof Authorization
```
cd contracts 
npm run build

zk deploy berkeley
# returned https://berkeley.minaexplorer.com/transaction/CkpZajqcj8EA74fEkU5YGhotxt776GruCEZpETa8vBNDTHL2WUMao 

```
- web app checks and logs in user based on key in Auro wallet 

## Tutorial 5 - Common Types and Functions
- `CircuitString` currently only supports fixed length strings of 128 characters 
- dynamic length strings support to be added in future
- `Witness` represents merkle path to the data which inclusion is proven 

## Tutorial 6 - Off-chain storage
- 3 pieces of state in contract
a) public key of storage server
b) storageNumber itself
c) storageTreeRoot - root of merkle tree

## Tutorial 7 - Oracles
- oracles retrieve data from the outside world
- example fetches mock credit score and creates attestations for it
- Mina's zkOracles allow trustless retrieval of data from the outside world in future
- Data providers can act as response signers and hence do without intermediaries
### Design
- fetch data from desired source
- sign data with Mina-compatible private key and returns data, signature and public key
- signature can be verified by zkApp

### Response format
1. Data - JSON payload of customized data
2. Signature  - r and s fields of ECDSA signature which are unique codes dervied form message and private key
3. Public key

### Demo Oracle endpoints
https://mina-credit-score-signer-pe3eh.ondigitalocean.app/user/1
https://mina-credit-score-signer-pe3eh.ondigitalocean.app/user/2