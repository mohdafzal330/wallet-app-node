const express = require("express");
const walletService = require('./services/wallet-service')
const baseUrl = '/api/wallet';

const app = express();
app.use(express.json());

//setup wallet 
app.post(baseUrl+'/setup',async (req,res) => {
    const walletName = req.body.name;
    const initialBalance = req.body.balance;
    const response = await walletService.setupWallet(walletName,initialBalance);
    res.send(response);
});

//make transaction into wallet
app.post(baseUrl+'/transact/:id',async (req,res) => {
    const walletId = req.params.id;
    const response = await walletService.transactWallet(walletId,req.body);
    res.send(response);
});

app.get(baseUrl+'/transactions',async (req,res)=>{
    const walletId = req.query.walletId;
    const skip = req.query.skip;
    const limit = req.query.limit;
    const response = await walletService.getWalletTransactions(walletId,skip,limit);
    res.send(response);
});

app.get(baseUrl+'/:id',async (req,res)=>{
    const walletId = req.params.id;
    const response = await walletService.getWalletDetails(walletId);
    res.send(response);
})

const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log('App is listning on port: 3000');
})