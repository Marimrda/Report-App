const jwt = require('jsonwebtoken')
const Reporter = require('../model/reporter')

const auth = async (req , res , next)=>
{
    try
    {
        const token = req.header('Authorization').replace('Bearer ' , '')
        console.log(token)
        const decode = jwt.verify(token,'nodeCourse')
        console.log(decode)
        const reporter = await Reporter.findOne({_id:decode._id , tokens:token})
        console.log(reporter)
        if(!reporter)
        {
            throw new Error ()
        }
        req.reporter = reporter
        req.token = token
        next()
    }
    catch(e)
    {
        res.status(401).send({error:'Error Happend'})
    }
}

module.exports= auth