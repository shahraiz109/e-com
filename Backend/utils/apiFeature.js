class ApiFeatures{
    constructor(query,queryStar){
        this.query=query
        this.queryStar=queryStar
    }
    // search//

    search(){
        const keyword= this.queryStar.keyword
        ?{
            name:{
                $regex:this.queryStar.keyword,
                $options:"i"
            }
        }:{}
        this.query=this.query.find({...keyword})
        return this;
    }
    // Filters//

    filter(){
        const queryCopy= {...this.queryStar}
     
// removing some fields for category//
const removeFields= ["keyword","page","limit"]

removeFields.forEach(key=>delete queryCopy[key])

// filter for price and rating//
   console.log(queryCopy)
    let queryStr= JSON.stringify(queryCopy)
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key=> `$${key}`)

      this.query= this.query.find(JSON.parse(this.queryStr))
      console.log(queryStr)
      return this;
    }

    pagination(resultPerPage){
        const currentPage= Number(this.queryStr.page) || 1;
        const skip= resultPerPage * (currentPage - 1)
        this.query=this.query.limit(resultPerPage).skip(skip)
        return this
    }

    
}
module.exports=ApiFeatures