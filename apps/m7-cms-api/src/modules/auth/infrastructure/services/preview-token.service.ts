import { Injectable } from '@nestjs/common';
import * as jose from 'jose';
import type {
  IPreviewTokenService,
  PreviewTokenPayload,
  PreviewTokenResult,
} from '../../application/use-cases/generate-preview-token.use-case.js';
import type { IPreviewTokenVerifier, PreviewTokenData } from '../../application/use-cases/validate-preview-token.use-case.js';

@Injectable()
export class PreviewTokenService
  implements IPreviewTokenService, IPreviewTokenVerifier
{
  private getSecret(): Uint8Array {
    const secret = process.env.PREVIEW_SECRET;
    if (!secret) {
      throw new Error('PREVIEW_SECRET environment variable is required.');
    }
    return new TextEncoder().encode(secret);
  }

  async sign(payload: PreviewTokenPayload): Promise<PreviewTokenResult> {
    const secret = this.getSecret();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const token = await new jose.SignJWT({
      type: 'preview',
      tenantId: payload.tenantId,
      ...(payload.pageId && { pageId: payload.pageId }),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .setIssuedAt()
      .sign(secret);

    return {
      token,
      expiresAt: expiresAt.toISOString(),
    };
  }

  async verify(token: string): Promise<PreviewTokenData> {
    const secret = this.getSecret();

    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    if (payload.type !== 'preview') {
      throw new Error('Invalid token type.');
    }

    return {
      type: payload.type as string,
      tenantId: payload.tenantId as string,
      pageId: payload.pageId as string | undefined,
    };
  }
}
