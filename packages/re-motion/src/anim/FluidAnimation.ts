export abstract class FluidAnimation {
  abstract isActive: boolean;
  abstract start(
    value: number,
    onChange: (value: number) => void,
    onEnd: (value: number) => void,
    previousAnimation: FluidAnimation
  ): void;
  abstract stop(): void;
}
