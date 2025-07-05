const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const db = require('../config/database');

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Solo permitir imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});

// Obtener todas las fotos
router.get('/photos', (req, res) => {
  const query = 'SELECT * FROM photos ORDER BY created_at DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error obteniendo fotos:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.json(results);
  });
});

// Subir una nueva foto
router.post('/photos', upload.single('photo'), (req, res) => {
  const { title, description, category } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!imagePath) {
    return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
  }

  const query = 'INSERT INTO photos (title, description, image_path, category) VALUES (?, ?, ?, ?)';
  const values = [title, description, imagePath, category];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error subiendo foto:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    res.json({ 
      message: 'Foto subida exitosamente',
      id: result.insertId,
      imagePath: imagePath
    });
  });
});

// Eliminar una foto
router.delete('/photos/:id', (req, res) => {
  const photoId = req.params.id;

  // Primero obtener la información de la foto para eliminar el archivo
  db.query('SELECT image_path FROM photos WHERE id = ?', [photoId], (err, results) => {
    if (err) {
      console.error('Error obteniendo foto:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Foto no encontrada' });
    }

    const imagePath = results[0].image_path;
    const fullPath = path.join(__dirname, '../../public', imagePath);

    // Eliminar el archivo físico
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Eliminar de la base de datos
    db.query('DELETE FROM photos WHERE id = ?', [photoId], (err, result) => {
      if (err) {
        console.error('Error eliminando foto:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      
      res.json({ message: 'Foto eliminada exitosamente' });
    });
  });
});

// Obtener una foto específica
router.get('/photos/:id', (req, res) => {
  const photoId = req.params.id;
  
  db.query('SELECT * FROM photos WHERE id = ?', [photoId], (err, results) => {
    if (err) {
      console.error('Error obteniendo foto:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Foto no encontrada' });
    }
    
    res.json(results[0]);
  });
});

module.exports = router; 