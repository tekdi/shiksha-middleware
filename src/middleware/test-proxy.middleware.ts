import { Injectable, NestMiddleware, } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { IncomingMessage, ServerResponse } from 'http';

@Injectable()
export class TestProxyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: any) {
    console.log("innn")
    console.log(req.url)
    const proxy = createProxyMiddleware({
      target: 'https://qa.prathamteacherapp.tekdinext.com/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Adjust according to your microservice's expected path
      },
    });
    proxy(req as unknown as IncomingMessage, res as unknown as ServerResponse, next);  
  }
}