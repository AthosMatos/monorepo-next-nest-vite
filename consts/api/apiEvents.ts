export const apiEvents = {
    listening: {
        monorepo: 'download:progress',
        uploadProgress: 'upload:progress',
        uploadError: 'upload:error',
    },
    emiting: {
        startDownload: 'download:start',
        startUpload: 'upload:start',
        uploadChunk: 'upload:chunk',
    },
}
