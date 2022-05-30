const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const jwt = require ('jsonwebtoken')
const validator = require('validator')

const reporterSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        validate(value){
            let emailReg = new RegExp('^[a-z0-9._%+-]+@[gmail|hotmail]+.[a-z]{2,4}$')
            if(!validator.isEmail(value) || !emailReg.test(value))
            {
                throw new Error ('please enter valid email')
            }
        }
    },
    age:{
        type:Number,
        defult:20,
        validate(value){
            if(value<0)
            {
                throw new Error('please enter right age')
            }
        }
    },
    password:{
        type:String,
        minlength:6,
        required:true,
        trim:true,
        validate(value)
        {
            let passReg = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')
            if(!passReg.test(value))
            {
                throw new Error ('password must be strong')
            }
        }
    },
    phone:{
        type:Number,
        // length:11,
        required:true,
        trim:true,
        validate(value){
            let phoneReg = new RegExp('/^01[0125][0-9](?=.{8})/')
            if(!phoneReg.test(value))
            {
                throw new Error('please enter right phone number')
            }
        }
    },
    tokens:
    [
        {
            type:String,
            required:true
        }
    ],
    avatar:{
        type:Buffer
    }


} )

////////////////////////////////////////////////////////////////////////////

reporterSchema.pre('save' , async function(){
    const reporter =this

    if(reporter.isModified('password'))

    reporter.password = await bcryptjs.hash(reporter.password , 8)
})
////////////////////////////////////////////////////////////////////////////////
reporterSchema.statics.findByCredentials = async(email , password)=>
{
    const reporter = await Reporter.findOne({email})
    if(!reporter)
    {
        throw new Error ('check email or password')
    }
    const isMatch = await bcryptjs.compare(password , reporter.password)
    if(!isMatch)
    {
        throw new Error ('check email or password')
    }
    return reporter
}
////////////////////////////////////////////////////////////////////////////
reporterSchema.methods.generateToken = async function()
{
    const reporter = this
    console.log(reporter)
    const token = jwt.sign({_id:reporter._id.toString()} , 'nodeCourse')
    reporter.tokens = reporter.tokens.concat(token)
    await reporter.save()
    return token 
}
/////////////////////////////////////////////////////////////////////////////////////
reporterSchema.methods.toJSON = function()
{
    const reporter = this
    const reporterObject = reporter.toObject()

    delete reporterObject.password
    delete reporterObject.tokens

    return reporterObject
}
///////////////////////////////////////////////////////////////////////////////////
reporterSchema.virtual('reports',{
    ref:'Report',
    localField:'_id',
    foreignField:'owner'
})




const Reporter = mongoose.model('Reporter' , reporterSchema)
module.exports = Reporter