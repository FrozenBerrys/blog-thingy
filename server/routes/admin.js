const express = require('express');
const router = express.Router();
const Post = require('../models/Post.js');
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const adminLayout = '../views/layouts/admin';

const authMiddleware = (req, res, next ) => {
    const token = req.cookies.token;
  
    if(!token) {
      return res.status(401).json( { message: 'Unauthorized'} );
    }
  
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
      next();
    } catch(error) {
      res.status(401).json( { message: 'Unauthorized'} );
    }
  } //logout if cookie not present
  

//GET HOME
//Admin login page

router.get('/admin', async (req,res)=>{
    try {
        const locals = {
            title: "Admin",
        }
        res.render("admin/index", { locals, layout : adminLayout});
    } catch (error) {
        console.log(error);
    }
});

// POST 
// Admin login page

router.post('/admin', async (req,res)=>{
    try {
        const {username, password} = req.body;

        const user = await User.findOne( {username} );

        if(!user){
            return res.status(401).json( { message: 'Invalid Credentials 1'} );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json( { message: 'Invalid Credentials'} );
        }

        const token = jwt.sign({userId: user._id}, jwtSecret);
        res.cookie('token', token,  {httpOnly : true} );

        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }
});

router.get('/dashboard', authMiddleware, async (req,res)=>{
    try {
        const locals = {
            title: 'Dashboard',
            description: 'Welcome, Master'
        }


        const data = await Post.find()
        res.render('admin/dashboard', {locals, data, layout : adminLayout});
    } catch (error) {
        console.log(error);
    }
});

// GET :CREATE NEW POST
//
//
router.get('/add-post', authMiddleware, async (req, res) => {
    try {
      const locals = {
        title: 'Add Post',
        description: 'Simple Blog created with NodeJs, Express & MongoDb.'
      }
  
      const data = await Post.find();
      res.render('admin/add-post', {
        locals,
        layout: adminLayout
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });

router.post('/add-post', authMiddleware, async (req, res) => {
    try {
      try {
        const newPost = new Post({
          title: req.body.title,
          body: req.body.body
        });
  
        await Post.create(newPost);
        res.redirect('/dashboard');
      } catch (error) {
        console.log(error);
      }
  
    } catch (error) {
      console.log(error);
    }
  });

router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
  
      const locals = {
        title: "Edit Post",
        description: "Free NodeJs User Management System",
      };
  
      const data = await Post.findOne({ _id: req.params.id });
  
      res.render('admin/edit-post', {
        locals,
        data,
        layout: adminLayout
      })
   
    } catch (error) {
      console.log(error);
    }
  
  });

router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
  
      await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now()
      });
  
      res.redirect(`/edit-post/${req.params.id}`);
  
    } catch (error) {
      console.log(error);
    }
  
  });

router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

    try {
      await Post.deleteOne( { _id: req.params.id } );
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }
  
  });


router.get('/logout', (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
    res.redirect('/');
  });
  

module.exports = router;


// async function addUser(username, password) {
//     try {
//         // Hash the password using bcrypt
//         const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

//         // Create a new user document
//         const newUser = new User({
//             username: username,
//             password: hashedPassword,
//         });

//         // Save the new user to the database
//         await newUser.save();
//         console.log('User added successfully.');
//     } catch (error) {
//         console.error('Error adding user:', error);
//     }
// }

// // Usage example: Replace 'admin' and 'adminPassword' with actual username and password values
// addUser('admin', 'adminpassword');