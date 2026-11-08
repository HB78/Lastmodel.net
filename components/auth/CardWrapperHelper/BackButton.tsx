import Link from 'next/link';

// Simple lien (avant : un <Link> dans un <Button> → HTML invalide,
// et seul le texte était cliquable)
const BackButton = ({ label, href }: { label: string; href: string }) => {
  return (
    <div className="w-full text-center">
      <Link
        href={href}
        className="text-sm font-medium text-purple-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
      >
        {label}
      </Link>
    </div>
  );
};

export default BackButton;
