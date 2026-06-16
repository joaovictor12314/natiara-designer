export const localHeroImage = "/images/natiara-beauty-setup.png";

export function cloudinaryImage(publicId: string, transformations = "f_auto,q_auto,w_1400") {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    return localHeroImage;
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
}

export const heroImage = cloudinaryImage("natiara/beauty-setup");
