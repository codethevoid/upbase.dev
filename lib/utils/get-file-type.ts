import type { FileWithPath } from "@/types";

const mimeToExtensionMap: Record<string, string> = {
  // Documents
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.ms-powerpoint": "ppt",
  "application/msword": "doc",
  "application/vnd.ms-word": "doc",
  "application/vnd.oasis.opendocument.text": "odt",
  "application/vnd.oasis.opendocument.spreadsheet": "ods",
  "application/vnd.oasis.opendocument.presentation": "odp",
  "application/rtf": "rtf",
  "text/plain": "txt",
  "text/csv": "csv",
  "text/tab-separated-values": "tsv",
  "application/json": "json",
  "application/xml": "xml",
  "text/xml": "xml",
  "text/markdown": "md",
  "application/x-tex": "tex",
  "application/vnd.apple.pages": "pages",
  "application/vnd.apple.numbers": "numbers",
  "application/vnd.apple.keynote": "key",

  // Archives
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
  "application/x-rar-compressed": "rar",
  "application/x-7z-compressed": "7z",
  "application/x-tar": "tar",
  "application/x-gzip": "gz",
  "application/gzip": "gz",
  "application/x-bzip2": "bz2",
  "application/x-bzip": "bz",
  "application/x-compress": "Z",
  "application/x-lzma": "lzma",
  "application/x-xz": "xz",
  "application/stuffit": "sit",
  "application/x-stuffit": "sit",
  "application/x-stuffitx": "sitx",
  "application/vnd.rar": "rar",

  // Images
  "image/jpeg": "jpg",
  "image/pjpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/bmp": "bmp",
  "image/x-windows-bmp": "bmp",
  "image/tiff": "tiff",
  "image/x-tiff": "tiff",
  "image/vnd.adobe.photoshop": "psd",
  "image/x-photoshop": "psd",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
  "image/heif": "heif",
  "image/heic": "heic",
  "image/avif": "avif",
  "image/x-xcf": "xcf",
  "image/jp2": "jp2",
  "image/jpx": "jpx",
  "image/jpm": "jpm",

  // Audio
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/mp4": "m4a",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/x-ms-wma": "wma",
  "audio/flac": "flac",
  "audio/x-flac": "flac",
  "audio/aac": "aac",
  "audio/x-aac": "aac",
  "audio/midi": "mid",
  "audio/x-midi": "mid",
  "audio/basic": "au",
  "audio/webm": "weba",
  "audio/3gpp": "3gp",
  "audio/3gpp2": "3g2",
  "audio/x-matroska": "mka",

  // Video
  "video/mp4": "mp4",
  "video/mpeg": "mpeg",
  "video/ogg": "ogv",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/x-msvideo": "avi",
  "video/x-ms-wmv": "wmv",
  "video/x-flv": "flv",
  "video/3gpp": "3gp",
  "video/3gpp2": "3g2",
  "video/x-matroska": "mkv",
  "video/x-m4v": "m4v",
  "video/vnd.avi": "avi",
  "video/mp2t": "ts",
  "video/dvd": "vob",

  // Web
  "text/html": "html",
  "application/xhtml+xml": "xhtml",
  "text/css": "css",
  "application/javascript": "js",
  "text/javascript": "js",
  "application/typescript": "ts",
  "text/typescript": "ts",
  "application/wasm": "wasm",
  "application/manifest+json": "webmanifest",
  "text/vtt": "vtt",
  "text/cache-manifest": "appcache",

  // Programming
  "text/x-python": "py",
  "text/x-c++src": "cpp",
  "text/x-csrc": "c",
  "text/x-java-source": "java",
  "text/x-csharp": "cs",
  "text/x-go": "go",
  "text/x-php": "php",
  "text/x-ruby": "rb",
  "text/x-perl": "pl",
  "text/x-swift": "swift",
  "text/x-kotlin": "kt",
  "text/x-dart": "dart",
  "text/x-rust": "rs",
  "text/x-scala": "scala",
  "text/x-typescript": "ts",
  "text/x-shellscript": "sh",
  "application/x-sh": "sh",
  "application/x-bash": "bash",
  "application/x-javascript": "js",

  // Fonts
  "font/ttf": "ttf",
  "font/otf": "otf",
  "font/woff": "woff",
  "font/woff2": "woff2",
  "application/vnd.ms-fontobject": "eot",
  "application/x-font-ttf": "ttf",
  "application/x-font-otf": "otf",
  "application/x-font-woff": "woff",
  "application/font-woff": "woff",
  "application/font-woff2": "woff2",

  // CAD & 3D
  "application/vnd.ms-pki.stl": "stl",
  "model/stl": "stl",
  "model/obj": "obj",
  "model/gltf+json": "gltf",
  "model/gltf-binary": "glb",
  "application/vnd.sketchup.skp": "skp",
  "model/vnd.dwf": "dwf",
  "application/acad": "dwg",
  "image/vnd.dxf": "dxf",
  "model/iges": "igs",
  "model/mesh": "msh",
  "model/vrml": "wrl",
  "model/x3d+xml": "x3d",

  // Database
  "application/vnd.sqlite3": "sqlite",
  "application/x-sqlite3": "sqlite3",
  "application/x-msaccess": "mdb",
  "application/vnd.ms-access": "accdb",

  // Email
  "message/rfc822": "eml",
  "application/vnd.ms-outlook": "msg",

  // Executables
  "application/x-msdownload": "exe",
  "application/x-msdos-program": "exe",
  "application/vnd.microsoft.portable-executable": "exe",
  "application/x-dosexec": "exe",
  "application/x-msi": "msi",
  "application/x-ms-shortcut": "lnk",
  "application/vnd.apple.installer+xml": "pkg",
  "application/x-apple-diskimage": "dmg",
  "application/x-unix-archive": "a",
  "application/vnd.debian.binary-package": "deb",
  "application/x-rpm": "rpm",
  "application/x-redhat-package-manager": "rpm",

  // Scientific
  "application/mathematica": "nb",
  "application/vnd.wolfram.mathematica": "nb",
  "application/vnd.wolfram.cdf": "cdf",
  "application/vnd.matlab-mat": "mat",
  "application/x-matlab-data": "mat",

  // Virtual Machines
  "application/x-virtualbox-vdi": "vdi",
  "application/x-virtualbox-vmdk": "vmdk",
  "application/x-virtualbox-ovf": "ovf",
  "application/x-virtualbox-ova": "ova",
  "application/x-vmware-vmdk": "vmdk",
  "application/x-qemu-disk": "qcow2",

  // Miscellaneous
  "application/octet-stream": "bin",
  "application/x-binary": "bin",
  "application/vnd.google-earth.kml+xml": "kml",
  "application/vnd.google-earth.kmz": "kmz",
  "application/vnd.amazon.ebook": "azw",
  "application/epub+zip": "epub",
  "application/x-mobipocket-ebook": "mobi",
  "application/vnd.android.package-archive": "apk",
  "application/vnd.apple.mpegurl": "m3u8",
  "application/dash+xml": "mpd",
  "application/vnd.ms-cab-compressed": "cab",
  "application/x-shockwave-flash": "swf",
  "application/vnd.nintendo.snes.rom": "sfc",
  "application/vnd.nintendo.n64.rom": "n64",
  "application/pkcs10": "p10",
  "application/pkcs7-mime": "p7c",
  "application/pkcs7-signature": "p7s",
  "application/pkcs8": "p8",
  "application/pkcs12": "p12",
  "application/x-pkcs12": "pfx",
  "application/x-pkcs7-certificates": "p7b",
  "application/x-pkcs7-certreqresp": "p7r",
  "application/x-x509-ca-cert": "crt",
  "application/x-x509-user-cert": "crt",
  "application/x-pem-file": "pem",
};

export const getFileType = (file: FileWithPath | { type: string; name: string }) => {
  if (file.type) {
    const mimeType = file.type;
    if (mimeToExtensionMap[mimeType]) {
      return mimeToExtensionMap[mimeType];
    }
  }

  // fallback to file extension
  const filename = file.name;
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex !== -1) {
    const extension = filename.substring(lastDotIndex + 1);
    return extension || "-";
  }

  return "-";
};
