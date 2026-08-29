import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
});

export const uploadFile = (fieldName) => {
    return upload.single(fieldName);
};

// 👈 nuevo — acepta cualquier campo
export const uploadAnyFile = upload.any();