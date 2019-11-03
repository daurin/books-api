const router=require('express').Router();
const ValidateField=require('../../utils/ValidateField');
const User=require('../../database/models/User');

router.post('/',
    [
        (req,res,next)=>{
            const {name}=req.body;
            ValidateField.validateJson({
                name:new ValidateField(name,false).string().empty().maxLenght(15).required(),
            })
                .then(()=>{
                   req.user=User.fromObject({name});
                   next();
                })
                .catch(err=>{
                    console.log(err);
                    res.status(400).json(err);
                });
        }
    ],
    (req,res)=>{
        let user=req.user;
        User.create(user)
            .then(()=>res.status(201).end())
            .catch((err)=>res.status(500).json({message:err.message}));
    }
);
module.exports=router;