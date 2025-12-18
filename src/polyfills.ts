// Minimal File polyfill for runtimes (e.g., Node 18) lacking global File support.
if (typeof globalThis.File === "undefined") {
  class PolyfilledFile extends Blob {
    public readonly name: string;
    public readonly lastModified: number;

    constructor(bits: BlobPart[], name: string, options: FilePropertyBag = {}) {
      super(bits, options);
      this.name = String(name);
      this.lastModified = options.lastModified ?? Date.now();
    }
  }

  // @ts-expect-error intentional polyfill
  globalThis.File = PolyfilledFile;
}
