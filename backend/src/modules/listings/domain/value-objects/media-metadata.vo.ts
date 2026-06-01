// backend/src/modules/listings/domain/value-objects/media-metadata.vo.ts

export type MediaMetadataProps = {
  width?: number | null;

  height?: number | null;

  duration?: number | null;

  blurhash?: string | null;

  alt?: string | null;

  dominantColor?: string | null;

  exif?: Record<string, any> | null;
};

export class MediaMetadataVO {
  readonly width: number | null;

  readonly height: number | null;

  readonly duration: number | null;

  readonly blurhash: string | null;

  readonly alt: string | null;

  readonly dominantColor: string | null;

  readonly exif: Record<string, any> | null;

  constructor(props: MediaMetadataProps) {
    this.width = props.width ?? null;

    this.height = props.height ?? null;

    this.duration = props.duration ?? null;

    this.blurhash = props.blurhash ?? null;

    this.alt = props.alt ?? null;

    this.dominantColor =
      props.dominantColor ?? null;

    this.exif = props.exif ?? null;
  }

  toPrimitives(): MediaMetadataProps {
    return {
      width: this.width,
      height: this.height,
      duration: this.duration,
      blurhash: this.blurhash,
      alt: this.alt,
      dominantColor: this.dominantColor,
      exif: this.exif,
    };
  }
}
