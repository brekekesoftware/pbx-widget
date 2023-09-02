import { logger } from '@/utils/logger';
import { FC, SVGProps, useCallback, useEffect, useRef, useState } from 'react';

type SVGComponent = FC<SVGProps<SVGSVGElement>>;

export interface SVGIconOptions {
  onCompleted?: (name: Icons, svg: SVGComponent | undefined) => void;
  onError?: (error: Error) => void;
}

export const useSVGIcon = (name: Icons, options: SVGIconOptions = {}) => {
  const iconRef = useRef<SVGComponent>();
  const optionsRef = useRef<SVGIconOptions>(options);
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);

  useEffect(() => void (optionsRef.current = options), [options]);

  const loadIcon = useCallback(async () => {
    setLoading(true);
    const { onCompleted, onError } = optionsRef.current;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const module = await import(`@/assets/icons/${name}.svg`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      iconRef.current = module.ReactComponent;
      setError(undefined);
      onCompleted?.(name, iconRef.current);
      logger('SVGIcon', `Loaded icon: ${name}`, module);
    } catch (error) {
      setError(error as Error);
      onError?.(error as Error);
      logger('SVGIcon', `Failed to load icon: ${name}`, error);
    } finally {
      setLoading(false);
    }
  }, [name]);

  useEffect(() => void loadIcon(), [loadIcon]);

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
  | 'play';
