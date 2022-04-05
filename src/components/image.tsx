import type { BCMSMediaParsed } from '@becomes/cms-client/types';
import type { BCMSMostImageProcessorProcessOptions } from '@becomes/cms-most/types';
import { createBcmsImageHandler } from '@becomes/cms-most/frontend';
import { output } from '@becomes/cms-most/frontend/_output-path';
import * as React from 'react';
import { FC, useEffect, useRef, useState } from 'react';

interface Props {
  media: BCMSMediaParsed;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  options?: BCMSMostImageProcessorProcessOptions;
}

const BCMSImage: FC<Props> = ({ media, options, className, id, style }) => {
  const handler = createBcmsImageHandler(media, options, output);
  const [srcSet, setSrcSet] = useState(handler.getSrcSet());
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.removeEventListener('resize', resizeHandler);
    const el = container.current;
    if (!el) {
      return;
    }
    function resizeHandler() {
      if (el) {
        setSrcSet(
          handler.getSrcSet({
            width: el.offsetWidth,
          }),
        );
      }
    }
    resizeHandler();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [media, options]);

  return (
    <div id={id} className={className} style={style} ref={container}>
      {handler.parsable ? (
        <picture>
          <source srcSet={'/api' + srcSet[0]} />
          <source srcSet={'/api' + srcSet[1]} />
          <img
            data-bcms-image={handler.optionString + ';' + media.src}
            src={output + media.src}
            alt={media.alt_text}
            width={srcSet[2]}
            height={srcSet[3]}
          />
        </picture>
      ) : (
        <img
          src={srcSet[0]}
          alt={media.alt_text}
          width={media.width}
          height={media.height}
        />
      )}
    </div>
  );
};

export default BCMSImage;
