const express = require('express')
const router = express.Router()
const auth = require('../middelware/auth')
const Report = require('../model/report')

//////////////////////////////////////////////////////////////////////post report
router.post('/reports' ,auth, async(req,res)=>
{
    try
    {
        const report = new Report({...req.body , owner:req.reporter._id})
        await report.save()
            res.status(200).send(report)

    }
    catch(e){
        res.status(400).send(e.message)
    }
})
//////////////////////////////////////////////////////////////////////////////////////////////get report
router.get('/reports' ,auth , async(req,res)=>
{
    try
    { 
        await req.report.populate('reports')
        res.send(req.reporter.report)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
////////////////////////////////////////////////////////////////////////////////////////////////////get report by id
router.get('/reports/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const report = await Report.findOne({_id,owner:req.reporter._id})
        if(!report){
          return  res.status(404).send('there is no report')
        }
        res.status(200).send(report)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
///////////////////////////////////////////////////////////////////////////////////////////////////// update report by id
router.patch('/reports/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const updates = Object.keys(req.body)
        const report = await Report.findOne({_id,owner:req.reporter._id})
        if(!report){
           return res.status(404).send('there is no report')
        }
        updates.forEach((news)=> report[news]=req.body[news])
        await report.save()
        res.send(report)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////delete report by id
router.delete('/reports/:id',auth,async(req,res)=>{
    
    try{
        const _id = req.params.id
           const report = await Report.findOneAndDelete({_id,owner:req.reporter._id})
           if(!report){
             return  res.status(404).send('there is no report')
           }
           res.status(200).send(report)
       }
       catch(e){
           res.status(500).send(e.message)
       }
   })
   ////////////////////////////////////////////////////////////////////////////////////////////////////////get data(reports) by owner
   router.get('/reporterData/:id' , auth , async(req,res)=>{
    try{
        const _id = req.params.id
        const report = await Report.findOne({_id,owner:req.reporter._id})
        if(!report){
            res.status(404).send('there is no report')
        }
        await report.populate('owner')
        res.status(200).send(report.owner)
    }
    catch(e)
    {
        res.status(500).send(e.message)
    }
})

module.exports=router