// types/container.ts
export interface Container {
  containerId: string;
  zone: string;
  width: number;
  depth: number;
  height: number;
  availableSpace: { width: number; depth: number; height: number };
}