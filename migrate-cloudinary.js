// migrate-cloudinary.js
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configuración desde variables de entorno
const sourceConfig = {
    cloud_name: process.env.SOURCE_CLOUD_NAME,
    api_key: process.env.SOURCE_API_KEY,
    api_secret: process.env.SOURCE_API_SECRET
};

const destConfig = {
    cloud_name: process.env.DEST_CLOUD_NAME,
    api_key: process.env.DEST_API_KEY,
    api_secret: process.env.DEST_API_SECRET
};

// Validar que existan las credenciales
if (!sourceConfig.cloud_name || !destConfig.cloud_name) {
    console.error('❌ Error: Credenciales faltantes en .env');
    process.exit(1);
}

async function migrateImages() {
    console.log('🚀 Iniciando migración de Cloudinary...\n');
    console.log(`📤 Origen: ${sourceConfig.cloud_name}`);
    console.log(`📥 Destino: ${destConfig.cloud_name}\n`);

    try {
        // Configurar cuenta origen
        cloudinary.config(sourceConfig);

        // 1. OBTENER TODAS LAS IMÁGENES
        console.log('📥 Obteniendo lista de imágenes de la cuenta origen...');
        let allResources = [];
        let nextCursor = null;
        let pageCount = 0;

        do {
            const result = await cloudinary.api.resources({
                type: 'upload',
                max_results: 500,
                next_cursor: nextCursor
            });

            allResources = allResources.concat(result.resources);
            nextCursor = result.next_cursor;
            pageCount++;

            console.log(`   Página ${pageCount}: ${result.resources.length} imágenes | Total: ${allResources.length}`);
        } while (nextCursor);

        console.log(`\n✅ Total de imágenes encontradas: ${allResources.length}\n`);
        console.log('⚠️  Iniciando en 5 segundos... (Ctrl+C para cancelar)\n');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 2. MIGRAR CADA IMAGEN
        console.log('🔄 Migrando a cuenta destino...\n');
        cloudinary.config(destConfig);

        let successCount = 0;
        let errorCount = 0;
        const errors = [];
        const startTime = Date.now();

        for (let i = 0; i < allResources.length; i++) {
            const resource = allResources[i];

            try {
                await cloudinary.uploader.upload(resource.secure_url, {
                    public_id: resource.public_id,
                    folder: resource.folder || '',
                    resource_type: resource.resource_type,
                    overwrite: false
                });

                successCount++;

                // Mostrar progreso cada 10 imágenes
                if ((i + 1) % 10 === 0 || i === allResources.length - 1) {
                    const progress = ((i + 1) / allResources.length * 100).toFixed(1);
                    console.log(`✅ [${i + 1}/${allResources.length}] ${progress}% - ${resource.public_id}`);
                }

            } catch (error) {
                errorCount++;
                const errorMsg = `${resource.public_id}: ${error.message}`;
                errors.push(errorMsg);
                console.error(`❌ [${i + 1}/${allResources.length}] ${errorMsg}`);
            }

            // Pausa cada 50 imágenes para evitar rate limits
            if ((i + 1) % 50 === 0 && i < allResources.length - 1) {
                console.log(`\n⏸️  Pausa de 3 segundos (${successCount} exitosas, ${errorCount} fallidas)...\n`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000 / 60).toFixed(2);

        // 3. RESUMEN FINAL
        console.log('\n' + '='.repeat(60));
        console.log('🎉 MIGRACIÓN COMPLETADA');
        console.log('='.repeat(60));
        console.log(`✅ Exitosas:       ${successCount}`);
        console.log(`❌ Fallidas:       ${errorCount}`);
        console.log(`📊 Total:          ${allResources.length}`);
        console.log(`⏱️  Tiempo total:   ${duration} minutos\n`);

        if (errors.length > 0) {
            console.log('❌ Lista de errores:');
            errors.slice(0, 20).forEach(err => console.log(`   - ${err}`));
            if (errors.length > 20) {
                console.log(`   ... y ${errors.length - 20} errores más`);
            }
        }

        console.log('\n⚠️  RECORDATORIO: Rotar las credenciales después de la migración');

    } catch (error) {
        console.error('\n💥 Error crítico en la migración:', error);
        console.error('\nDetalles del error:', error.stack);
        process.exit(1);
    }
}

// Ejecutar
migrateImages();
