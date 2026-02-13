import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

// Configure storage location
export const multerConfig = {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
            callback(null, filename);
        },
    }),
    fileFilter: (req, file, callback) => {
        // Accept images and documents
        const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
        ];

        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(
                new BadRequestException(
                    `Invalid file type. Allowed types: ${allowedMimes.join(', ')}`
                ),
                false
            );
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
};

export const imageFileFilter = (req, file, callback) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(
            new BadRequestException('Only image files are allowed (jpg, jpeg, png, gif, webp)'),
            false
        );
    }
};

export const documentFileFilter = (req, file, callback) => {
    const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
    ];

    if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(
            new BadRequestException('Only document files are allowed (pdf, doc, docx, txt)'),
            false
        );
    }
};
