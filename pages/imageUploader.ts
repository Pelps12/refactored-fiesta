import {UploadClient} from '@uploadcare/upload-client'

export  const imageClient = new UploadClient({publicKey: process.env.IMAGE_URL, fileName: "profilePics", contentType: "image/jpeg"});