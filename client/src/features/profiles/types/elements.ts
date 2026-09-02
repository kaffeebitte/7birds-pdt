export type ProfileElement = ProfileImageElement | ProfileTextElement;

export type ProfileImageElement = {
  id: string;
  type: "image";
  url: string;
  publicId: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
  zIndex: number;
};

export type ProfileTextElement = {
  id: string;
  type: "text";
  content: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
  zIndex: number;
};

export type UploadProfileImageResponse = {
  url: string;
  publicId: string;
};
