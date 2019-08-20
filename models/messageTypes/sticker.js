import PhotoSize from "../entities/photosize";
import MaskPosition from "../entities/maskPosition";

let Sticker = {
    file_id:  String,
    width:  Number,
    height:  Number,
    emoji: String,
    set_name: String,
    mask_position: MaskPosition,
    file_size: Number,
    thumb: PhotoSize
};

export default Sticker;