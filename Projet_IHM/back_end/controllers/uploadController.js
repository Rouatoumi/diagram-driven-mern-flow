const path = require('path');

exports.uploadImages = (req, res) => {
  console.log(req.files);
  
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }

  // Build correct public URLs for uploaded images
  const imagePaths = req.files.map(file => {
    // Remove full local path and replace backslashes
    const relativePath = file.path.replace(/\\/g, '/').replace('C:/Users/Lenovo/Projet_IHM/back_end/', '');
    const fullUrl = `http://localhost:3000/${relativePath}`;
    return fullUrl;
  });

  console.log("imagePaths in uploadController:", imagePaths);

  res.status(200).json({ imagePaths });
};
