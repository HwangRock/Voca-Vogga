declare module "subset-font" {
  export interface SubsetOptions {
    targetFormat?: "sfnt" | "woff" | "woff2";
  }

  export default function subsetFont(
    fontBuffer: Buffer,
    text: string,
    options?: SubsetOptions
  ): Promise<Buffer>;
}
