import {
  IAssetSanitizationGateway,
  AssetStorageLocator,
  SanitizationResult,
  AssetSanitizationMetadata
} from '@manaratak/domain';

export class NoopAssetSanitizationGateway implements IAssetSanitizationGateway {
  async sanitize(locator: AssetStorageLocator): Promise<SanitizationResult> {
    // This is a no-op local development adapter. It does not actually modify the file.
    return {
      sanitizedLocator: locator,
      metadata: new AssetSanitizationMetadata(
        true,
        new Date(),
        'No-op sanitization performed (local adapter)'
      )
    };
  }
}
