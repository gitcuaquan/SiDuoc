import BaseService from "./BaseService";

export class FileService extends BaseService {
    async uploadFile(file: File) {
        const uuid = crypto.randomUUID();
        const body = new FormData();
        body.append("file", file);
        body.append("controllerFields", "dmkh");
        body.append("isPublicAccess", "true");
        body.append("keyFields", uuid);
        body.append("slug", uuid + `.` + file.type.split('/')[1]);

        try {
            const response = await $fetch('https://api-tapmed.sse.net.vn/api/FileUpload/upload', {
                method: 'POST',
                body: body,
                headers: {
                    "api-sse-code": "e0cc6288e60584582eb706fd6c2612e1",
                    "Authorization": `Bearer ${useCookie(this.NAME_TOKEN_IN_COOKIE).value}`,
                },
            });
            return response;
        } catch (error) {
            console.error("Upload file error:", error);
            throw error;
        }
    }
    async getFileBlob(fileUrl: string) {
        try {
            const response = await $fetch(fileUrl, {
                method: 'GET',
                headers: {
                    "api-sse-code": "e0cc6288e60584582eb706fd6c2612e1",
                    "Authorization": `Bearer ${useCookie(this.NAME_TOKEN_IN_COOKIE).value}`,
                },
            });
            return response;
        } catch (error) {
            console.error("Get file error:", error);
            throw error;
        }
    }
}