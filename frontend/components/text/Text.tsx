import cn from 'classnames';
import { FC } from 'react';

type Props = {
  className?: string;
  readOnly?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const Text: FC<Props> = ({ className, readOnly, value, onChange }) => (
  <textarea
    className={cn('h-96 w-full rounded-lg p-4', className)}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
  />
);

export default Text;
