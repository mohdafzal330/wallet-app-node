const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/wallet-db')
    .then(()=>{console.log('DB Connection Successfull');})
    .catch(err=>console.log('DB Connection Failed, ',err));

const walletSchema = new mongoose.Schema({
    name:String,
    balance:{type:Number,default:0},
    date: {type: Date, default: Date.now}
});

const Wallet = mongoose.model('Wallet',walletSchema);

const transactionSchema = new mongoose.Schema({
    walletId: Object,
    amount:Number,
    balance:Number,
    type: String,
    description: String,
    date: {type: Date, default: Date.now}
});
const Transaction = mongoose.model('Transaction',transactionSchema);


module.exports.Wallet = Wallet;
module.exports.Transaction = Transaction;