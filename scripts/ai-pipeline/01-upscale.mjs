// Stage 01 — AI upscale (provider stub).
// Inputs:  public/assets/projects/<slug>/_raw/*
// Outputs: public/assets/projects/<slug>/_upscaled/<basename>.png  (4K longer edge)
//
// Wire ONE of the providers below by setting the matching env var, then
// implement the body. Keeping this as a stub avoids accidental API spend.
//
// Suggested integrations:
//   - MAGNIFIC_API_KEY          (https://magnific.ai)
//   - TOPAZ_BIN=/path/to/cli    (https://www.topazlabs.com/gigapixel)
//   - REPLICATE_API_TOKEN       (https://replicate.com  — many upscaler models)
//   - KREA_API_KEY              (https://www.krea.ai)
//   - ARCHIVINCI_API_KEY        (https://www.archivinci.com)

export const upscale = async (slug) => {
  const provider =
    process.env.MAGNIFIC_API_KEY ? 'magnific' :
    process.env.TOPAZ_BIN ? 'topaz' :
    process.env.REPLICATE_API_TOKEN ? 'replicate' :
    process.env.KREA_API_KEY ? 'krea' :
    process.env.ARCHIVINCI_API_KEY ? 'archivinci' :
    null;

  if (!provider) {
    console.warn(
      `[01-upscale] no provider configured. Set one of: MAGNIFIC_API_KEY, ` +
      `TOPAZ_BIN, REPLICATE_API_TOKEN, KREA_API_KEY, ARCHIVINCI_API_KEY. ` +
      `Skipping upscale for ${slug}.`
    );
    return;
  }

  // Implementation lives here. Read from public/assets/projects/<slug>/_raw/,
  // call the provider, write 4K PNG into public/assets/projects/<slug>/_upscaled/.
  throw new Error(
    `[01-upscale] provider "${provider}" stub: implement the API call before running.`
  );
};
