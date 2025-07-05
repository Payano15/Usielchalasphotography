const mysql = require('mysql2');

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root', // Cambia por tu usuario de MySQL
  password: '', // Cambia por tu contraseña de MySQL
  database: 'fotografo_db', // Nombre de la base de datos
  port: 3306
};

// Crear conexión
const connection = mysql.createConnection(dbConfig);

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
  
  // Crear la tabla si no existe
  createTable();
});

// Función para crear la tabla de fotos
function createTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS photos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      image_path VARCHAR(500) NOT NULL,
      category VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  
  connection.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creando la tabla:', err);
      return;
    }
    console.log('Tabla photos creada o ya existente');
  });
}

module.exports = connection; 