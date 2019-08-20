import PhotoSize from "../entities/photosize";

let Document = {
    file_id:  String,
    mime_type: String,
    file_size: Number,
    file_name: String,
    thumb: PhotoSize
};

export default Document;