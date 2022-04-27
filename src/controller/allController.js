const express = require('express');
const { default: mongoose } = require('mongoose');
const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")
 


const createAuthor = async(req, res) => {
     try{
         let data = req.body
        //  data validation
        
        if(Object.keys(data).length===0) return res.status(400).send({ status:false, msg: "plz ener some data" })

        // FirstName validation
        if(!data.firstName)  return res.status(400).send({ status:false, msg: "firstName must be present" });
        if(typeof data.firstName !== "string") return res.status(400).send({ status:false, msg: "firstName should be string" });

        // lastName validation
        if(!data.lastName)  return res.status(400).send({ status:false, msg: "Last name must be present" });
        if(typeof data.lastName !== "string") return res.status(400).send({ status:false, msg: "LastName should be string" });

        // title validation
        if(!data.title)  return res.status(400).send({ status:false, msg: "title must be present" });
        if(typeof data.title !== "string") return res.status(400).send({ status:false, msg: "title should be string" });
        if(!( ["Mr", "Mrs", "Miss"].includes(data.title))) return res.status(400).send({status: false,msg:"plz write valid title"})
        
        // email validation
        if(!data.email)  return res.status(400).send({ status:false, msg: "email must be present" });
        let y = data.email
        let regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z])+\.([a-z]+)(.[a-z])?$/
        let x = y.match(regx)
        if(!x) return res.send({status:false,msg:"write the correct format for email"})
         let mail = await authorModel.findOne({email:y})
         console.log(mail)
         if(!mail) return res.status(400).send({status: false,msg:"this email is already present"})

        // password validation
        if(!data.password)  return res.status(400).send({ status:false, msg: "plz write the password" });
        if(typeof data.firstName !== "string") return res.status(400).send({ status:false, msg: "title should be string" });

        let author = await authorModel.create(data)
        res.status(201).send({ status: true, Data: author })
    }
    catch(err){
        res.status(500).send({status: "error" , msg: err.message})
    }
}



const createBlogs = async function(req, res) {
    try {
        const data = req.body
        //  data validation
        
        if(Object.keys(data).length===0) return res.status(400).send({ status:false, msg: "plz ener some data" })
        // title validation
        if (!data.title) {
            return res.status(400).send({ status:false, msg: "title is not given" })
        }
        if(typeof data.title !== "string") return res.status(400).send({ status:false, msg: "title should be string" });

        // body validation
        if (!data.body) {
            return res.status(400).send({status:false, msg: "body is not Given" })
        }
        if(typeof data.title !== "string") return res.status(400).send({ status:false, msg: "body should be string" });
        
        // authorId validation
        let authorId = data.authorId
        if (!authorId) {
            return res.status(400).send({ status:false,msg: "authorId must be present" })
        }
        let idCheck =mongoose.isValidObjectId(authorId)
        if(!idCheck) return res.status(400).send({ status:false, msg: "authorId is not a type of objectId" })
        const id = await authorModel.findById(authorId)
        if (!id) {
            return res.status(404).send({ status: false, msg: "invalied authorId" })
        }

        if (!data.category) {
            return res.status(400).send({status:false, msg: "category must be present" })
        }

        const Blog = await blogModel.create(data)
        return res.status(201).send({ status: true, msg: Blog })
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}

const getBlogs = async function(req,res){
    try
    { let fil = req.query
         let keys = Object.keys(fil)
         console.log(keys)

        let idCheck =mongoose.isValidObjectId(fil.authorId)
        if(!idCheck) return res.status(400).send({ status:false, msg: "authorId is not a type of objectId" })

        console.log(fil)
        let data = await blogModel.find({$and:[{isDeleted:false} , {isPublished:true},fil]})       
        if(data.length === 0) return res.status(404).send({status:false , msg:"Blogs not found"})
        res.status(200).send({status: true ,Data :data})

    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: "error", error: err.message })
    }
}



const updateblogs = async (req,res)=>{
    
    let id = req.params.blogId
    if(!id) return res.status(400).send({ status:false, msg: "plz write the blogId" }) ;

    if(!mongoose.isValidObjectId(id)) return res.status(400).send({ status:false, msg: "its not the objectId" });
    
    let checkId = await blogModel.findById(id)

    console.log(checkId)
    if(!checkId)  return res.status(400).send({ status:false, msg: "No blog with this Id" });


    let data = req.body
    if(Object.keys(data).length===0) return res.status(400).send({ status:false, msg: "plz ener some data in body" })

    let updateBlog = await blogModel.findByIdAndUpdate(
        {_id:id},
        {$set:{title:data.title , body:data.body },
         $addToSet:{ tags : data.tags,subcategory :data.subcategory}},
        {new:true}
         )

         if(data["isPublished"]=== true){
            data["publishedAt"] = Date.now()
        }
        if(data["isDeleted"]=== true){
            data["deleteAt"] = Date.now()


        }

    res.send({status:true , data: updateBlog})

    
    

}



module.exports.createAuthor = createAuthor

module.exports.createBlogs = createBlogs
module.exports.getBlogs=getBlogs
module.exports.updateblogs=updateblogs
// module.exports.getfilter=getfilter

//module.exports.blogId = blogId