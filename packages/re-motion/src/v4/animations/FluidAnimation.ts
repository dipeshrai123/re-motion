export type EndResultType = { finished: boolean; value: number };

export class FluidAnimation {
  public isActive: boolean;
  public onEnd: ((result: EndResultType) => void) | null;

  public start(
    value: number,
    onChange: (value: number) => void,
    onEnd: (result: EndResultType) => void,
    previousAnimation: FluidAnimation
  ) {
    void value;
    void onChange;
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
