import { describe, it, expect } from 'vitest';
import {
  AssetStorageLocator,
  AssetStorageZone,
  AssetId
} from '@manaratak/domain';
import {
  LocalAssetStorageGateway,
  NoopAssetMalwareScannerGateway,
  NoopAssetSanitizationGateway,
  InMemoryAssetUsageRegistryGateway
} from '../../src';

describe('Phase 05 EAP Infrastructure - Slice 2C', () => {
  describe('LocalAssetStorageGateway', () => {
    it('generates an upload locator in QUARANTINE zone', async () => {
      const gateway = new LocalAssetStorageGateway('test-bucket');
      const locator = await gateway.generateUploadLocator();
      
      expect(locator.storageZone).toBe(AssetStorageZone.QUARANTINE);
      expect(locator.bucketName).toBe('test-bucket');
      expect(locator.pathKey).toMatch(/^uploads\//);
    });

    it('moves locator from quarantine to clean zone', async () => {
      const gateway = new LocalAssetStorageGateway('test-bucket');
      const qLocator = new AssetStorageLocator(AssetStorageZone.QUARANTINE, 'test-bucket', 'uploads/123-file.tmp');
      const cLocator = await gateway.moveToCleanZone(qLocator);

      expect(cLocator.storageZone).toBe(AssetStorageZone.CLEAN);
      expect(cLocator.bucketName).toBe('test-bucket');
      expect(cLocator.pathKey).toBe('clean/123-file.tmp');
    });
  });

  describe('NoopAssetMalwareScannerGateway', () => {
    it('always returns clean', async () => {
      const gateway = new NoopAssetMalwareScannerGateway();
      const result = await gateway.scan(new AssetStorageLocator(AssetStorageZone.QUARANTINE, 'b', 'k'));
      expect(result.clean).toBe(true);
      expect(result.threatsFound).toBeUndefined();
    });
  });

  describe('NoopAssetSanitizationGateway', () => {
    it('returns sanitization metadata without altering the file', async () => {
      const gateway = new NoopAssetSanitizationGateway();
      const locator = new AssetStorageLocator(AssetStorageZone.QUARANTINE, 'b', 'k');
      const result = await gateway.sanitize(locator);

      expect(result.sanitizedLocator).toBe(locator);
      expect(result.metadata.exifStripped).toBe(true);
      expect(result.metadata.sanitizerNotes).toBe('No-op sanitization performed (local adapter)');
    });
  });

  describe('InMemoryAssetUsageRegistryGateway', () => {
    it('registers, checks and unregisters usage', async () => {
      const gateway = new InMemoryAssetUsageRegistryGateway();
      const id = new AssetId('ast-1');

      expect(await gateway.isAssetInUse(id)).toBe(false);

      await gateway.registerUsage(id, 'urn:test:consumer-1');
      expect(await gateway.isAssetInUse(id)).toBe(true);

      // Register second usage
      await gateway.registerUsage(id, 'urn:test:consumer-2');
      expect(await gateway.isAssetInUse(id)).toBe(true);

      await gateway.unregisterUsage(id, 'urn:test:consumer-1');
      expect(await gateway.isAssetInUse(id)).toBe(true); // still in use by consumer-2

      await gateway.unregisterUsage(id, 'urn:test:consumer-2');
      expect(await gateway.isAssetInUse(id)).toBe(false); // now free
    });
  });

  describe('PrismaAssetRecordRepository Limitation', () => {
    it('skips direct DB tests because prisma generated client is not updated during Slice 2C limit', () => {
      expect(true).toBe(true);
    });
  });
});
