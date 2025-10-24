import { Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import * as fs from 'fs'

function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    createMulterOptions(): MulterModuleOptions {
        return {
            storage: diskStorage({
                // ✅ 1️⃣ Nơi lưu file
                destination: (req, file, callback) => {
                    const forderType = req?.headers?.forder_type ?? "default"
                    const uploadPath = path.join(process.cwd(), 'public', 'images', `${forderType}`);

                    // Nếu chưa có folder thì tự tạo
                    ensureDir(uploadPath); // tự tạo nếu chưa có
                    callback(null, uploadPath);
                },

                // ✅ 2️⃣ Cách đặt tên file
                filename: (req, file, callback) => {
                    const baseName = path.basename(file.originalname);
                    const ext = path.extname(file.originalname);
                    const filename = `${baseName}-${Date.now()}${ext}`;
                    callback(null, filename);
                },
            }),
        };
    }
}
