//From: https://gist.github.com/wuchengwei/b7e1820d39445f431aeaa9c786753d8e
//**dataURL to blob**
export function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

export function validateFile(file){
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

    if (validTypes.indexOf(file.type) === -1) {
        return false;
    }
    return true;
}