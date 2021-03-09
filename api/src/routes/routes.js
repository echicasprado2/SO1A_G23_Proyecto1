const express = require('express')
const { json } = require('body-parser')

let router = express.Router()

router.route('/api/data').post((req,res)=>{
    const data = req.body
    //Simulate traffic type
    data.type = 'msqRabbit'


    
    res.send('OK')
})

module.exports = router