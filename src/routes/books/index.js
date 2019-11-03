const router = require('express').Router();
const ValidateField = require('../../utils/ValidateField');
const User = require('../../database/models/User');
const Book = require('../../database/models/Book');

router.post('/', [
    (req, res, next) => {
        const { id_user, title, description, publication_date, author } = req.body;
        ValidateField.validateJson({
            id_user: new ValidateField(id_user, false).number().required().custom(async () => {
                let user = await User.findById(id_user).catch(err => Promise.reject(err.message));
                if (user === undefined) return Promise.reject('Usuario invalido');
                else return Promise.resolve();
            }),
            title: new ValidateField(title, false).string().empty().maxLenght(40).required(),
            description: new ValidateField(description, false).string().empty().maxLenght(500).required(),
            publication_date: new ValidateField(publication_date, false).date().required(),
            author: new ValidateField(author, false).string().empty().maxLenght(30).required(),
        })
            .then(() => {
                req.book = Book.fromObject({ id_user, title, description, publication_date, author });
                next();
            })
            .catch(err => {
                res.status(400).json(err);
            });
    }
],
    (req, res) => {
        const book = req.book;

        Book.create(book)
            .then(() => res.status(201).end())
            .catch((err) => res.status(500).json({ message: err.message }));
    });

router.get('/:id', (req, res) => {
    const {id}=req.params;
    Book.findById(id)
        .then(data=>{
            if(data)res.json(data);
            else res.status(404).end();
        })
        .catch(err=>res.status(500).json({message:err.message}));
});

router.get('/', [
    (req, res, next) => {
        const { text_search, offset = 0, limit = 30 } = req.query;
        ValidateField.validateJson({
            text_search: new ValidateField(text_search, false).string().maxLenght(30),
            offset: new ValidateField(offset, false).number({ maxDecimal: 0 }, 'Debe ser un numero entero')
                .number({ minValue: 0 }, 'Debe ser mayor que 0'),
            limit: new ValidateField(limit, false).number({ maxDecimal: 0 }, 'Debe ser un numero entero').number({ minValue: 1 }, 'Debe ser mayor que 0'),
        })
            .then(() => next())
            .catch(err => res.status(400).json(err));
    },
], (req, res) => {
    const { text_search, offset = 0, limit = 30 } = req.query;
    Book.search({ textSearch: text_search, offset, limit })
        .then(result => {
            if (result) {
                res.json(result);
            }
            else res.status(404).end();
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            })
        })
});

router.use(require('./rankings'));
module.exports = router;