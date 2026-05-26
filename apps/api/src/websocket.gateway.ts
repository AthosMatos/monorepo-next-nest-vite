import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface UploadStartPayload {
    fileName: string;
    fileSize: number;
    totalChunks: number;
}

interface UploadChunkPayload {
    index: number;
    totalChunks: number;
    data: ArrayBuffer;
}

export const apiEvents = {
    listening: {
        downloadProgress: 'download:progress',
        uploadProgress: 'upload:progress',
        uploadError: 'upload:error',
    },
    emiting: {
        startDownload: 'download:start',
        startUpload: 'upload:start',
        uploadChunk: 'upload:chunk',
    },
}

@WebSocketGateway({ cors: { origin: '*' } })
export class Gateway {
    @WebSocketServer()
    server: Server | undefined;

    private uploads = new Map<
        string,
        { fileName: string; fileSize: number; received: number; chunks: Buffer[] }
    >();

    @SubscribeMessage('download:start')
    handleStartDownload(@ConnectedSocket() client: Socket,) {

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress > 100) progress = 100;

            client.emit('download:progress', {
                progress,
                message: `Download is ${progress}% complete...`,
            });

            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 500);
    }

    @SubscribeMessage('upload:start')
    handleStartUpload(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: UploadStartPayload,
    ) {
        this.uploads.set(client.id, {
            fileName: payload.fileName,
            fileSize: payload.fileSize,
            received: 0,
            chunks: [],
        });

        client.emit('upload:progress', {
            progress: 0,
            message: `Starting upload of "${payload.fileName}" (${(payload.fileSize / 1024).toFixed(1)} KB)...`,
        });
    }

    @SubscribeMessage('upload:chunk')
    handleUploadChunk(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: UploadChunkPayload,
    ) {
        const upload = this.uploads.get(client.id);
        if (!upload) {
            client.emit('upload:error', { message: 'No upload in progress.' });
            return;
        }

        const buf = Buffer.from(payload.data);
        upload.chunks.push(buf);
        upload.received += buf.length;

        const progress = Math.min(
            Math.round((upload.received / upload.fileSize) * 100),
            100,
        );

        client.emit('upload:progress', {
            progress,
            chunk: payload.index + 1,
            totalChunks: payload.totalChunks,
            received: upload.received,
            fileSize: upload.fileSize,
            message:
                progress < 100
                    ? `Uploading chunk ${payload.index + 1} of ${payload.totalChunks}...`
                    : `Upload of "${upload.fileName}" complete!`,
        });

        if (progress >= 100) {
            // All chunks received — the full file is in upload.chunks
            // You could write to disk / process here:
            // const fullFile = Buffer.concat(upload.chunks);
            this.uploads.delete(client.id);
        }
    }

    handleDisconnect(client: Socket) {
        this.uploads.delete(client.id);
    }
}
