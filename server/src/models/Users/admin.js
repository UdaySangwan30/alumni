const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const validator = require("validator")
const jwt = require("jsonwebtoken");


const adminSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true , "Please enter your email"],
        unique:true,
        validate:validator.isEmail,
    },
    password:{
        type:String,
        required:[true , "Please enter your password"], 
        minLength:[8,"password must be atleast 8 characters"],
    },
    tokens:[{
        token:{
            type:String,
        }
    }],
    
})


adminSchema.methods.generateAuthTokenAdmin=async function(){
    try{
        const token= jwt.sign({_id:this._id.toString()},"usdhfiasgdfiasdfbhisadhbfisaduf")
        this.tokens=this.tokens.concat({token:token})
        await this.save()
        return token
        
    }
    catch(error){
        console.log(error);
    }
}


adminSchema.pre("save",async function (next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,5)
    }
})


const Admin= mongoose.model("Admin",adminSchema);
module.exports=Admin;
