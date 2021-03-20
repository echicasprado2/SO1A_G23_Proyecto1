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
    res.set('Access-Control-Allow-Origin', '*')
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
    res.set('Access-Control-Allow-Origin', '*')
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
    res.set('Access-Control-Allow-Origin', '*')
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
    res.set('Access-Control-Allow-Origin', '*')
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
    res.set('Access-Control-Allow-Origin', '*')
    res.json(docs)
})

router.route('/api/cases/lastfive').get(async(req,res) => {
    const docs = await Case.aggregate([
        {
            $sort:{"createdAt":-1}
        }, {"$limit":5}
    ])
    res.set('Access-Control-Allow-Origin', '*')
    res.json(docs)
})
//Rango de edades
router.route('/api/cases/agerange').get(async(req,res) => {
    const docs = await Case.aggregate([
        {
            $project: {
                "range": {
                    $concat: [
                        { $cond: [{$and:[ {$gt:["$age", 0 ]}, {$lt: ["$age", 10]}]}, "0-9", ""] },
                        { $cond: [{$and:[ {$gte:["$age",10]}, {$lt:["$age", 20]}]}, "10-19", ""]},
                        { $cond: [{$and:[ {$gte:["$age",20]}, {$lt:["$age", 30]}]}, "20-29", ""]},
                        { $cond: [{$and:[ {$gte:["$age",30]}, {$lt:["$age", 40]}]}, "30-39", ""]},
                        { $cond: [{$and:[ {$gte:["$age",40]}, {$lt:["$age", 50]}]}, "40-49", ""]},
                        { $cond: [{$and:[ {$gte:["$age",50]}, {$lt:["$age", 60]}]}, "50-59", ""]},
                        { $cond: [{$and:[ {$gte:["$age",60]}, {$lt:["$age", 70]}]}, "60-69", ""]},
                        { $cond: [{$and:[ {$gte:["$age",70]}, {$lt:["$age", 80]}]}, "70-79", ""]},
                        { $cond: [{$and:[ {$gte:["$age",80]}, {$lt:["$age", 90]}]}, "80-89", ""]},
                        { $cond: [{$and:[ {$gte:["$age",90]}, {$lt:["$age", 100]}]}, "90-99", ""]},
                        
                    ]
                }
            }
        },
        {
            $group: {
                _id:"$range",
                count: {$sum:1}
            }
        },
    ])
    res.set('Access-Control-Allow-Origin', '*')
    res.json(docs)
})
module.exports = router