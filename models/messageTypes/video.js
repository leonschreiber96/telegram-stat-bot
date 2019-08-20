import PhotoSize from "../entities/photosize";

let Video = {
    file_id:  String,
    width:  Number,
    height:  Number,
    duration:  Number,
    mime_type: String,
    file_size: Number,
    thumb: PhotoSize
};

export default Video;