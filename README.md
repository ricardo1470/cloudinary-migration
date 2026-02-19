# Cloudinary Migration Tool

🚀 Migrate images between Cloudinary accounts without downloading anything locally. Direct cloud-to-cloud transfer via API.

## ✨ Features

- ✅ **Zero downloads** - Direct URL-to-URL migration (no local storage needed)
- ✅ **Preserves structure** - Maintains folder hierarchy and public IDs
- ✅ **Progress tracking** - Real-time progress with percentage and ETA
- ✅ **Error handling** - Comprehensive error logging and recovery
- ✅ **Rate limit protection** - Built-in pauses to respect API limits
- ✅ **Batch processing** - Handles 500+ images per request efficiently

## 📊 Performance

Successfully tested with **837 images in 17 minutes** (0 errors, 100% success rate)

## 🔧 Prerequisites

- Node.js 14+ or pnpm/npm
- Source Cloudinary account (API credentials)
- Destination Cloudinary account (API credentials)

## 🚀 Quick Start

### 1. Clone and install
```bash
git clone https://github.com/yourusername/cloudinary-migration.git
cd cloudinary-migration
pnpm install  # or npm install
```

### 2. Configure credentials
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Run migration
```bash
pnpm node migrate-cloudinary.js
# or
npm run migrate
```

## ⚙️ Configuration

Create a `.env` file based on `.env.example`:
```env
# Source account (where images currently are)
SOURCE_CLOUD_NAME=your_source_cloud_name
SOURCE_API_KEY=your_source_api_key
SOURCE_API_SECRET=your_source_api_secret

# Destination account (where to migrate images)
DEST_CLOUD_NAME=destination_cloud_name
DEST_API_KEY=destination_api_key
DEST_API_SECRET=destination_api_secret
```

## 🔍 How It Works

1. **Fetches** all images from source account via Cloudinary API
2. **Transfers** images directly using source URLs (cloud-to-cloud)
3. **Preserves** folder structure, public IDs, and metadata
4. **Validates** each transfer and logs any errors
5. **No local downloads** - everything happens in the cloud
```
┌─────────────┐                    ┌──────────────┐
│   Source    │  ──── API ───>    │ Destination  │
│  Cloudinary │   (Direct URL)     │  Cloudinary  │
└─────────────┘                    └──────────────┘
       ↑                                   ↑
       │                                   │
       └──────── Your Script ──────────────┘
           (No local downloads)
```

## 📋 What Gets Migrated

- ✅ All images (JPG, PNG, GIF, WebP, etc.)
- ✅ Folder structure
- ✅ Public IDs
- ✅ Resource types
- ❌ Transformations (must be recreated)
- ❌ Upload presets (must be recreated)

## 🛡️ Security Best Practices

1. **Never commit `.env`** - Already in `.gitignore`
2. **Rotate credentials** after migration
3. **Use environment variables** in production
4. **Restrict API key permissions** if possible

## 🐛 Troubleshooting

### Rate Limit Errors

The script includes automatic pauses every 50 images. If you still hit limits:
```javascript
// Increase pause duration in migrate-cloudinary.js
await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds
```

### Memory Issues

For 1000+ images, consider batching:
```javascript
// Migrate in chunks
const BATCH_SIZE = 500;
for (let i = 0; i < allResources.length; i += BATCH_SIZE) {
  const batch = allResources.slice(i, i + BATCH_SIZE);
  // migrate batch
}
```

## 📊 Sample Output
```
🚀 Iniciando migración de Cloudinary...

📤 Origen: source_cloud
📥 Destino: dest_cloud

✅ Total de imágenes encontradas: 837

🔄 Migrando a cuenta destino...

✅ [100/837] 11.9% - image_public_id
✅ [200/837] 23.9% - another_image

⏸️  Pausa de 3 segundos (200 exitosas, 0 fallidas)...

============================================================
🎉 MIGRACIÓN COMPLETADA
============================================================
✅ Exitosas:       837
❌ Fallidas:       0
📊 Total:          837
⏱️  Tiempo total:   17.00 minutos
```

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

## 📝 License

MIT License - feel free to use this in your projects!

## ⚠️ Disclaimer

This tool is provided as-is. Always:
- Test with a few images first
- Backup important data
- Verify migration results
- Use at your own risk

## 🙏 Credits

Created by [Ricardo Camayo](https://github.com/ricardo1470)

Built to solve the common problem of migrating Cloudinary assets between accounts without manual downloads.

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Contact: [your-email]

---

**⭐ If this helped you, please star the repo!**
