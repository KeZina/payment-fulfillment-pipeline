import {
  AVATAR_ACCEPTED_MIME_TYPES,
  AVATAR_MAX_DATA_URL_LENGTH,
  AVATAR_MAX_OUTPUT_BYTES,
  AVATAR_MAX_SOURCE_BYTES,
  AVATAR_OUTPUT_DIMENSIONS,
  AVATAR_OUTPUT_QUALITIES,
} from "@/constants/avatar";

// TODO move images to S3 bucket

export function validateAvatarFile(file: File): string | null {
  if (
    !AVATAR_ACCEPTED_MIME_TYPES.includes(
      file.type as (typeof AVATAR_ACCEPTED_MIME_TYPES)[number],
    )
  ) {
    return "Please choose a JPEG, PNG, WebP, or GIF image";
  }

  if (file.size > AVATAR_MAX_SOURCE_BYTES) {
    return "Image must be 15 MB or smaller";
  }

  return null;
}

function getOutputMimeType(): "image/webp" | "image/jpeg" {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  return canvas.toDataURL("image/webp").startsWith("data:image/webp")
    ? "image/webp"
    : "image/jpeg";
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    image.src = url;
  });
}

function drawSquareAvatar(
  image: HTMLImageElement,
  dimension: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = dimension;
  canvas.height = dimension;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to optimize image");
  }

  const cropSize = Math.min(image.width, image.height);
  const sourceX = (image.width - cropSize) / 2;
  const sourceY = (image.height - cropSize) / 2;

  context.drawImage(
    image,
    sourceX,
    sourceY,
    cropSize,
    cropSize,
    0,
    0,
    dimension,
    dimension,
  );

  return canvas;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: "image/webp" | "image/jpeg",
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to optimize image"));
          return;
        }

        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Failed to optimize image"));
        return;
      }

      resolve(reader.result);
    };

    reader.onerror = () => reject(new Error("Failed to optimize image"));
    reader.readAsDataURL(blob);
  });
}

async function optimizeAvatarBlob(image: HTMLImageElement): Promise<Blob> {
  const mimeType = getOutputMimeType();
  let smallestBlob: Blob | null = null;

  for (const dimension of AVATAR_OUTPUT_DIMENSIONS) {
    const canvas = drawSquareAvatar(image, dimension);

    for (const quality of AVATAR_OUTPUT_QUALITIES) {
      const blob = await canvasToBlob(canvas, mimeType, quality);

      if (!smallestBlob || blob.size < smallestBlob.size) {
        smallestBlob = blob;
      }

      if (blob.size <= AVATAR_MAX_OUTPUT_BYTES) {
        return blob;
      }
    }
  }

  if (smallestBlob && smallestBlob.size <= AVATAR_MAX_OUTPUT_BYTES) {
    return smallestBlob;
  }

  throw new Error(
    "Could not optimize image to 1 MB or less. Try a smaller photo.",
  );
}

export async function readAvatarFileAsDataUrl(file: File): Promise<string> {
  const validationError = validateAvatarFile(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const image = await loadImageFromFile(file);
  const optimizedBlob = await optimizeAvatarBlob(image);
  const dataUrl = await blobToDataUrl(optimizedBlob);

  if (dataUrl.length > AVATAR_MAX_DATA_URL_LENGTH) {
    throw new Error(
      "Could not optimize image to 1 MB or less. Try a smaller photo.",
    );
  }

  return dataUrl;
}
