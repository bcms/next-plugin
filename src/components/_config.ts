const proc = typeof process !== 'undefined' ? process : null;

export class BCMSImageConfig {
  static localeImageProcessing = false;
  static cmsOrigin =
    proc && proc.env.NEXT_PUBLIC_BCMS_ORIGIN
      ? proc.env.NEXT_PUBLIC_BCMS_ORIGIN
      : '';
  static publicApiKeyId =
    proc && process.env.NEXT_PUBLIC_BCMS_PUBLIC_KEY_ID
      ? process.env.NEXT_PUBLIC_BCMS_PUBLIC_KEY_ID
      : '';
}
