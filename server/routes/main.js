const express = require('express');
const router = express.Router();
const Post = require('../models/Post.js');


//Routes
//GET HOME
router.get('', async (req,res)=>{
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "Simple blog created with NodeJS, MongoDB and Express"
        }

            let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        // Count is deprecated - please use countDocuments
        // const count = await Post.count();
        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', { 
        locals,
        data,
        current: page,
        nextPage: hasNextPage ? nextPage : null,
        currentRoute: '/'
        });
    } catch (error) {
        console.log("Error");
    }
    








});

router.get('/about', (req,res)=>{
    res.render("about");
});

router.get('/contact', (req,res)=>{
    res.render("contact");
});

//GET Post :id
router.get('/post/:id', async (req,res)=>{
    try {
        let slug = req.params.id;



        const data = await Post.findById({ _id: slug})
        // sending locals. as data to dynamically load into the layout 

        const locals = {
            title: data.title ,
            //description: "Simple blog created with NodeJS, MongoDB and Express" MAYBE INCORPORATE INTO DATABASE
        }

        res.render("post", { locals, data });
    } catch (error) {
        console.log("Error");
    }
});

// GET Post: searchterm
router.post('/search', async (req,res)=>{
    try {
        const locals = {
            title: "Search",
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
        const data = await Post.find({
            $or: [
              { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
              { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
            ]
          });



        //res.render("search", { locals, data });
        res.render("search", {
            data,
            locals,
          });
    } catch (error) {
        console.log("Error");
    }
});










module.exports = router;



// function insertPostData (){
//     Post.insertMany([
//         {
//             title: "Dead Internet Theory",
//             body: "Is all of this webdev stuff worth it in the end? Doesn't matter as long as I enjoy it right?"

//         },
//     ])
// }
// insertPostData();





//WITHOUT PAGINATION
// router.get('', async (req,res)=>{
//     const locals = {
//         title: "NodeJs Blog",
//         description: "Simple blog created with NodeJS, MongoDB and Express"
//     }
    
//     try {
//         const data = await Post.find()
//         // sending locals. as data to dynamically load into the layout 
//         res.render("index", { locals, data });
//     } catch (error) {
//         console.log("Error");
//     }
// });