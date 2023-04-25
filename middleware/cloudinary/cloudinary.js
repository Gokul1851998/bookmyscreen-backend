import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv'
dotenv.config()
cloudinary.config({
    cloud_name: "dutvub1ra",
    api_key: "482232983849495",
    api_secret: "5ozSpHBlSdV0i1_taOWWiKzY2Mw"
})

export default cloudinary