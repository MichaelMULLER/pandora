import { componentName, dependencies, componentConfig } from 'pandora-component-decorator';
import { TraceManager } from './TraceManager';
import { TraceManagerOptions, ComponentTraceConfig } from './domain';

@componentName('trace')
@dependencies(['indicator'])
@componentConfig({
  trace: {
    poolSize: 100,
    interval: 15 * 1000,
    slowThreshold: 10 * 1000
  }
})
export default class ComponentTrace {
  ctx: any;
  traceManager: TraceManager;

  constructor(ctx: any) {
    this.ctx = ctx;
    const traceConfig = ctx.config.trace || {};
    const { kTracer, tracerConfig, ...managerConfig } = traceConfig;

    const options: TraceManagerOptions = {
      ...managerConfig,
      logger: ctx.logger
    };

    this.traceManager = new TraceManager(options);
    ctx.traceManager = this.traceManager;
  }

  initTracer() {
    const ctx = this.ctx;
    const trace: ComponentTraceConfig = ctx.config.trace || {};

    if (trace) {
      const { kTracer: Tracer } = trace;

      if (Tracer) {
        return new Tracer(ctx);
      }
    }

    return null;
  }

  async startAtSupervisor() {
    this.traceManager.start();
  }

  async start() {
    const tracer = this.initTracer();
    if(tracer) {
      this.traceManager.tracer = tracer;
    }
    this.traceManager.start();
  }

  async stopAtSupervisor() {
    this.traceManager.stop();
  }

  async stop() {
    this.traceManager.stop();
  }

}

export * from './constants';
export * from './domain';
export * from './TraceData';
export * from './TraceEndPoint';
export * from './TraceIndicator';
export * from './TraceManager';
