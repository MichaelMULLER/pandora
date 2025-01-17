import { Span, SpanContext } from 'opentracing';
import { EventEmitter } from 'events';

export interface IPandoraContext extends SpanContext {
  traceId: string;
  traceName: string;
}

export interface IPandoraSpan extends Span {
  traceId: string;
  startTime: number;
  duration: number;
  traceName: string;
  context: () => IPandoraContext;
  error: (isError: boolean) => IPandoraSpan;
  tag: (key: string) => any;
  on: (eventName: string, callback: (span: IPandoraSpan) => void) => void;
  emit: (eventName: string, data: any) => void;
}

export interface IPandoraReference {}

export interface ISpanOptions {
  childOf?: IPandoraSpan | IPandoraContext;
  references?: IPandoraReference[];
  tags?: {
      rpc_type?: number;
      [key: string]: any;
  };
  startTime?: number;
}

export interface ITracer extends EventEmitter {
  new(ctx?: any): ITracer;
  extract: (format: string, carrier: any) => IPandoraContext;
  inject: (spanContext: IPandoraContext, format: string, carrier: any) => void;
  startSpan: (operationName: string, options: ISpanOptions) => IPandoraSpan;
  createChildContext: (parent: IPandoraContext) =>  IPandoraContext;
}

export type SamplingFunction = (span: IPandoraSpan) => boolean;

export interface TraceManagerOptions {
  // 最多缓存数据数
  poolSize?: number;
  // dump 数据周期，ms
  interval?: number;
  // 慢链路阈值，ms
  slowThreshold?: number;
  // 链路超时阈值，ms
  timeout?: number;
  // 采样率，10 ~ 100，或者采样函数，返回 true 为采集
  sampling?: number | SamplingFunction;
  // 自定义链路名方法
  traceName?: (span: IPandoraSpan) => string;
  logger?: any;
  // tracer 实例
  tracer?: ITracer;
}

export interface ComponentTraceConfig extends TraceManagerOptions {
  // 自定义 Tracer 实现类
  kTracer?: ITracer;
  // 自定义 Tracer Config
  tracerConfig?: any;
}