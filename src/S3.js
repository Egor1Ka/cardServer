import s3 from "./lib/S3/index.js";

const {
  S3_PROVIDER = "aws",
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_BUCKET,
  S3_BASE_URL,
  S3_ENDPOINT,
  S3_FORCE_PATH_STYLE,
  S3_KEY_PREFIX,
  S3_PUBLIC_READ,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

const S3Service = new s3(S3_PROVIDER, {
  region: S3_REGION,
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY,
  bucket: S3_BUCKET,
  baseUrl: S3_BASE_URL,
  endpoint: S3_ENDPOINT,
  forcePathStyle: S3_FORCE_PATH_STYLE,
  keyPrefix: S3_KEY_PREFIX,
  publicRead: S3_PUBLIC_READ,
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export default S3Service;
