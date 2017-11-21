declare module 'webpack-hot-server-middleware' {
  import { RequestHandler } from 'express';
  // tslint:disable-next-line no-implicit-dependencies
  import { MultiCompiler, Stats } from 'webpack';
  type Options<T = Record<string, any>> = Partial<{
    /** The name of the server entry point, defaults to 'main'. */
    chunkName: string;

    /** object Mixed in with clientStats & serverStats and passed to the serverRenderer. */
    serverRendererOptions: T & {
      clientStats: Stats;
      serverStats: Stats;
    };
  }>;

  declare function webpackHotServerMiddleware<T>(
    compiler: MultiCompiler,
    options?: Options<T>,
  ): RequestHandler;

  export = webpackHotServerMiddleware;
}
