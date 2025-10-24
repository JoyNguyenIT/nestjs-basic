import { ParseFilePipe } from '@nestjs/common';
import * as fs from 'fs';

/**
 * Custom ParseFilePipe — tự động xóa file khỏi disk nếu validate thất bại
 * Dành cho NestJS >= 9.3 hoặc 10.x
 */
export class SafeParseFilePipe extends ParseFilePipe {
    constructor(options?: ConstructorParameters<typeof ParseFilePipe>[0]) {
        super(options);
    }

    async transform(value: any): Promise<any> {
        try {
            return await super.transform(value);
        } catch (error) {
            // 🧹 Nếu validate thất bại => xóa file khỏi ổ đĩa
            if (value?.path && fs.existsSync(value.path)) {
                fs.unlinkSync(value.path);
                console.log(`🧹 Deleted invalid file: ${value.path}`);
            }
            throw error;
        }
    }
}