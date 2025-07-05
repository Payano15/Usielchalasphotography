const db = require('./config/database');

// Datos de ejemplo para las fotos
const samplePhotos = [
    {
        title: "Gala Elegante",
        description: "Evento de gala con vestimenta formal y ambiente sofisticado",
        image_path: "images/Gala/Gala1.jpg",
        category: "gala"
    },
    {
        title: "Ceremonia de Graduación",
        description: "Momentos especiales de la ceremonia de graduación",
        image_path: "images/Graduacion/Graduacion1.jpg",
        category: "graduacion"
    },
    {
        title: "Celebración de Quinceaños",
        description: "Fiesta de quince años con decoración temática",
        image_path: "images/quinceanos/quince1.jpg",
        category: "quinceanos"
    }
];

// Función para insertar las fotos de ejemplo
function seedDatabase() {
    console.log('Insertando fotos de ejemplo...');
    
    samplePhotos.forEach((photo, index) => {
        const query = 'INSERT INTO photos (title, description, image_path, category) VALUES (?, ?, ?, ?)';
        const values = [photo.title, photo.description, photo.image_path, photo.category];
        
        db.query(query, values, (err, result) => {
            if (err) {
                console.error(`Error insertando foto ${index + 1}:`, err);
            } else {
                console.log(`Foto "${photo.title}" insertada exitosamente`);
            }
        });
    });
}

// Ejecutar si se llama directamente
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase }; 