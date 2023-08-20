import { FC } from 'react';

interface Props {
  value: string | any;
  onClick: () => void;
}

const Button: FC<Props> = ({ value, onClick }) => {
  return (
    <button
      className="rounded flex items-center justify-center h-12 font-bold text-black border shadow-sm active:shadow-none"
      onClick={onClick}>
      {value}
    </button>
  );
};

export default Button;
