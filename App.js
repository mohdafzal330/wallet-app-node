const express = require("express");
const baseUrl = '/api/wallet';


const app = express();

//setup wallet
app.post(baseUrl+'/setup',(req,res) => {
    const params = req.params;
    const walletName = req.body.name;
    const initialBalance = req.body.balance;
    res.send('Wallet created '+walletName);
});

//make transaction into wallet
app.post(baseUrl+'/transact/:id',(req,res) => {
    const walletId = req.params.id;
    const amount = +req.body.balance;
    if(isNaN(walletId)){
        return res.send(400);
    }
    res.send('Done '+walletId);
});

app.get(baseUrl+'/transactions',(req,res)=>{
    const walletId = req.query.walletId;
    const skip = req.query.skip;
    const limit = req.query.limit;
    console.log(walletId,skip,limit);
    res.send('data ');
});

app.get(baseUrl+'/:id',(req,res)=>{
    const walletId = req.params.id;
    if(isNaN(walletId)){
        res.send(400);
    }
    res.send('Details '+walletId);
})

app.listen(3000,()=>{
    console.log('App is listning on my port: 3000');
})