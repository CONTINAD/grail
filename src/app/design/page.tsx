import type { Metadata } from "next";
import { DesignGalleryClient } from "./DesignGalleryClient";

export const metadata: Metadata = {
  title: "Design system · Grail",
  description:
    "Brand primitives, ad creative templates, and the rules that hold the Grail look together.",
};

export default function DesignPage() {
  return <DesignGalleryClient />;
}
