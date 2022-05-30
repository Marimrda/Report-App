const express = require ('express')
const multer = require('multer')
const Reporter = require('../model/reporter')
const auth = require ('../middelware/auth')
const router = express.Router()

/////////////////////////////////////////////////////////////signup
router.post('/signup' ,async (req,res)=>
{
    try
    {
        const reporter = new Reporter(req.body)
        const token = await reporter.generateToken()
        await reporter.save()
        res.status(200).send({reporter , token})
    }
    catch(e)
    {
        res.status(400).send(e.message)
    }
})
//////////////////////////////////////////////////////////////////login
router.post('/login',async (req , res)=>
{
    try
    {
        const reporter = await Reporter.findByCredentials(req.body.email , req.body.password)
        const token = await reporter.generateToken()
        await reporter.save()
        res.status(200).send({reporter , token})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})
///////////////////////////////////////////////////////////////////////logout
router.delete('/logout' ,auth ,async(req,res)=>
{
    try
    {
        req.reporter.tokens=req.reporter.tokens.filter((ele)=>
        {
            return ele!=req.token
        })
        await req.reporter.save()
        res.send()
    }
    catch(e)
    {
        res.status(500).send(e)
    }
})
///////////////////////////////////////////////////////////////////////////////profile
router.get('/profile',auth,async(req,res)=>{
    try{
        res.send(req.reporter)
    }
    catch(e){
        res.status(500).send(e.message)
    }
    
})
//////////////////////////////////////////////////////////////////////////////////get reporters
router.get('/getall',auth , async(req,res)=>
{
    try
    {
        const reporter = await Reporter.find({})
        res.status(200).send(reporter)     
    }
    catch(e)
    {
        res.status(400).send(e.message)
    }
})
/////////////////////////////////////////////////////////////////////////////////////////get by id
router.get('/get/:id' ,auth, async(req,res)=>
{
    try
    {
        const reporter = await Reporter.findById(req.params.id)
        if(!reporter)
        {
            return res.status(404).send('Not Found Reporter')
        }
        res.status(200).send(reporter)
    }
    catch(e)
    {
        res.status(500).send(e.message)
    }
})

//////////////////////////////////////////////////////////////////////patch
router.patch('/update/:id',auth , async(req,res)=>
{
    try
    {
        const updates = Object.keys(req.body)
        console.log(updates)
        const reporter = await Reporter.findById(req.params.id )
        if(!reporter)
        {
            return res.status(404).send('Not Found Reporter')
        }
        updates.forEach((ele)=>
        {
            reporter[ele]=req.body[ele]
        })
        await reporter.save()
        res.status(200).send(reporter)
    }
    catch(e)
    {
        res.status(400).send(e.message)
    }
})
// //////////////////////////////////////////////////////////////////////delete
router.delete('/delete/:id',auth , async(req,res)=>
{
    try{
        const reporter = await Reporter.findByIdAndRemove(req.params.id)
        if(!reporter)
        {
            return res.status(404).send('Not Found Reporter')
        }
        res.status(200).send(reporter)

    }
    catch(e)
    {
        res.status(500).send(e.message)
    }
})
///////////////////////////////////////////////////////////////////////////logoutAll
router.delete('/logoutAll' ,auth ,async(req,res)=>
{
    try
    {
       const reporter = await Reporter.remove({})
       res.status(200).send(reporter)
    }
    catch(e)
    {
        res.status(500).send(e.message)
    }
})
//////////////////////////////////////////////////////////////////////////////////////get my reports
router.get('/myReports' , auth ,async (req, res)=>
{
    try
    {
        await req.reporter.populate('reports')
        res.send(req.reporter.reports)
    }
    catch(e)
    {
        res.status(500).send(e.message)
    }
})
/////////////////////////////////////////////////////////////////////////////////////////////multer
const uploads = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(file,cb){
        if(!file.originalname.match(/\.(txt|pdf|docx)$/)){
            cb(new Error('Please upload The File'))
        }
        cb(null,true)
    }
})
/////////////////////////////////////////////////////////////////////////////////////////////avatar
router.post('/profile/avatar',auth,uploads.single('avatar'),async(req,res)=>{
    try{
        req.reporter.avatar = req.file.buffer
        await req.reporter.save()
        res.send()
    }
    catch(e){
        res.status(400).send(e.message)
    }
})





module.exports = router