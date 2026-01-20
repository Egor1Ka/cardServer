import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const normalizePrefix = (prefix) => {
  if (!prefix) return "";
  return prefix.endsWith("/") ? prefix : `${prefix}/`;
};

const encodeKey = (key) => key.split("/").map(encodeURIComponent).join("/");

const getContentType = (format) => {
  if (!format || format === "auto")
    return { contentType: "application/octet-stream" };

  if (format.includes("/")) {
    const [, ext] = format.split("/");
    return { contentType: format, extension: ext };
  }

  const normalized = format.replace(".", "").toLowerCase();
  const map = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    avif: "image/avif",
  };

  return {
    contentType: map[normalized] || "application/octet-stream",
    extension: normalized,
  };
};

class AwsS3Adapter {
  #name = "aws";

  constructor({
    region,
    accessKeyId,
    secretAccessKey,
    bucket,
    baseUrl,
    endpoint,
    forcePathStyle,
    keyPrefix,
    publicRead,
  }) {
    if (!bucket) {
      throw new Error('S3Service: "S3_BUCKET" is required for aws adapter');
    }

    if (!accessKeyId || !secretAccessKey) {
      throw new Error(
        'S3Service: "S3_ACCESS_KEY_ID" and "S3_SECRET_ACCESS_KEY" are required'
      );
    }

    this.bucket = bucket;
    this.region = region || "us-east-1";
    this.baseUrl = baseUrl;
    this.forcePathStyle = forcePathStyle === true || forcePathStyle === "true";
    this.keyPrefix = normalizePrefix(keyPrefix);
    this.publicRead = publicRead === true || publicRead === "true";

    const clientConfig = {
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    };

    if (endpoint) {
      clientConfig.endpoint = endpoint;
    }

    if (this.forcePathStyle) {
      clientConfig.forcePathStyle = true;
    }

    this.client = new S3Client(clientConfig);
  }

  buildUrl(key) {
    const safeKey = encodeKey(key);
    if (this.baseUrl) {
      return `${this.baseUrl.replace(/\/+$/, "")}/${safeKey}`;
    }

    const host =
      this.region === "us-east-1"
        ? "s3.amazonaws.com"
        : `s3.${this.region}.amazonaws.com`;

    if (this.forcePathStyle) {
      return `https://${host}/${this.bucket}/${safeKey}`;
    }

    return `https://${this.bucket}.${host}/${safeKey}`;
  }

  async bufferUpload(buffer, format = "auto") {
    const { contentType, extension } = getContentType(format);
    const keySuffix = extension ? `.${extension}` : "";
    const key = `${this.keyPrefix}${randomUUID()}${keySuffix}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ...(this.publicRead ? { ACL: "public-read" } : {}),
    });

    await this.client.send(command);

    return {
      url: this.buildUrl(key),
      key,
      bucket: this.bucket,
    };
  }

  async base64Upload(base64Str, format = "auto") {
    const buffer = Buffer.from(base64Str, "base64");
    return this.bufferUpload(buffer, format);
  }
}

export default AwsS3Adapter;
