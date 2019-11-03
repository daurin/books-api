var pool=require('../dbPool.js');

class User{
    constructor(){
        this.id;
        this.name;
    }

    static fromObject(obj){
        let user=new User();
        Object.assign(user,obj);
        return user;
    }

    static findByFields(fields,operator='AND'){
        let query=`SELECT * FROM USER WHERE `;
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

    static create(user){
        return pool.query(`INSERT INTO USER SET ?`,user);
    }
}

module.exports=User;