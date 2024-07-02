const accessToken = 'sl.B4QP7jbPYdY6GMIOjkeGEL3YO8L93oCxLMkw7M9v0bHn3IFtPwPnTQr5oAXoPOPIeOCAtcywhMmMpRPTxmD8urH-HTVMea_aF0_Z5xH_GkkrdVj0_UyEBy6cLzJA3Oj01JH_DcyhR2HT';


const getDropboxFiles = async () => {
    const response = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            path: '',
            recursive: false
        })
    });

    if (!response.ok) {
        throw new Error('Error fetching file list');
    }

    const data = await response.json();
    return data.entries.filter(entry => entry['.tag'] === 'file');
};

const getRandomFiles = (files, count) => {
    const shuffled = files.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const updateGallery = async () => {
    try {
        const files = await getDropboxFiles();
        const randomFiles = getRandomFiles(files, 5);
        const gallery = document.getElementById('gallery');
        const images = [];

        for (const file of randomFiles) {
            const fileUrl = await getFileUrl(file.path_lower);
            const img = new Image();
            img.src = fileUrl;
            img.classList.add('fade-in');
            images.push(img);
        }

        gallery.classList.add('fade-out');

        setTimeout(() => {
            gallery.innerHTML = '';

            images.forEach(img => {
                gallery.appendChild(img);
            });

            setTimeout(() => {
                gallery.classList.remove('fade-out');
                images.forEach(img => {
                    img.style.opacity = 1;
                });
            }, 1000); 
        }, 1000); 
    } catch (error) {
        console.error('Error updating gallery:', error);
    }
};

const getFileUrl = async (path) => {
    const response = await fetch('https://api.dropboxapi.com/2/files/get_temporary_link', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            path: path
        })
    });

    if (!response.ok) {
        throw new Error('Error fetching file link');
    }

    const data = await response.json();
    return data.link;
};

updateGallery();
setInterval(updateGallery, 10000);