import Link from 'next/link';
import { GrGithub } from 'react-icons/gr';

const Footer = () => (
  <footer className="py-12 px-4 lg:px-8">
    <div className="flex flex-col items-center justify-center gap-4">
      <Link href="https://github.com/iammatthi/pbc" target="_blank">
        <GrGithub size={30} />
      </Link>
    </div>
  </footer>
);

export default Footer;
