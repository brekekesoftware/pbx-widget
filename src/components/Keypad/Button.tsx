import { FC } from 'react';

interface Props {
  value: string | any;
  onClick: () => void;
}

const Button: FC<Props> = ({ value, onClick }) => {
  return (
    <button
      className="flex h-12 items-center justify-center rounded border font-bold text-black shadow-sm active:shadow-none"
      onClick={onClick}>
      {value}
    </button>
  );
};

export default Button;
