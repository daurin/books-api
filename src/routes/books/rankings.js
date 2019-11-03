let router =require('express').Router();
const ValidateField=require('../../utils/ValidateField');
const User=require('../../database/models/User');
const Book=require('../../database/models/Book');

router.post('/:id_book/ratings',[
    (req,res,next)=>{
        const {id_book}=req.params;
        const {id_user,vote,commentary}=req.body;
         ValidateField.validateJson({
                id_user:new ValidateField(id_user,false).number().required().custom(async () => {
                    let user= await User.findById(id_user).catch(err=>Promise.reject(err.message));
                    if(user===undefined)return Promise.reject('Usuario invalido');
                    else return Promise.resolve();
                }),
                id_book:new ValidateField(id_book,false).number().required().custom(async () => {
                    let book= await Book.findById(id_book).catch(err=>Promise.reject(err.message));
                    if(book===undefined)return Promise.reject('Libro invalido');
                    else return Promise.resolve();
                }),
                vote:new ValidateField(vote).accept(['-1','1']).required(),
                commentary:new ValidateField(commentary).string().maxLenght(50),
            })
                .then(()=>next())
                .catch(err=>{
                    res.status(400).json(err);
                });
    }
],
    (req,res)=>{
        const {id_book}=req.params;
        const {id_user,vote,commentary}=req.body;

        let book=Book.fromObject({id:id_book});
        book.createRatings({id_user,vote,commentary})
            .then(()=>res.status(201).end())
            .catch(err=>res.status(500).json({message:err.message}));
    }
);

module.exports=router;