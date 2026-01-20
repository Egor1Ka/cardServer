import { isValidUrl } from "../utils/links.js";
import S3Service from "../S3.js";

const resolveImageSource = async (image) => {
  if (!image) return;
  const { imageBase64, url: inputUrl, alt, imageType } = image;

  if (inputUrl && isValidUrl(inputUrl)) {
    return image;
  }

  const base64Input = imageBase64 || inputUrl;
  if (!base64Input) return;

  if (typeof base64Input !== "string") return;

  if (base64Input.startsWith("data:")) {
    const match = base64Input.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!match) return;
    const [, format, base64] = match;
    const { url } = await S3Service.base64Upload(base64, format);
    return { url, alt, imageType: format || imageType };
  }

  const { url } = await S3Service.base64Upload(base64Input, imageType);
  return { url, alt, imageType };
};

export { resolveImageSource };
