import cn from 'classnames';
import { FC } from 'react';

type Props = {
  title?: string;
  children?: React.ReactNode;
  className?: string;
};

const Card: FC<Props> = ({ title, children, className }) => (
  <div className={cn('rounded-lg bg-gray-100 py-8 px-4 lg:px-8', className)}>
    {title && <h2 className="mb-4 text-2xl">{title}</h2>}
    {children}
  </div>
);

export default Card;
