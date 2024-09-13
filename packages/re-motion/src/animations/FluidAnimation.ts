export type EndResultType = { finished: boolean; value?: number | string };

export type EndCallback = (value: EndResultType) => void;

export class FluidAnimation {
  public isActive: boolean;
  public onEnd: ((result: EndResultType) => void) | null;

  public start(
    value: number | string,
    onFrame: (value: number | string) => void,
    onEnd: (result: EndResultType) => void,
    previousAnimation: FluidAnimation | null
  ) {
    void value;
    void onFrame;
    void onEnd;
    void previousAnimation;
  }

  public stop() {}

  public debouncedOnEnd(result: EndResultType) {
    const onEnd = this.onEnd;
    this.onEnd = null;
    onEnd && onEnd(result);
  }
}
