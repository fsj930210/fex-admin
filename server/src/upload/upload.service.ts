import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { createReadStream, createWriteStream } from 'node:fs';
import {
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import type { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { CompleteMultipartDto } from './dto/complete-multipart.dto.js';
import type { InitMultipartDto } from './dto/init-multipart.dto.js';
import type { PartResult, UploadResult } from './upload.types.js';

const serverRoot = resolve(process.cwd());

@Injectable()
export class UploadService {
  private readonly uploadsDirectory = join(serverRoot, '.data', 'uploads');
  private readonly partsDirectory = join(serverRoot, '.data', 'parts');
  private readonly recordsDirectory = join(serverRoot, '.data', 'records');

  async saveUpload(stream: Readable, encodedName?: string) {
    const uploadId = randomUUID();
    const name = this.decodeFileName(encodedName);
    const target = join(this.uploadsDirectory, `${uploadId}-${name}`);
    const info = await this.saveStream(stream, target);
    return { uploadId, name, size: info.size, storedAt: target };
  }

  async initMultipart(body: InitMultipartDto) {
    const uploadId = randomUUID();
    await mkdir(this.getPartsPath(uploadId), { recursive: true });
    return { uploadId, name: basename(body.name), size: body.size };
  }

  async checkUpload(md5: string) {
    const recordPath = this.getRecordPath(md5);
    const record = await this.readRecord(recordPath);
    if (!record || !(await this.fileExists(record.storedAt))) {
      if (record) await rm(recordPath, { force: true });
      return { exists: false };
    }
    return { exists: true, response: { ...record, instant: true } };
  }

  async savePart(
    stream: Readable,
    uploadId: string,
    partNumber: number,
  ): Promise<PartResult> {
    this.assertUploadId(uploadId);
    if (!Number.isSafeInteger(partNumber) || partNumber < 1)
      throw new BadRequestException('Part number must start at 1.');
    const index = partNumber - 1;
    const target = join(this.getPartsPath(uploadId), String(index));
    const info = await this.savePartStream(stream, target);
    return { index, partNumber, size: info.size };
  }

  async getUploadedParts(uploadId: string) {
    const directory = this.getPartsPath(uploadId);
    const names = await readdir(directory).catch(() => []);
    return {
      completedIndexes: names
        .map(Number)
        .filter(Number.isFinite)
        .toSorted((a, b) => a - b),
    };
  }

  async completeMultipart(
    uploadId: string,
    body: CompleteMultipartDto,
  ): Promise<UploadResult> {
    const directory = this.getPartsPath(uploadId);
    const expected = Array.from(
      { length: body.partCount },
      (_, index) => index,
    );
    const names = await readdir(directory).catch(() => []);
    const completed = new Set(names.map(Number));
    const missing = expected.filter((index) => !completed.has(index));
    if (missing.length)
      throw new ConflictException({
        message: 'Multipart upload is missing parts.',
        data: { missingIndexes: missing },
      });

    const name = basename(body.name);
    const target = join(this.uploadsDirectory, `${uploadId}-${name}`);
    const info = await this.mergeParts(directory, expected, target);
    const result: UploadResult = {
      uploadId,
      name,
      size: info.size,
      storedAt: target,
      ...(body.md5 ? { md5: body.md5 } : {}),
      instant: false,
    };
    if (body.md5) await this.writeRecord(body.md5, result);
    await rm(directory, { recursive: true, force: true });
    return result;
  }

  private getPartsPath(uploadId: string) {
    this.assertUploadId(uploadId);
    return join(this.partsDirectory, uploadId);
  }

  private getRecordPath(md5: string) {
    if (!/^[a-f\d]{32}$/i.test(md5))
      throw new BadRequestException('A valid MD5 is required.');
    return join(this.recordsDirectory, `${md5}.json`);
  }

  private assertUploadId(uploadId: string) {
    if (!/^[a-z\d-]+$/i.test(uploadId))
      throw new BadRequestException('Invalid upload ID.');
  }

  private decodeFileName(encodedName?: string) {
    try {
      return basename(decodeURIComponent(encodedName ?? 'upload.bin'));
    } catch {
      throw new BadRequestException('Invalid encoded file name.');
    }
  }

  private async saveStream(stream: Readable, target: string) {
    await mkdir(dirname(target), { recursive: true });
    await pipeline(stream, createWriteStream(target));
    return stat(target);
  }

  private async savePartStream(stream: Readable, target: string) {
    await mkdir(dirname(target), { recursive: true });
    const temporaryTarget = `${target}.${randomUUID()}.uploading`;
    try {
      await pipeline(stream, createWriteStream(temporaryTarget));
      await rename(temporaryTarget, target);
      return stat(target);
    } catch (error) {
      await rm(temporaryTarget, { force: true });
      throw error;
    }
  }

  private async mergeParts(
    directory: string,
    indexes: readonly number[],
    target: string,
  ) {
    await mkdir(dirname(target), { recursive: true });
    async function* readParts() {
      for (const index of indexes)
        yield* createReadStream(join(directory, String(index)));
    }
    await pipeline(readParts(), createWriteStream(target));
    return stat(target);
  }

  private async readRecord(path: string): Promise<UploadResult | undefined> {
    try {
      return JSON.parse(await readFile(path, 'utf8')) as UploadResult;
    } catch {
      return undefined;
    }
  }

  private async writeRecord(md5: string, result: UploadResult) {
    const target = this.getRecordPath(md5);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, JSON.stringify(result), 'utf8');
  }

  private async fileExists(path: string) {
    return stat(path)
      .then((value) => value.isFile())
      .catch(() => false);
  }
}
