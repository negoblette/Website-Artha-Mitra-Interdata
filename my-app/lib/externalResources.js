export const EXTERNAL_RESOURCES_INVENTORY = [
    {
        name : 'Google Maps Embed',
        type : 'iframe',
        usage : 'Menampilkan Lokasi kantor Artha Mitra Interdata di contact page',
        sourceFile : 'components/contact/ContactInfo.jsx',
        runtime : true,
        domains : ['www.google.com', 'maps.google.com'],
        cspDirective : 'frame-src',
        required: true,
    },
    {
        name : 'Whatsapp Link',
        type : 'link',
        usage : 'Tombol chat WhatsApp di halaman kontak, homepage, footer',
        sourceFile : 'components/WhatsAppButton.jsx',
        runtime : true, 
        domains : ['wa.me'],
        cspDirective : null,
        required : true,
    },
    {
        name : 'Social Media Link',
        type : 'link',
        usage : 'Link ke Facebook, Instagram, dan LinkedIn',
        sourceFile : 'components/Footer.jsx',
        runtime : true,
        domains : ['www.facebook.com', 'www.instagram.com', 'www.linkedin.com'],
        cspDirective : null,
        required : true, 
    },
    {
        name : 'Google Fonts',
        type : 'build-time font',
        usage : 'font UI Sora',
        sourceFile : 'app/layout.js',
        runtime : false,
        domains : ['fonts.googleapis.com'],
        cspDirective : null,
        required : true,
    },
];

export const ALLOWED_EXTERNAL_HOSTS = [
    'www.google.com',
    'maps.google.com',
    'wa.me',
    'www.facebook.com',
    'www.instagram.com',
    'www.linkedin.com',
    'www.arthamitra.co.id',
    'arthamitra.co.id'
];

export const CSP_ALLOWLIST = {
    frameSrc : ['https://www.google.com', 'https://maps.google.com'],
    imgSrc : ['self', 'data:', 'blob:', 'https://arthamitra.co.id', 'https://www.arthamitra.co.id'],
    scriptSrc: ['self'],
    styleSrc : ['self'],
    connectSrc : ['self'],
};

export function isAllowedExternalUrl(value) {
    try{
        const url = new URL(value);
        return ALLOWED_EXTERNAL_HOSTS.includes(url.hostname);
    }catch{
        return false;
    }
}

export function getExternalResourceByName(name) {
    return EXTERNAL_RESOURCES_INVENTORY.find((item) => item.name === name);
}