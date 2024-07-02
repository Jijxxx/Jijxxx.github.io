document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const files = document.getElementById('fileInput').files;
    const accessToken = 'sl.B4QP7jbPYdY6GMIOjkeGEL3YO8L93oCxLMkw7M9v0bHn3IFtPwPnTQr5oAXoPOPIeOCAtcywhMmMpRPTxmD8urH-HTVMea_aF0_Z5xH_GkkrdVj0_UyEBy6cLzJA3Oj01JH_DcyhR2HT'; // Zamień na swój token dostępu Dropbox

    const uploadFile = (file, delay) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                fetch('https://content.dropboxapi.com/2/files/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Dropbox-API-Arg': JSON.stringify({
                            path: `/${file.name}`,
                            mode: 'add',
                            autorename: true,
                            mute: false,
                            strict_conflict: false
                        }),
                        'Content-Type': 'application/octet-stream'
                    },
                    body: file
                })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => { throw new Error(text) });
                    }
                    return response.json();
                })
                .then(data => {
                    alert('Plik przesłany: ' + data.name);
                    resolve(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Wystąpił błąd: ' + error.message);
                    reject(error);
                });
            }, delay);
        });
    };

    let delay = 0;
    for (let i = 0; i < files.length; i++) {
        uploadFile(files[i], delay);
        delay += 1000; // Opóźnienie 1 sekundy między przesyłaniami plików
    }
});

document.getElementById('fileInput').addEventListener('change', function() {
    const fileInput = document.getElementById('fileInput');
    const fileInputLabel = document.getElementById('fileInputLabel');
    const files = fileInput.files;
    if (files.length > 0) {
        fileInputLabel.textContent = `Wybrano ${files.length}`;
    } else {
        fileInputLabel.textContent = 'Wybierz zdjęcia';
    }
});