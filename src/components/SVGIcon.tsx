import { logger } from '@/utils/logger';
import { FC, SVGProps, useEffect, useRef, useState } from 'react';

type SVGComponent = FC<SVGProps<SVGSVGElement>>;

export interface SVGIconOptions {
  onCompleted?: (name: Icons, svg: SVGComponent | undefined) => void;
  onError?: (error: Error) => void;
}

export const useSVGIcon = (name: Icons, options: SVGIconOptions = {}) => {
  const iconRef = useRef<SVGComponent>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);

  const loadIcon = async () => {
    setLoading(true);
    try {
      const module = await import(`@/assets/icons/${name}.svg`);
      iconRef.current = module.ReactComponent;
      options.onCompleted?.(name, iconRef.current);
      logger('SVGIcon', `Loaded icon: ${name}`, module);
    } catch (error) {
      setError(error as Error);
      options.onError?.(error as Error);
      logger('SVGIcon', `Failed to load icon: ${name}`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => void loadIcon(), [name]);

  return { error, loading, Icon: iconRef.current };
};

interface Props extends SVGProps<SVGSVGElement> {
  name: Icons;
}

// NOTE: seems to split svgs into separate chunks from the main bundle
const SVGIcon: FC<Props> = ({ name, ...svgProps }) => {
  const { Icon } = useSVGIcon(name);

  return Icon ? <Icon {...svgProps} /> : null;
};

export default SVGIcon;

type Icons =
  | 'attended-transfer'
  | 'blind-transfer'
  | 'keypad'
  | 'mic'
  | 'mic-off'
  | 'note'
  | 'note-submitted'
  | 'pause'
  | 'play'
  | 'user';
