const express = require('express')
const { json } = require('body-parser')
const mongoose = require('mongoose')
const Case = require('../models/case')
const getRegion = require('../utils/region')

let router = express.Router()

router.route('/api/data').post((req,res)=>{
    const data = req.body
    //Simulate traffic type
    data.type = 'msqRabbit'
    data._id = mongoose.Types.ObjectId()
    data.region = getRegion(data.location)

    console.log(data)
    let cases = new Case(data)
    cases.save(function(err,cases){
        if(err) return console.log("ERORR")
        console.log("Data Saved")
    })

    res.send('OK')
}).get(async(req,res)=>{
    const docs = await Case.aggregate([
        {
            $sort:{"createdAt":-1}
        }
    ])
    res.json(docs)
})

router.route('/api/cases/departments/top5').get(async(req,res)=>{
    const docs = await Case.aggregate([
        {$group:{
            _id:"$location",
            count:{$sum:1}
        }},
        {$sort:{"count":-1}},
        {"$limit":5}
    ])
    res.json(docs)
})

router.route('/api/cases/regiontop').get(async(req,res) => {
    const docs = await Case.aggregate([
        {$group:{
            _id:"$region",
            count:{$sum:1}
        }},
        {$sort:{"count":-1}},
        {"$limit":1}
    ])
    res.json(docs)
})

router.route('/api/cases/state/all').get(async(req,res) => {
    const docs = await Case.aggregate([
        {
            $group:{
                _id:"$state",
                count:{$sum:1}
            }
        }
    ])
    res.json(docs)
})

router.route('/api/cases/infectedtype/all').get(async(req,res) => {
    const docs = await Case.aggregate([
        {
            $group:{
                _id:"$infectedtype",
                count:{$sum:1}
            }
        }
    ])
    res.json(docs)
})

router.route('/api/cases/lastfive').get(async(req,res) => {
    const docs = await Case.aggregate([
        {
            $sort:{"createdAt":-1}
        }, {"$limit":5}
    ])
    res.json(docs)
})

module.exports = router