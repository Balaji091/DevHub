const express=require('express')
const ProfileRouter=express.Router()
const userAuthCheck=require('../middlewares/auth')
const {validateAllowedFields}=require('../utils/validation')
const User = require('../models/userModel')
const bcrypt=require('bcrypt')
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_').toLowerCase();
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ok = /image\/(jpeg|png|webp|gif)/.test(file.mimetype);
  if (!ok) return cb(new Error('Only image files are allowed'), false);
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter
});

ProfileRouter.get('/profile',userAuthCheck,async(req,res)=>{
    try{
       
         res.send(req.user)
    }
    catch(err){
        res.status(400).send(err.message)   
    }
})

// ProfileRouter.js (or wherever your router lives)
ProfileRouter.patch('/profile', userAuthCheck, (req, res) => {
  const isMultipart = req.is('multipart/form-data');

  const ALLOWED_FIELDS = [
    'age', 'gender', 'about', 'skills', 'photoUrl',
    'company', 'location', 'jobTitle', 'firstName',
    'lastName', 'githubUrl', 'linkedInUrl', '_id', 'email'
  ];

  const processUpdate = async () => {
    try {
      const body = req.body;

   if (req.file) {
  // Instead of saving local path, save a proper URL
  body.photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
}

      // if skills can arrive as a string when multipart, normalize it
      if (typeof body.skills === 'string') {
        try {
          const parsed = JSON.parse(body.skills);
          body.skills = Array.isArray(parsed) ? parsed : [];
        } catch {
          body.skills = body.skills.split(',').map(s => s.trim()).filter(Boolean);
        }
      }

      const isUpdateAllowed = validateAllowedFields(body);
      if (!isUpdateAllowed) {
        return res.status(400).json({ error: 'Updation is not allowed' });
      }

      const loggedUser = req.user;
      Object.keys(body).forEach(key => {
        // allow photoUrl as well
        if (ALLOWED_FIELDS.includes(key) || key === 'photoUrl') {
          loggedUser[key] = body[key];
        }
      });

      await loggedUser.save();

      const profile = {};
      ALLOWED_FIELDS.forEach(k => (profile[k] = loggedUser[k]));

      res.json({
        message: 'Profile updated successfully',
        profile
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  if (isMultipart) {
    upload.single('photo')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      processUpdate();
    });
  } else {
    processUpdate();
  }
});



ProfileRouter.patch('/profile/password',userAuthCheck,async(req,res)=>{
    try{
        const user=req.user;
        const changedPassword=req.body.changedPassword
        const changedPasswordHash=await bcrypt.hash(changedPassword,10)
        await User.findByIdAndUpdate({_id:user._id},{password:changedPasswordHash})
        res.send("password changed succesfully")

    }
    catch(err){
        res.status(404).send(err.message)
    }
})
module.exports=ProfileRouter
