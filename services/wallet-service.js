const dbSchemas = require('../shared/db-schemas');
const Transaction = dbSchemas.Transaction;
const Wallet = dbSchemas.Wallet;

async function setupWallet(name,initialBalance){
    if(!name){
        return {status:'Error', errorMessage: 'Wallet name is required'};
    }
    const wallet = new Wallet({
        name: name
    });
    const walletResponse = await wallet.save();
    if(walletResponse._id){
        const transactionResponse = await transactWallet(walletResponse._id.toString(),{amount:initialBalance});
        await wallet.update({name:name,balance:initialBalance});
        return {
            status:'Success',
            id: walletResponse._id,
            balance: initialBalance,
            transactionId: transactionResponse.transactionId,
            name: name,
            date: walletResponse.date
        }
    }
    return {status:'Error', errorMessage: 'Something went wrong'};
}
async function transactWallet(walletId,data){
    if(!walletId){
        return {status:'Error', errorMessage: 'Wallet ID is required'};
    }
    const wallet = await Wallet.findById(walletId);
    if(!wallet){
        return {status:'Error', errorMessage: 'Wallet ID is not valid'};
    }
    data.balance = wallet.balance;
    let transaction;
    if(data.amount>0){
        transaction = await creditWallet(walletId,data);
    } else{
        transaction = await debitWallet(walletId,data);
    }
    if(transaction){
        await wallet.update({balance:transaction.balance});
        return transaction;
    }
    return {status:'Error', errorMessage: 'Something went wrong'};
}
async function creditWallet(walletId,data){
    if(!walletId){
        return {status:'Error', errorMessage: 'Wallet ID is required'};
    }

    const trnsaction = new Transaction({
        walletId: walletId,
        type:'Credit',
        description: data.description,
        amount: data.amount,
        balance: parseFloat(data.balance) + parseFloat(data.amount)
    });
    const result = await trnsaction.save();
    return {transactionId:result._id,balance: trnsaction.balance};
}
async function debitWallet(walletId,data){
    if(!walletId){
        return {status:'Error', errorMessage: 'Wallet ID is required'};
    }
    const trnsaction = new Transaction({
        walletId: walletId,
        type:'Debit',
        description: data.description,
        amount: data.amount,
        balance: data.balance + parseFloat(data.amount)
    });
    const result = await trnsaction.save();
    return {transactionId:result._id,balance: trnsaction.balance};
}
async function getWalletTransactions(walletId,skip,limit){
    if(!walletId){
        return {status:'Error', errorMessage: 'Wallet ID is required'};
    }
    return await Transaction.find({walletId:walletId}).skip(skip).limit(limit);
}

async function getWalletDetails(walletId){
    if(!walletId){
        return {status:'Error', errorMessage: 'Wallet ID is required'};
    }
    const result = await Wallet.findById(walletId);
    if(!result){
        return {status:'Error', errorMessage: 'Wallet ID is invalid'};
    }
    return {
        id: result._id,
        name: result.name,
        balance: result.balance,
        date: result.date,
    };
}

//Exporting the service method in the form of modules
module.exports.setupWallet = setupWallet;
module.exports.transactWallet = transactWallet;
module.exports.getWalletTransactions = getWalletTransactions;
module.exports.getWalletDetails = getWalletDetails;