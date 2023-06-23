const express = require("express");
const router = express.Router();
const reclamation = require("../models/reclamation") ;
const Type = require("../models/type");

///Ajouter une reclamation 
router.post("/type", async(req,res)=>{
        const Types = await new Type({
       type:req.body.type
       
     
    })
   
    try{
        
        const saveTypes = await Types.save();
   
            res.send( saveTypes);
    }catch(err){
        res.send({message:err})
    }
    });



module.exports=router;