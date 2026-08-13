import fs from 'fs'
import multer from 'multer'
import path from 'path'

const uploadDir = path.join(process.cwd(), 'uploads')
try {
	if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
} catch (e) {}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDir)
	},
	filename: function (req, file, cb) {
		const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
		const ext = path.extname(file.originalname) || ''
		cb(null, `${unique}${ext}`)
	}
})

const upload = multer({ storage })

// Default export for existing imports
export default upload

// Named export to match other import styles in upstream examples
export { upload }
