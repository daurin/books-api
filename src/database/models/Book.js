var pool=require('../dbPool.js');

class Job{
    constructor(){
        this.id;
        this.id_user;
        this.title;
        this.description;
        this.publication_date;
        this.author;
        //this.job_detail=[];
    }
    
    createRatings(rating={id_user,vote,commentary}){
        rating.id_book=this.id;
        return pool.query(`INSERT INTO RATING SET ?`,rating);
    }

    static create(book){
        return pool.query(`INSERT INTO BOOK SET ?`,book);
    }


    static fromObject(obj){
        let book=new Job();
        Object.assign(book,obj);
        return book;
    }

    static findByFields(fields,operator='AND'){
        let query='SELECT BOOK.*,IFNULL(SUM(RATING.vote),0) as total_votes FROM BOOK '+
            'LEFT JOIN RATING ON RATING.id_book = BOOK.id WHERE ';
        let wheres=[];
        let entries= Object.entries(fields);
        for (const item of entries) {
            wheres.push(item[0] + ' = ' + pool.escape(item[1]));
        }
        query +=wheres.join(` ${operator} `);

        return pool.query(query)
            .then((result)=>{
                if(result.length===0)Promise.resolve(undefined);
                else return Promise.resolve(this.fromObject(result[0]));
            });
    }

    static findById(id){
        return this.findByFields({id});
    }

    static search(options={
            textSearch:'',
            equalsAnd:[{}],
            offset:0,
            limit:30,
            resultModels:false,
        }){
        const {textSearch='',offset=0,limit=10,resultModels=true,equalsAnd={}} =options;

        let query='SELECT BOOK.*,IFNULL(SUM(RATING.vote),0) as total_votes,COUNT(BOOK.id) OVER() AS total_rows FROM BOOK '+
            'LEFT JOIN RATING ON RATING.id_book = BOOK.id ',
            whereOr=[],whereAnd=[];

        // Where
        if(textSearch.length>0){
            let textSearchSplit=textSearch.trim().replace(/\s\s+/g,' ').split(' ');

            whereOr.push('MATCH(BOOK.title,BOOK.author) '+
            `AGAINST('${textSearchSplit.map(v=>{
                return '+'+v+'*';
            }).join(' ')}' IN BOOLEAN MODE)`);
        }

        if(Object.keys(equalsAnd).length>0){
            for (const key in equalsAnd)whereAnd.push(`${key}=${pool.escape(equalsAnd[key])}`);
        }
        let where=[];
        if(whereAnd.length>0)where.push(whereAnd.join(' AND '));
        if(whereOr.length>0)where.push(whereOr.join(' OR '));
        if(where.length>0)query+=' WHERE '+where.join(' AND ');

        // Group
        query+='GROUP BY BOOK.id ';

        // Sort
        query+='ORDER BY BOOK.publication_date desc ';

        // Pagination
        if (offset >= 0 && limit > 0) query += `LIMIT ${offset},${limit}`;
        else if (options.limit > 0) query += `LIMIT ${limit}`;

        return pool.query(query)
            .then((res)=>{
                let result = {};

                if (resultModels === true) {
                    let models = [];
                    for (const item of res) {
                        let job = new Job();
                        job=Job.fromObject(item);
                        if (job.hasOwnProperty('total_rows')) delete job.total_rows;
                        models.push(job);
                    }
                    result.data = models;
                }
                else result.data = res;

                let totalItemsLimit = res.length > 0 ? res[0].total_rows : 0;
                result.pagination = {
                    items: res.length,
                    pages: res.length>0?Math.ceil(totalItemsLimit / res.length):0,
                    totalItems: totalItemsLimit
                }
                if (result.pagination.pages===NaN) delete res.pagination.pages;
                return Promise.resolve(result);
            });
    }
}

module.exports=Job;